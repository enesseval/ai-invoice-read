"use client";

import { signInFormSchema } from "@/lib/form-schemas";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // useState ve useEffect import edildi
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, signInWithGoogle } from "@/utils/supabase/actions"; // signIn ve signInWithGoogle import edildi
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"; // useRouter ve useSearchParams import edildi
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc"; // Google ikonu import edildi
import { IoLogoApple } from "react-icons/io5"; // Apple ikonu import edildi

function SignIn() {
   const t = useTranslations("schemas"); // Genel şema çevirileri
   const tSignIn = useTranslations("signInPage"); // Giriş sayfası çevirileri
   const tSignUp = useTranslations("signUpPage"); // Sign up sayfasındaki ortak çeviriler için (or, continueWith...)
   const formSchema = signInFormSchema(t); // Giriş formu şeması
   const router = useRouter();
   const searchParams = useSearchParams(); // searchParams hook'u kullanıldı
   const [isSubmitting, setIsSubmitting] = useState(false);

   // URL'deki mesajları göstermek için useEffect
   useEffect(() => {
      const message = searchParams.get("message");
      if (message) {
         // Mesajın türüne göre toast gösterilebilir, şimdilik error varsayalım
         // Daha gelişmiş bir yapı için mesaj formatını kontrol edebilirsiniz (örn: "error:...", "success:...")
         toast.error(decodeURIComponent(message)); // Mesaj decode edilmeli
         // Mesajı gösterdikten sonra URL'den temizlemek isteyebilirsiniz (isteğe bağlı)
         // router.replace('/sign-in', undefined); // Tarayıcı geçmişini temiz tutar
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [searchParams]); // searchParams değiştiğinde çalışır

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const handleSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
         // signIn action'ı artık username döndürüyor
         const result = await signIn(values); // signIn fonksiyonu çağrıldı

         if (result.success && result.username) {
            // Check for username instead of userId
            toast.success(tSignIn("toastSuccess"));
            form.reset();
            // Başarılı giriş sonrası username ile yönlendirme (direkt /username)
            setTimeout(() => {
               router.push(`/${result.username}`); // Yönlendirme: /[username]
            }, 1500); // Kısa bir gecikme
         } else if (result.success && !result.username) {
            // Başarılı ama username yoksa (beklenmedik durum, örn. profil bulunamadı), genel hata göster
            console.error("Sign in successful but missing username (profile might be missing).");
            // Daha spesifik bir hata mesajı gösterilebilir
            toast.error(tSignIn("toastErrorUnexpected", { error: result.errorCode || "Missing username" }));
         } else {
            // Supabase'den gelen özel hata kodunu kontrol et (Giriş başarısız)
            if (result.errorCode === "invalid_credentials") {
               toast.error(tSignIn("toastErrorInvalidCredentials"));
            } else {
               // Diğer genel hatalar için authErrors kullanabiliriz veya signInPage'e ekleyebiliriz
               // Şimdilik genel bir hata mesajı gösterelim
               toast.error(tSignIn("toastErrorUnexpected", { error: result.errorCode || "Bilinmeyen Hata" }));
               console.error("Sign in error:", result.errorCode);
            }
         }
      } catch (error) {
         console.error("Unexpected sign in error:", error);
         toast.error(tSignIn("toastErrorUnexpected", { error: String(error) }));
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleGoogleSignIn = async () => {
      setIsSubmitting(true); // Butonu disable etmek için
      try {
         // Server action'ı doğrudan çağırıyoruz.
         // Bu action başarılı olursa Google'a, hata olursa /sign-in'e yönlendirecek.
         await signInWithGoogle();
         // Yönlendirme action içinde olduğu için burada ek bir işlem yapmaya gerek yok.
         // Hata durumunda action /sign-in?message=... şeklinde yönlendireceği için
         // useEffect içindeki toast mesajı gösterilecek.
      } catch (error) {
         // Action içinde redirect olduğu için buraya normalde düşmemeli.
         // Ancak beklenmedik bir client-side hata olursa yakalayalım.
         console.error("Unexpected error during Google sign-in initiation:", error);
         toast.error(tSignIn("toastErrorUnexpected", { error: String(error) }));
         setIsSubmitting(false); // Hata durumunda butonu tekrar aktif et
      }
      // Başarılı yönlendirme durumunda sayfa değişeceği için setIsSubmitting(false) demeye gerek yok.
      // Ama hata durumunda veya action'ın redirect yapmadığı (beklenmedik) durumlarda gerekebilir.
      // Şimdilik action'ın her zaman redirect yaptığını varsayıyoruz. Gerekirse buraya false eklenir.
   };

   return (
      // Ana grid yapısı korunuyor, ancak içerik form ile doldurulacak
      <div className="grid grid-cols-1 lg:grid-cols-2 py-2 h-screen w-11/12 mx-auto relative lg:overflow-y-hidden">
         {/* Sol Taraf: Logo, Başlık, Alt Başlık ve Form */}
         <div className="w-full flex items-center order-2 lg:order-1 col-span-2 lg:col-span-1 ">
            <div className="w-full h-full mx-auto lg:mr-auto">
               <div className="w-full h-full px-2 lg:px-6 flex flex-col mt-5">
                  <Image src={"/chorifyx-logo.png"} alt={tSignIn("logoAlt")} width={200} height={100} />

                  <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold font-space-grotesk text-slate-600 mt-3">{tSignIn("mainHeading")}</h2>
                  <p className="font-space-grotesk text-slate-600">{tSignIn("subHeading")}</p>

                  <div className="h-full flex flex-col justify-between mt-3">
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 my-2">
                           <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>{tSignIn("emailLabel")}</FormLabel>
                                    <FormControl>
                                       <Input placeholder={tSignIn("emailPlaceholder")} type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>{tSignIn("passwordLabel")}</FormLabel>
                                    <FormControl>
                                       <Input placeholder={tSignIn("passwordPlaceholder")} type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <Button
                              type="submit"
                              disabled={isSubmitting}
                              className={cn(
                                 "w-full h-12 border-none font-bold tracking-wider text-lg hover:cursor-pointer disabled:opacity-50 flex items-center justify-center", // Boyutlar ayarlandı
                                 isSubmitting && "w-12 mx-auto" // Yüklenirken küçülme efekti
                              )}
                           >
                              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : tSignIn("signInButton")}
                           </Button>

                           {/* Şifremi Unuttum Linki */}
                           <div className="text-right mt-2">
                              <a href="#" className="text-sm text-blue-600 hover:underline">
                                 {tSignIn("forgotPasswordLink")}
                              </a>
                           </div>

                           {/* "Veya" Ayırıcı */}
                           <div className="relative my-6">
                              <div className="absolute inset-0 flex items-center">
                                 <div className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-lg">
                                 {/* Ekran boyutuna göre farklı metin gösterimi (signUpPage'den anahtarlar kullanılıyor) */}
                                 <span className="px-4 bg-background text-muted-foreground font-medium uppercase lg:hidden">{tSignUp("orContinueWith")}</span>
                                 <span className="hidden px-4 bg-background text-muted-foreground font-medium uppercase lg:inline">{tSignUp("or")}</span>
                              </div>
                           </div>

                           {/* Google ve Apple ile Giriş Butonları */}
                           {/* TODO: Bu butonlara onClick event'leri eklenerek OAuth sign-in fonksiyonları çağrılmalı */}
                           <div>
                              <Button onClick={handleGoogleSignIn} variant="outline" type="button" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                 <FcGoogle className="size-5 flex-shrink-0" />
                                 {/* Ekran boyutuna göre farklı metin gösterimi (signUpPage'den anahtarlar kullanılıyor) */}
                                 <span className="lg:hidden">{tSignUp("google")}</span>
                                 <span className="hidden lg:inline">{tSignUp("continueWithGoogle")}</span>
                              </Button>
                              {/* <Button variant="outline" type="button" disabled={isSubmitting} className="flex items-center justify-center gap-2">
                                 <IoLogoApple className="size-5 flex-shrink-0" />
                                 
                                 <span className="lg:hidden">{tSignUp("apple")}</span>
                                 <span className="hidden lg:inline">{tSignUp("continueWithApple")}</span>
                              </Button> */}
                           </div>

                           {/* Kayıt Ol Linki */}
                           <div className="mt-6 text-center text-sm">
                              {tSignIn("dontHaveAccount")}{" "}
                              <a href="/sign-up" className="font-medium text-blue-600 hover:underline">
                                 {tSignIn("signUpLink")}
                              </a>
                           </div>
                        </form>
                     </Form>
                     {/* Copyright metni formun altına alındı */}
                     <div className="w-full flex justify-center mt-10 mb-7">
                        <p className="font-space-grotesk text-slate-400">{tSignIn("copyright")}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         {/* Sağ Taraf: Resim */}
         <div className="w-full h-full min-h-44 flex items-center order-1 lg:order-2 col-span-2 lg:col-span-1">
            <div className="w-full h-full mx-auto lg:ml-auto relative">
               <Image src={"/login-image.png"} alt={tSignIn("loginImageAlt")} fill className="object-cover rounded-4xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
            </div>
         </div>
      </div>
   );
}

export default SignIn;
