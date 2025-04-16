"use client"; // useState, useEffect ve Framer Motion için gerekli

import React, { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button"; // Button component'inin yolunu projenize göre ayarlayın
import LoginComponent from "@/components/login";

export default function LoginPage() {
   const [activeView, setActiveView] = useState<"view1" | "view2">("view1");
   // Animasyonun hangi yönde (view1->view2 veya view2->view1) çalıştığını bilmek için önceki state'i tutalım
   const [previousView, setPreviousView] = useState<"view1" | "view2" | null>(null);
   const controlsRed = useAnimationControls();
   const controlsGreen = useAnimationControls();

   useEffect(() => {
      const sequence = async () => {
         // Sadece view gerçekten değiştiyse animasyonu çalıştır
         if (previousView === activeView) return;

         // İlk yüklemede previousView null olacak, view1'den view2'ye geçişi handle etmeliyiz.
         // Veya butona ilk tıklandığında previousView'ı set edebiliriz. handleViewChange bunu yapıyor.
         // Bu yüzden useEffect içinde null kontrolüne gerek yok gibi.

         if (activeView === "view2" && previousView === "view1") {
            // view1'den view2'ye animasyon
            console.log("Animating to View 2");
            // 1. Ölçeklendirme
            await Promise.all([controlsRed.start({ scale: 0.9, transition: { duration: 0.5 } }), controlsGreen.start({ scale: 1.1, transition: { duration: 0.5 } })]);
            // 2. Yer Değiştirme (Ölçekler korunur)
            await Promise.all([
               // Kırmızı div sağa hareket eder (x: 100px)
               controlsRed.start({ x: 160, transition: { duration: 0.55 } }),
               // Yeşil div sola hareket eder (x: -100px)
               controlsGreen.start({ x: -160, transition: { duration: 0.55 } }),
            ]);
            // 3. Ölçeği Sıfırlama
            await Promise.all([controlsRed.start({ scale: 1, transition: { duration: 0.5 } }), controlsGreen.start({ scale: 1, transition: { duration: 0.5 } })]);
         } else if (activeView === "view1" && previousView === "view2") {
            // view2'den view1'e geri animasyon
            console.log("Animating back to View 1");
            // Bu animasyon başladığında: kırmızı sağda (x: 100), yeşil solda (x: -100)
            // 1. Ölçeklendirme (Yeni tarife göre: Kırmızı her zaman 0.9, Yeşil her zaman 1.1)
            await Promise.all([
               controlsRed.start({ scale: 0.9, transition: { duration: 0.5 } }), // Kırmızı
               controlsGreen.start({ scale: 1.1, transition: { duration: 0.5 } }), // Yeşil
            ]);
            // 2. Yer Değiştirme (Ölçekler korunur, başlangıç pozisyonlarına dönme)
            await Promise.all([controlsRed.start({ x: 0, transition: { duration: 0.55 } }), controlsGreen.start({ x: 0, transition: { duration: 0.55 } })]);
            // 3. Ölçeği Sıfırlama
            await Promise.all([controlsRed.start({ scale: 1, transition: { duration: 0.5 } }), controlsGreen.start({ scale: 1, transition: { duration: 0.5 } })]);
         }
      };

      sequence();
      // previousView'ı dependency array'e eklemiyoruz çünkü state güncellendiğinde tekrar tetikler.
      // İçerideki kontrol yeterli.
   }, [activeView, previousView, controlsRed, controlsGreen]);

   const handleViewChange = (view: "view1" | "view2") => {
      // Sadece aktif view değişiyorsa state'leri güncelle
      if (view !== activeView) {
         setPreviousView(activeView); // Değişiklik yapmadan *önce* mevcut view'ı kaydet
         setActiveView(view);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
         <div className="mb-8 space-x-4">
            <Button onClick={() => handleViewChange("view1")} variant={activeView === "view1" ? "default" : "outline"}>
               View 1
            </Button>
            <Button onClick={() => handleViewChange("view2")} variant={activeView === "view2" ? "default" : "outline"}>
               View 2
            </Button>
         </div>

         {/* Animate edilen div'ler için container */}
         {/* x: 100 ve x: -100'ün doğru çalışması için sabit genişlik gerekli */}
         <div className="w-[320px] h-[160px] relative mb-8">
            {/* Kırmızı Div - Başlangıçta solda (left: 0) */}
            <motion.div
               className="size-40 bg-red-500 rounded shadow-lg absolute left-0 top-0 origin-center"
               animate={controlsRed}
               initial={{ x: 0, scale: 1 }} // Başlangıç state'i
            >
               <LoginComponent />
            </motion.div>
            {/* Yeşil Div - Başlangıçta sağda (left: 100px) */}
            <motion.div
               className="size-40 bg-lime-500 rounded shadow-lg absolute left-[160px] top-0 origin-center"
               animate={controlsGreen}
               initial={{ x: 0, scale: 1 }} // Başlangıç state'i (x, kendi başlangıç pozisyonuna göre)
            />
         </div>

         {/* Yardımcı Bilgi (İsteğe bağlı) */}
         {/*
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Current View: {activeView}</p>
        <p>Previous View: {previousView ?? 'None'}</p>
      </div>
      */}
      </div>
   );
}
