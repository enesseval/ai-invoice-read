import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Mail, Receipt, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function LoginComponent() {
   const [formState, setFormState] = useState({
      email: "",
      password: "",
   });
   const [focused, setFocused] = useState<string | null>(null);
   const [submitted, setSubmitted] = useState(false);

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
         },
      },
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: { type: "spring", stiffness: 100 },
      },
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      // Simulate loading
      setTimeout(() => {
         setSubmitted(false);
      }, 2000);
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState({
         ...formState,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-slate-100">
         {/* Background elements */}
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-purple-50/40 to-blue-50/40 blur-3xl" />
            <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-blue-50/40 to-emerald-50/40 blur-3xl" />

            {/* Animated background shapes */}
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.05, scale: 1, rotate: 360 }}
               transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
               className="absolute top-[10%] left-[15%] w-64 h-64 border border-slate-300/30 rounded-full"
            />
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.05, scale: 1, rotate: -360 }}
               transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
               className="absolute bottom-[20%] right-[10%] w-96 h-96 border border-slate-300/30 rounded-full"
            />
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.05, scale: 1, rotate: 360 }}
               transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
               className="absolute top-[40%] right-[30%] w-48 h-48 border border-slate-300/30 rounded-full"
            />
         </div>

         <div className="container mx-auto px-4 z-10">
            <div className="flex flex-col lg:flex-row max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
               {/* Left side - Illustration */}
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="lg:w-1/2 bg-gradient-to-br from-violet-500 to-indigo-600 p-12 flex flex-col justify-between relative overflow-hidden"
               >
                  <div className="absolute inset-0 opacity-10">
                     <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {Array.from({ length: 10 }).map((_, i) => (
                           <motion.path
                              key={i}
                              d={`M${i * 10},0 Q${i * 10 + 5},50 ${i * 10},100`}
                              stroke="white"
                              strokeWidth="0.5"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: i * 0.2, ease: "easeInOut" }}
                           />
                        ))}
                        {Array.from({ length: 10 }).map((_, i) => (
                           <motion.path
                              key={i + 10}
                              d={`M0,${i * 10} Q50,${i * 10 + 5} 100,${i * 10}`}
                              stroke="white"
                              strokeWidth="0.5"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: i * 0.2, ease: "easeInOut" }}
                           />
                        ))}
                     </svg>
                  </div>

                  <div className="relative z-10">
                     <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                           <Receipt className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-white text-3xl font-bold">Fatura Analiz</h1>
                     </motion.div>

                     <motion.h2 className="text-white text-4xl font-bold mb-6" variants={itemVariants} initial="hidden" animate="visible">
                        Faturalarınızı Yapay Zeka ile Analiz Edin
                     </motion.h2>

                     <motion.p className="text-indigo-100 mb-8 text-lg" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        Faturalarınızı yükleyin, kategorize edin ve finansal verilerinizi anında analiz edin. Yapay zeka destekli sistemimiz ile fatura yönetimi artık çok daha kolay.
                     </motion.p>

                     <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                        {[
                           {
                              icon: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
                              text: "Otomatik fatura tanıma ve kategorizasyon",
                           },
                           {
                              icon: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
                              text: "Gelişmiş veri analizi ve raporlama",
                           },
                           {
                              icon: <CheckCircle2 className="h-5 w-5 text-emerald-300" />,
                              text: "Güvenli veri saklama ve yönetimi",
                           },
                        ].map((item, index) => (
                           <motion.div key={index} className="flex items-center" variants={itemVariants}>
                              <div className="mr-3">{item.icon}</div>
                              <p className="text-white">{item.text}</p>
                           </motion.div>
                        ))}
                     </motion.div>
                  </div>

                  <motion.div className="relative z-10 mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
                     <p className="text-indigo-200 text-sm">Binlerce kullanıcı tarafından tercih edilen çözüm</p>
                     <div className="flex items-center mt-3">
                        <div className="flex -space-x-2">
                           {[1, 2, 3, 4].map((i) => (
                              <div
                                 key={i}
                                 className="w-8 h-8 rounded-full bg-indigo-400/30 backdrop-blur-sm border border-indigo-300/50 flex items-center justify-center text-xs text-white font-medium"
                              >
                                 {i}
                              </div>
                           ))}
                        </div>
                        <div className="ml-4">
                           <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <svg key={star} className="w-4 h-4 text-yellow-300 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                 </svg>
                              ))}
                           </div>
                           <p className="text-indigo-200 text-xs mt-1">4.9/5 ortalama puan</p>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>

               {/* Right side - Form */}
               <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="lg:w-1/2 p-8 md:p-12">
                  <div className="max-w-md mx-auto">
                     <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Hesabınıza Giriş Yapın</h2>
                        <p className="text-slate-500 mt-2">Faturalarınızı analiz etmek için giriş yapın</p>
                     </div>

                     <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} onSubmit={handleSubmit} className="space-y-5">
                        <motion.div className="space-y-2" variants={itemVariants} initial="hidden" animate="visible">
                           <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                              E-posta Adresi
                           </Label>
                           <div className={cn("relative group", focused === "email" ? "ring-2 ring-indigo-200" : "")}>
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                 <Mail className={cn("h-5 w-5 transition-colors", focused === "email" ? "text-indigo-500" : "text-slate-400")} />
                              </div>
                              <Input
                                 id="email"
                                 name="email"
                                 type="email"
                                 value={formState.email}
                                 onChange={handleInputChange}
                                 onFocus={() => setFocused("email")}
                                 onBlur={() => setFocused(null)}
                                 className="pl-10 py-6 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                 placeholder="ornek@sirket.com"
                              />
                           </div>
                        </motion.div>

                        <motion.div className="space-y-2" variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                 Şifre
                              </Label>
                              <Button variant="link" className="px-0 text-xs font-normal h-auto text-indigo-600">
                                 Şifremi Unuttum
                              </Button>
                           </div>
                           <div className={cn("relative group", focused === "password" ? "ring-2 ring-indigo-200" : "")}>
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                 <Lock className={cn("size-5 transition-colors", focused === "password" ? "text-indigo-500" : "text-slate-400")} />
                              </div>
                              <Input
                                 id="password"
                                 name="password"
                                 type="password"
                                 value={formState.password}
                                 onChange={handleInputChange}
                                 onFocus={() => setFocused("password")}
                                 onBlur={() => setFocused(null)}
                                 className="pl-10 py-6 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                 placeholder="••••••••"
                              />
                           </div>
                        </motion.div>

                        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                           <Button
                              type="submit"
                              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                              disabled={submitted}
                           >
                              {submitted ? (
                                 <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                       <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                       ></path>
                                    </svg>
                                    İşleniyor...
                                 </div>
                              ) : (
                                 <>
                                    Giriş Yap
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                 </>
                              )}
                           </Button>
                        </motion.div>
                     </motion.form>

                     <div className="mt-8">
                        <div className="relative">
                           <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-slate-200"></div>
                           </div>
                           <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-slate-500">veya şununla devam et</span>
                           </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                           <Button variant="outline" className="py-5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm">
                              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                 <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path
                                       fill="#4285F4"
                                       d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                                    />
                                    <path
                                       fill="#34A853"
                                       d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                                    />
                                    <path
                                       fill="#FBBC05"
                                       d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                                    />
                                    <path
                                       fill="#EA4335"
                                       d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                                    />
                                 </g>
                              </svg>
                              Google
                           </Button>
                           <Button variant="outline" className="py-5 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm">
                              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5a4.38 4.38 0 0 0-3 1.52 4.13 4.13 0 0 0-1 3.07 3.5 3.5 0 0 0 3-1.9z" fill="currentColor" />
                                 <path
                                    d="M18 8.5c-1.45 0-2.73.74-3.58 1.88-.35-.2-.73-.38-1.17-.38-.63 0-1.21.32-1.72.77-.52.45-.91 1.07-1.23 1.73-.3.67-.5 1.43-.6 2.13-.1.71-.1 1.3-.05 1.87H8c-1.1 0-2 .9-2 2v7a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-.64c.05-.76.2-1.3.36-1.67.17-.37.35-.6.5-.73.16-.13.3-.2.42-.2.12 0 .32.07.57.28.46.37 1.12.72 1.8.72.86 0 1.3-.35 1.8-.83.5-.48 1.03-1.2 2.19-1.2 1.5 0 2.5 1.05 2.5 2.33 0 1.27-.9 2.33-2 2.33-.55 0-1-.45-1-1s.45-1 1-1c.1 0 .18-.05.24-.12.06-.07.1-.16.1-.26 0-.22-.2-.45-.34-.45-1.2 0-1.82.95-2.23 1.5-.4.55-.66.83-1.27.83-.4 0-.73-.14-1-.32v4.29a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1.7c.09-.5.2-1.3.2-2 0-2.48-2.02-4.5-4.5-4.5z"
                                    fill="currentColor"
                                 />
                              </svg>
                              Apple
                           </Button>
                        </div>
                     </div>

                     <motion.p className="mt-8 text-center text-sm text-slate-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                        Henüz hesabınız yok mu?{" "}
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                           Hemen kaydolun
                        </Link>
                     </motion.p>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
   );
}

export default LoginComponent;
