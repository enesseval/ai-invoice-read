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
import { signUp } from "./action";

async function SignUp() {
   const t = useTranslations("schemas");
   const formSchema = signUpFormSchema(t);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
   });

   const handleSubmit = async (values: z.infer<typeof formSchema>) => {
      signUp(values);
   };

   return (
      <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-2 py-5 lg:py-10 h-screen w-11/12 mx-auto">
         <div className="w-full flex items-center row-span-3 lg:row-span-4 order-2 lg:order-1">
            <div className="w-full h-full mx-auto lg:mr-auto">
               <div className="w-full px-2 lg:px-6 flex flex-col space-y-5 my-5 lg:my-20">
                  <Image src={"/chorifyx-logo.png"} alt="chorifyx-logo" width={200} height={100} />

                  <h2 className="text-xl lg:text-3xl xl:text-5xl font-bold font-space-grotesk text-slate-600">Faturalarınızı Yapay Zeka ile Analiz Edin</h2>
                  <p className="font-space-grotesk text-slate-600">
                     Faturalarınızı yükleyin, kategorize edin ve finansal verilerinizi anında analiz edin. Yapay zeka destekli sistemimiz ile fatura yönetimi artık çok daha kolay.
                  </p>

                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 my-5">
                        <FormField
                           control={form.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Adınız</FormLabel>
                                 <FormControl>
                                    <Input placeholder="John" type="text" {...field} />
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
                                 <FormLabel>Soyadınız</FormLabel>
                                 <FormControl>
                                    <Input placeholder="Doe" type="text" {...field} />
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
                                 <FormLabel>E-posta</FormLabel> {/* Soyadınız -> E-posta */}
                                 <FormControl>
                                    <Input placeholder="example@example.com" type="email" {...field} />
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
                                 <FormLabel>Şifre</FormLabel>
                                 <FormControl>
                                    <Input placeholder="************" type="password" {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <Button type="submit" className="w-full h-16  border-none font-bold tracking-wider text-lg hover:cursor-pointer">
                           Kayıt Ol
                        </Button>
                     </form>
                  </Form>
                  <div className="w-full flex justify-center my-3">
                     <p className="font-space-grotesk text-slate-400">© 2025 Chorifyx All Rights Reserved</p>
                  </div>
               </div>
            </div>
         </div>
         <div className="w-full flex items-center row-span-1 lg:row-span-4 order-1 lg:order-2">
            <div className="w-full h-full mx-auto lg:ml-auto relative rounded-4xl">
               <Image src={"/login-image.png"} alt="login-image" fill className="object-cover rounded-4xl" />
            </div>
         </div>
      </div>
   );
}

export default SignUp;
