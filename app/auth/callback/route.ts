import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Helper function to generate username (actions.ts'den kopyalandı)
// TODO: Bunu ortak bir yardımcı modüle taşıyabilirsin
function generateUsername(name: string, surname: string): string {
   const cleanedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
   const cleanedSurname = surname.toLowerCase().replace(/[^a-z0-9]/g, "");
   // Basit birleştirme, daha karmaşık veya benzersizlik kontrolü eklenebilir
   // Benzersizliği sağlamak için sonuna rastgele karakterler eklenebilir
   // const randomSuffix = Math.random().toString(36).substring(2, 7);
   // return `${cleanedName}${cleanedSurname}${randomSuffix}`;
   return `${cleanedName}${cleanedSurname}`; // Şimdilik basit tutalım
}

// Helper function to extract name/surname from metadata
function extractNameParts(metadata: any): { name: string; surname: string } {
   let name = metadata?.name || "";
   let surname = metadata?.surname || "";

   if (!name && metadata?.full_name) {
      const parts = metadata.full_name.trim().split(" ");
      if (parts.length > 1) {
         name = parts.slice(0, -1).join(" ");
         surname = parts[parts.length - 1];
      } else {
         name = parts[0] || "Kullanici"; // Fallback
         surname = ""; // Fallback
      }
   } else if (!name) {
      name = "Kullanici"; // Fallback if no name info at all
   }
   if (!surname) {
      surname = ""; // Ensure surname is at least an empty string
   }

   return { name, surname };
}

export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get("code");

   if (code) {
      const supabase = await createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
         // Kod değişimi başarılı, kullanıcıyı alalım
         const {
            data: { user },
            error: userError,
         } = await supabase.auth.getUser();

         if (userError || !user) {
            console.error("Error getting user after code exchange:", userError?.message);
            return NextResponse.redirect(`${origin}/sign-in?message=${encodeURIComponent("Authentication successful, but failed to retrieve user details.")}`);
         }

         // Kullanıcı alındı, şimdi profili kontrol et veya oluştur
         try {
            // 1. Mevcut profili ara
            let { data: profile, error: profileSelectError } = await supabase.from("profiles").select("username").eq("id", user.id).single();

            let username: string | null = null;

            if (profileSelectError && profileSelectError.code !== "PGRST116") {
               // PGRST116: Row not found, bu beklenen bir hata olabilir
               console.error("Error selecting profile:", profileSelectError.message);
               throw new Error("Failed to check user profile."); // Genel hata fırlat
            }

            if (profile) {
               // Profil bulundu
               username = profile.username;
               console.log(`Profile found for user ${user.id}, username: ${username}`);
            } else {
               // Profil bulunamadı, yeni profil oluştur
               console.log(`Profile not found for user ${user.id}. Creating new profile...`);
               const { name, surname } = extractNameParts(user.user_metadata);
               const newUsername = generateUsername(name, surname);

               // TODO: Username çakışması kontrolü eklenebilir (generateUsername içinde veya burada bir döngü ile)

               const { error: profileInsertError } = await supabase.from("profiles").insert({
                  id: user.id,
                  username: newUsername,
                  name: name,
                  surname: surname,
               });

               if (profileInsertError) {
                  console.error("Error inserting new profile:", profileInsertError.message);
                  // Eğer hata 'unique constraint' ise (username zaten varsa), farklı bir username ile tekrar deneyebilir veya hata verebiliriz.
                  if (profileInsertError.code === "23505") {
                     // Unique violation
                     // TODO: Handle username collision (e.g., generate a new one and retry)
                     throw new Error(`Username '${newUsername}' already exists. Please try logging in again or contact support.`);
                  }
                  throw new Error("Failed to create user profile."); // Genel hata fırlat
               }
               username = newUsername;
               console.log(`New profile created for user ${user.id}, username: ${username}`);
            }

            // Yönlendirme URL'sini oluştur
            if (username) {
               const redirectPath = `/${username}`; // Hedef yol: /[username]
               const forwardedHost = request.headers.get("x-forwarded-host");
               const isLocalEnv = process.env.NODE_ENV === "development";
               let redirectUrlBase = origin;

               if (!isLocalEnv && forwardedHost) {
                  redirectUrlBase = `https://${forwardedHost}`;
               }

               const finalRedirectUrl = `${redirectUrlBase}${redirectPath}`;
               console.log(`Redirecting to user page: ${finalRedirectUrl}`);
               return NextResponse.redirect(finalRedirectUrl);
            } else {
               // Bu duruma normalde gelinmemeli
               throw new Error("Failed to determine username after profile check/creation.");
            }
         } catch (error: any) {
            console.error("Error during profile check/creation:", error.message);
            return NextResponse.redirect(`${origin}/sign-in?message=${encodeURIComponent("Authentication successful, but failed to process profile: " + error.message)}`);
         }
      } else {
         console.error("Error exchanging code for session:", exchangeError.message);
         return NextResponse.redirect(`${origin}/sign-in?message=${encodeURIComponent("Could not exchange code for session: " + exchangeError.message)}`);
      }
   }

   // Kod parametresi yoksa veya başka bir hata oluştuysa hata sayfasına yönlendir
   console.error("Missing code in callback URL or other error.");
   return NextResponse.redirect(`${origin}/sign-in?message=${encodeURIComponent("Authentication failed: Missing code.")}`);
}
