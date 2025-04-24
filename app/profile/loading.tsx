import React from "react";
import LoadingIndicator from "@/components/loading-indicator"; // Yeni bileşeni import et

// Bu bileşen, app/profile/page.tsx yüklenirken gösterilecek
export default function Loading() {
   // Yeni, gösterişli yükleme bileşenini kullan
   return (
      <div className="flex justify-center items-center min-h-screen">
         <LoadingIndicator message="Profil yükleniyor..." size="large" />
      </div>
   );
}
