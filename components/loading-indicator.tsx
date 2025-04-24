import React from "react";
import Image from "next/image";

interface LoadingIndicatorProps {
   message?: string; // Opsiyonel yükleme mesajı
   size?: "small" | "medium" | "large"; // Boyut seçeneği
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
   message = "Yükleniyor...", // Varsayılan mesaj
   size = "medium", // Varsayılan boyut
}) => {
   const getSizeStyles = () => {
      // Boyutlara göre logo boyutu ve animasyon ölçeğini ayarlayalım
      switch (size) {
         case "small":
            return {
               logoSize: 60, // Daha büyük logo
               loaderScale: 0.6,
               // textSize kaldırıldı
               logoMarginBottom: "mb-1",
            };
         case "large":
            return {
               logoSize: 150, // Daha büyük logo
               loaderScale: 1.2,
               // textSize kaldırıldı
               logoMarginBottom: "mb-3",
            };
         case "medium":
         default:
            return {
               logoSize: 90, // Daha büyük logo
               loaderScale: 0.9,
               // textSize kaldırıldı
               logoMarginBottom: "mb-2",
            };
      }
   };

   // textSize artık kullanılmıyor
   const { logoSize, loaderScale, logoMarginBottom } = getSizeStyles();

   return (
      // space-y-4 kaldırıldı, mesaj yok
      <div className="flex flex-col justify-center items-center">
         {/* Logo ve Animasyon Konteyneri */}
         <div className="flex flex-col items-center">
            {/* CSS Loader Animasyonu */}
            <div
               className="loader"
               style={{ transform: `scale(${loaderScale})` }}
               role="status"
               aria-live="polite"
               aria-label="Yükleniyor..." // Sabit ARIA etiketi
            >
               {/* ::before pseudo-elementi animasyonu oluşturacak */}
            </div>
            {/* Logo */}
            <Image
               src="/chorifyx-logo.png"
               alt="" // Alt text'i boş bırakabiliriz, animasyonun kendisi durumu belirtir
               width={logoSize}
               height={logoSize}
               className={`${logoMarginBottom} opacity-90 mt-10`} // Logoyu biraz daha belirgin yapalım
               priority // Yükleme göstergesi önemliyse logoyu öncelikli yükle
            />
            {/* CSS Loader Animasyonu */}
         </div>
         {/* Yükleme mesajı kaldırıldı */}
      </div>
   );
};

export default LoadingIndicator;

// Gerekli Tailwind animasyonları (tailwind.config.js'de yoksa):
/*
tailwind.config.js -> theme.extend.keyframes:
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },

tailwind.config.js -> theme.extend.animation:
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Mevcut pulse'ı özelleştirebilirsiniz
*/

// Not: 'bg-primary' ve 'text-muted-foreground' sınıfları projenizdeki shadcn/ui veya Tailwind tema yapılandırmasına bağlıdır.
// Eğer bu sınıflar yoksa, uygun renk sınıflarıyla değiştirin (örn: bg-blue-500, text-gray-500).
