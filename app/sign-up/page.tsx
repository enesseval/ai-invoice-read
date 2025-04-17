"use client";

import { signUpFormSchema } from "@/lib/form-schemas";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp, signInWithGoogle } from "@/utils/supabase/actions"; // signInWithGoogle import edildi
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Loader2 ikonu import edildi
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";

function SignUp() {
   const t = useTranslations("schemas");
   const tAuthErrors = useTranslations("authErrors");
   const tSignUp = useTranslations("signUpPage"); // Yeni çeviriler için hook
   const formSchema = signUpFormSchema(t);
   const router = useRouter(); // useRouter hook'u kullanıldı
   const [isSubmitting, setIsSubmitting] = useState(false); // Gönderim durumu için state

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         // Başlangıç değerleri eklendi
         name: "",
         surname: "",
         email: "",
         password: "",
      },
   });

   const handleSubmit = async (values: z.infer<typeof formSchema>) => {
      // async eklendi
      setIsSubmitting(true); // Gönderim başladı
      try {
         // signUp action'ı artık username döndürüyor
         const result = await signUp(values); // await ile sonuç bekleniyor

         if (result.success && result.username) {
            // Check for username instead of userId
            toast.success(tSignUp("toastSuccess")); // Başarı bildirimi
            // Formu sıfırla (isteğe bağlı)
            form.reset();
            // Başarılı kayıt sonrası username ile yönlendirme (direkt /username)
            setTimeout(() => {
               router.push(`/${result.username}`); // Yönlendirme: /[username]
            }, 2000);
         } else if (result.success && !result.username) {
            // Başarılı ama username yoksa (beklenmedik durum), genel hata göster
            console.error("Sign up successful but missing username.");
            toast.error(tSignUp("toastErrorUnexpected", { error: "Missing username" }));
         } else {
            // Kayıt başarısız
            console.log("Sign up failed:", result);
            toast.error(tAuthErrors(`${result.errorCode}`)); // Hata bildirimi
         }
      } catch (error) {
         console.error("Unexpected sign up error:", error);
         toast.error(tSignUp("toastErrorUnexpected", { error: String(error) })); // Hata bildirimi
      } finally {
         setIsSubmitting(false); // Gönderim bitti
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
         // kullanıcı giriş sayfasına yönlendirilecek ve orada hata mesajı gösterilecek.
      } catch (error) {
         // Action içinde redirect olduğu için buraya normalde düşmemeli.
         // Ancak beklenmedik bir client-side hata olursa yakalayalım.
         console.error("Unexpected error during Google sign-in initiation:", error);
         // Sign-up sayfasında olduğumuz için signUpPage'den bir hata mesajı kullanabiliriz.
         toast.error(tSignUp("toastErrorUnexpected", { error: String(error) }));
         setIsSubmitting(false); // Hata durumunda butonu tekrar aktif et
      }
      // Başarılı yönlendirme durumunda sayfa değişeceği için setIsSubmitting(false) demeye gerek yok.
   };

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 py-2 h-screen w-11/12 mx-auto relative lg:overflow-y-hidden">
         <div className="w-full flex items-center order-2 lg:order-1 col-span-2 lg:col-span-1 ">
            <div className="w-full h-full mx-auto lg:mr-auto">
               <div className="w-full h-full px-2 lg:px-6 flex flex-col mt-5">
                  <Image src={"/chorifyx-logo.png"} alt={tSignUp("logoAlt")} width={200} height={100} />

                  <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold font-space-grotesk text-slate-600 mt-3">{tSignUp("mainHeading")}</h2>
                  <p className="font-space-grotesk text-slate-600">{tSignUp("subHeading")}</p>
                  <div className="h-full flex flex-col justify-between mt-3">
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 my-2">
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:my-10">
                              <FormField
                                 control={form.control}
                                 name="name"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>{tSignUp("firstNameLabel")}</FormLabel>
                                       <FormControl>
                                          <Input placeholder={tSignUp("firstNamePlaceholder")} type="text" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                              <FormField
                                 control={form.control}
                                 name="surname" // name="name" -> name="surname"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>{tSignUp("lastNameLabel")}</FormLabel>
                                       <FormControl>
                                          <Input placeholder={tSignUp("lastNamePlaceholder")} type="text" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                              <FormField
                                 control={form.control}
                                 name="email"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>{tSignUp("emailLabel")}</FormLabel>
                                       <FormControl>
                                          <Input placeholder={tSignUp("emailPlaceholder")} type="email" {...field} />
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
                                       <FormLabel>{tSignUp("passwordLabel")}</FormLabel>
                                       <FormControl>
                                          <Input placeholder={tSignUp("passwordPlaceholder")} type="password" {...field} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>
                           <Button
                              type="submit"
                              disabled={isSubmitting}
                              className={cn(
                                 "w-full min-w-10 md:min-w-12 lg:min-w-16 h-10 md:h-12 lg:h-16 border-none font-bold tracking-wider text-lg hover:cursor-pointer disabled:opacity-50 flex items-center justify-center transition-width duration-300 ease-in-out",
                                 isSubmitting && "w-10 md:w-12 lg:w-16 mx-auto"
                              )}
                           >
                              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : tSignUp("signUpButton")}
                           </Button>

                           {/* Şifremi Unuttum Linki (İsteğe bağlı olarak eklendi) */}
                           <div className="text-right mt-2">
                              <a href="#" className="text-sm text-blue-600 hover:underline">
                                 {tSignUp("forgotPasswordLink")}
                              </a>
                           </div>

                           {/* "Veya" Ayırıcı */}
                           <div className="relative my-6">
                              <div className="absolute inset-0 flex items-center">
                                 <div className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-lg">
                                 {/* Ekran boyutuna göre farklı metin gösterimi */}
                                 <span className="px-4 bg-background text-muted-foreground font-medium uppercase lg:hidden">{tSignUp("orContinueWith")}</span>
                                 <span className="hidden px-4 bg-background text-muted-foreground font-medium uppercase lg:inline">{tSignUp("or")}</span>
                              </div>
                           </div>

                           {/* Google ve Apple ile Giriş Butonları */}
                           <div>
                              <Button onClick={handleGoogleSignIn} variant="outline" type="button" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                 <FcGoogle className="size-5 flex-shrink-0" />
                                 {/* Ekran boyutuna göre farklı metin gösterimi */}
                                 <span className="lg:hidden">{tSignUp("google")}</span>
                                 <span className="hidden lg:inline">{tSignUp("continueWithGoogle")}</span>
                              </Button>
                              {/* <Button variant="outline" type="button" disabled={isSubmitting} className="flex items-center justify-center gap-2">
                                 <IoLogoApple className="size-5 flex-shrink-0" />
                                 
                                 <span className="lg:hidden">{tSignUp("apple")}</span>
                                 <span className="hidden lg:inline">{tSignUp("continueWithApple")}</span>
                              </Button> */}
                           </div>

                           {/* Giriş Yap Linki */}
                           <div className="mt-6 text-center text-sm">
                              {tSignUp("alreadyHaveAccount")}{" "}
                              <a href="/sign-in" className="font-medium text-blue-600 hover:underline">
                                 {tSignUp("signInLink")}
                              </a>
                           </div>
                        </form>
                     </Form>
                     <div className="w-full flex justify-center mb-7">
                        <p className="font-space-grotesk text-slate-400">{tSignUp("copyright")}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="w-full h-full min-h-44 flex items-center order-1 lg:order-2 col-span-2 lg:col-span-1">
            <div className="w-full h-full mx-auto lg:ml-auto relative">
               <Image src={"/login-image.png"} alt={tSignUp("loginImageAlt")} fill className="object-cover rounded-4xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
            </div>
         </div>
      </div>
   );
}

export default SignUp;
