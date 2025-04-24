import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation"; // notFound import edildi
import React from "react";
import { redirect } from "next/navigation"; // redirect import edildi
import LoadingIndicator from "@/components/loading-indicator";

async function Dashboard() {
   const supabase = await createClient(); // createClient'ı await ile bekle

   // Giriş yapmış kullanıcıyı al
   const {
      data: { user },
      error: authError,
   } = await supabase.auth.getUser();

   // Kullanıcı yoksa veya auth hatası varsa giriş sayfasına yönlendir (veya notFound)
   if (authError || !user) {
      console.error("User not authenticated:", authError);
      // notFound(); // Veya giriş sayfasına yönlendir
      redirect("/sign-in"); // Giriş sayfasına yönlendirme örneği
   }

   const userId = user.id; // Giriş yapmış kullanıcının ID'si

   // Profiles tablosundan id'ye göre kullanıcıyı bul
   const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, surname, username") // İhtiyacımız olan alanları seçelim (username dahil)
      .eq("id", userId) // Giriş yapmış kullanıcının id'si ile eşleşen kaydı bul
      .single(); // Tek bir kayıt bekliyoruz

   // Profil bulunamazsa veya hata olursa 404 sayfası göster
   // Profil tablosunda ilgili ID ile kayıt olmama durumu normal olabilir (henüz profil oluşturulmamışsa)
   // Bu yüzden sadece profileError'u kontrol etmek daha doğru olabilir.
   if (profileError && profileError.code !== "PGRST116") {
      // PGRST116: single() no rows found hatası
      console.error(`Error fetching profile for ID: ${userId}`, profileError);
      notFound(); // Beklenmedik bir hata varsa 404 göster
   }

   // Profil bulunamazsa (henüz oluşturulmamışsa) veya hata varsa (beklenmedik)
   if (!profile) {
      // Kullanıcı var ama profili yoksa farklı bir mesaj gösterebilir veya profil oluşturma sayfasına yönlendirebiliriz.
      // Şimdilik basit bir mesaj gösterelim veya notFound() kullanalım.
      console.warn(`Profile data not found for user ID: ${userId}. User might need to create a profile.`);
      // Alternatif: return <div>Profil bilgisi bulunamadı. Lütfen profilinizi oluşturun.</div>;
      notFound(); // Şimdilik 404 gösterelim
   }

   // Profil bulunduysa bilgileri göster
   return (
      <div className="p-4">
         <h1 className="text-2xl font-bold mb-4">Kullanıcı Profili</h1>
         <p>
            <strong>Kullanıcı Adı:</strong> {profile.username} {/* Veritabanından gelen username'i göster */}
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
