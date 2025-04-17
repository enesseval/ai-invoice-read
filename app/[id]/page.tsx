import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation"; // notFound import edildi
import React from "react";

// Sayfanın dinamik parametreleri alabilmesi için props tanımı
interface DashboardProps {
   params: {
      id: string; // Next.js klasör adını [id] olarak bıraktığımız için parametre adı 'id'
   };
}

// Sunucu bileşeni olarak async yapıyoruz
async function Dashboard({ params }: DashboardProps) {
   const supabase = await createClient(); // createClient'ı await ile bekle
   const username = decodeURIComponent(params.id); // URL'den gelen username'i decode et

   // Profiles tablosundan username'e göre kullanıcıyı bul
   const { data: profile, error } = await supabase
      .from("profiles")
      .select("name, surname") // İhtiyacımız olan alanları seçelim (örn: name, surname)
      .eq("username", username) // username ile eşleşen kaydı bul
      .single(); // Tek bir kayıt bekliyoruz

   // Profil bulunamazsa veya hata olursa 404 sayfası göster
   if (error || !profile) {
      console.error(`Profile not found for username: ${username}`, error);
      notFound(); // Next.js'in 404 sayfasını tetikler
   }

   // Profil bulunduysa bilgileri göster
   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">Kullanıcı Profili</h1>
         <p>
            <strong>Kullanıcı Adı:</strong> {username}
         </p>
         <p>
            <strong>Adı:</strong> {profile.name}
         </p>
         <p>
            <strong>Soyadı:</strong> {profile.surname}
         </p>
         {/* Buraya daha fazla profil bilgisi eklenebilir */}
      </div>
   );
}

export default Dashboard;
