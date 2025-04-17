"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

// Helper function to generate username (simple example)
function generateUsername(name: string, surname: string): string {
   const cleanedName = name.toLowerCase().replace(/[^a-z0-9]/g, ""); // Sadece harf ve rakam
   const cleanedSurname = surname.toLowerCase().replace(/[^a-z0-9]/g, "");
   // Basit birleştirme, daha karmaşık veya benzersizlik kontrolü eklenebilir
   return `${cleanedName}${cleanedSurname}`;
}

// Update return type to include username on success
export async function signUp(values: any): Promise<{ success: boolean; messageKey: string; username?: string; errorCode?: string; errorMessage?: string }> {
   const supabase = await createClient();

   // 1. Auth Kullanıcısını Oluştur
   const {
      data: authData, // Rename data to authData to avoid conflict
      error: signUpError,
   } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
         // raw_user_meta_data'ya yine de ekleyebiliriz, yedeklilik sağlar
         data: {
            name: values.name,
            surname: values.surname,
         },
      },
   });

   if (signUpError) {
      console.error("Sign up error (auth):", signUpError.message);
      return { success: false, messageKey: "signUp.error", errorCode: signUpError.code, errorMessage: signUpError.message };
   }

   // Auth kullanıcısı başarıyla oluşturulduysa devam et
   if (authData.user) {
      const user = authData.user;
      const username = generateUsername(values.name, values.surname);

      // 2. Profiles Tablosuna Kayıt Ekle
      // ÖNEMLİ: Bu işlem auth.signUp ile atomik değil.
      // İdeal olarak Supabase Trigger veya Edge Function ile yapılmalı.
      // Şimdilik action içinde yapıyoruz.
      const { error: profileError } = await supabase
         .from("profiles") // 'profiles' tablo adını kullan
         .insert({
            id: user.id, // Auth kullanıcısının ID'si
            username: username,
            name: values.name,
            surname: values.surname,
            // created_at ve updated_at varsayılan değerlerini kullanır
         });

      if (profileError) {
         console.error("Sign up error (profile creation):", profileError.message);
         // Profil oluşturma hatası durumunda ne yapmalı?
         // Belki auth kullanıcısını silmek gerekebilir (rollback mantığı)
         // Şimdilik sadece hata döndürelim. Kullanıcı auth'ta var ama profili yok durumu oluşabilir.
         // TODO: Daha sağlam hata yönetimi ekle (örn: auth kullanıcısını sil)
         return { success: false, messageKey: "signUp.error.profile", errorCode: profileError.code, errorMessage: profileError.message };
      }

      // Hem auth hem profil başarılı
      console.log("Sign up successful, user and profile created:", user.id, username);
      return { success: true, messageKey: "signUp.success", username: username }; // userId yerine username döndür
   } else if (!signUpError && !authData.user) {
      // Auth başarılı ama user objesi null (beklenmedik durum)
      console.warn("Sign up successful (auth) but user object is null.");
      return { success: false, messageKey: "signUp.error", errorCode: "user_not_found_post_signup" };
   } else {
      // Diğer beklenmedik durumlar
      console.error("Sign up resulted in an unexpected state.");
      return { success: false, messageKey: "signUp.error", errorCode: "unexpected_signup_state" };
   }
}

// Update signIn to return username
export async function signIn(values: any): Promise<{ success: boolean; messageKey: string; username?: string; errorCode?: string; errorMessage?: string }> {
   const supabase = await createClient();

   // 1. Authenticate user
   const {
      data: authData, // Rename data
      error: signInError,
   } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
   });

   if (signInError) {
      console.error("Sign in error (auth):", signInError.message);
      if (signInError.message === "Invalid login credentials") {
         return { success: false, messageKey: "signIn.error", errorCode: "invalid_credentials", errorMessage: signInError.message };
      }
      return { success: false, messageKey: "signIn.error", errorCode: signInError.code, errorMessage: signInError.message };
   }

   // 2. If auth successful, fetch username from profiles table
   if (authData.user) {
      const user = authData.user;
      const { data: profile, error: profileError } = await supabase
         .from("profiles")
         .select("username") // Select only the username
         .eq("id", user.id) // Match the user ID
         .single(); // Expect only one row

      if (profileError) {
         console.error("Sign in error (fetching profile):", profileError.message);
         // Handle profile fetch error - maybe user exists in auth but not profiles?
         // Log out the user to avoid inconsistent state? Or return a specific error.
         // For now, return a generic error.
         // TODO: Implement more robust error handling (e.g., attempt profile creation or logout)
         return { success: false, messageKey: "signIn.error.profile", errorCode: profileError.code, errorMessage: profileError.message };
      }

      if (profile && profile.username) {
         console.log("Sign in successful, fetched username:", profile.username);
         return { success: true, messageKey: "signIn.success", username: profile.username }; // Return username
      } else {
         // Profile or username not found, though auth succeeded. This indicates an inconsistent state.
         console.error("Sign in error: Profile or username not found for user ID:", user.id);
         // TODO: Implement more robust error handling
         return { success: false, messageKey: "signIn.error.profile", errorCode: "profile_or_username_not_found" };
      }
   } else if (!signInError && !authData.user) {
      // Handle case where sign in succeeded (no error) but user object is null (shouldn't happen)
      console.warn("Sign in successful (auth) but user object is null.");
      return { success: false, messageKey: "signIn.error", errorCode: "user_not_found_post_signin" };
   } else {
      // Fallback for unexpected scenarios (e.g., no error but also no user, though handled above)
      console.error("Sign in resulted in an unexpected state.");
      return { success: false, messageKey: "signIn.error", errorCode: "unexpected_signin_state" };
   }
   // Removed the extra closing brace here
}

export async function signInWithGoogle() {
   const supabase = await createClient();
   const requestHeaders = await headers(); // Await the headers object
   const origin = requestHeaders.get("origin"); // Get origin from headers object

   if (!origin) {
      // Origin header yoksa hata döndür
      console.error("Google Sign in error: Origin header is missing");
      // Hata durumunda login sayfasına hata mesajıyla yönlendirelim
      return redirect(`/sign-in?message=${encodeURIComponent("Could not determine website origin.")}`);
      // Veya client'a uygun bir formatta hata objesi döndür
      // return { success: false, messageKey: "signIn.error.google.origin", errorCode: "missing_origin", errorMessage: "Origin header is missing" };
   }

   const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
         // Callback URL'sini dinamik olarak oluştur
         redirectTo: `${origin}/auth/callback`,
         // İsteğe bağlı: Google'dan refresh token almak için (dokümantasyondaki gibi)
         // queryParams: {
         //    access_type: 'offline',
         //    prompt: 'consent',
         // },
      },
   });

   if (error) {
      console.error("Google Sign in error:", error.message);
      // Hata durumunda login sayfasına hata mesajıyla yönlendirelim
      return redirect(`/sign-in?message=${encodeURIComponent(error.message)}`);
      // Veya client'a hata objesi döndür:
      // return { success: false, messageKey: "signIn.error.google", errorCode: error.code, errorMessage: error.message };
   }

   // Başarılı olursa, Supabase kullanıcıyı Google'a yönlendirir.
   // data.url içinde yönlendirme adresi bulunur. Next.js redirect ile yönlendirelim.
   if (data.url) {
      redirect(data.url); // Use Next.js redirect
   }

   // Normalde buraya gelinmemeli, redirect olmalı. Güvenlik için hata sayfasına yönlendirelim.
   return redirect("/sign-in?message=Could%20not%20authenticate%20with%20Google");
   // Veya client'a hata objesi döndür:
   // return { success: false, messageKey: "signIn.error.google.redirect", errorCode: "redirect_failed", errorMessage: "Failed to get redirect URL from Google" };
}
