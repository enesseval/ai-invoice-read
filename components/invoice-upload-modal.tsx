"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogClose, // Kapatma butonu için
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileCheck2, Loader2 } from "lucide-react"; // İkonlar

interface InvoiceUploadModalProps {
   children: React.ReactNode; // Trigger butonu bu prop ile gelecek
}

export function InvoiceUploadModal({ children }: InvoiceUploadModalProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [isUploading, setIsUploading] = useState(false);
   const [uploadSuccess, setUploadSuccess] = useState(false);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
         setSelectedFile(event.target.files[0]);
         setUploadSuccess(false); // Yeni dosya seçildiğinde başarı durumunu sıfırla
         setErrorMessage(null); // Hata mesajını sıfırla
      }
   };

   const handleUpload = async () => {
      if (!selectedFile) {
         setErrorMessage("Lütfen bir dosya seçin.");
         return;
      }

      setIsUploading(true);
      setErrorMessage(null);
      setUploadSuccess(false);

      // --- Dummy Yükleme Simülasyonu ---
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 saniye bekle
      // Simülasyon: Rastgele başarı veya hata durumu
      const success = Math.random() > 0.3; // %70 başarı ihtimali
      setIsUploading(false);
      if (success) {
         setUploadSuccess(true);
         setSelectedFile(null); // Başarılı yüklemeden sonra seçimi temizle
         // Burada modal'ı otomatik kapatabilir veya kullanıcıya mesaj gösterebiliriz.
      } else {
         setErrorMessage("Fatura yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
      // --- Simülasyon Sonu ---

      // Gerçek uygulamada burada API çağrısı yapılacak
      /*
    const formData = new FormData();
    formData.append("invoice", selectedFile);

    try {
      const response = await fetch("/api/upload-invoice", { // Örnek API endpoint'i
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Yükleme başarısız.");
      }

      const result = await response.json();
      console.log("Yükleme başarılı:", result);
      setUploadSuccess(true);
      setSelectedFile(null); // Başarılı yüklemeden sonra seçimi temizle

    } catch (error) {
      console.error("Yükleme hatası:", error);
      setErrorMessage("Fatura yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsUploading(false);
    }
    */
   };

   // Modal kapatıldığında state'leri sıfırla
   const handleOpenChange = (open: boolean) => {
      if (!open) {
         setSelectedFile(null);
         setIsUploading(false);
         setUploadSuccess(false);
         setErrorMessage(null);
      }
   };

   return (
      <Dialog onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Fatura Yükle</DialogTitle>
               <DialogDescription>İşlem görmek üzere faturanızı (PDF, JPG, PNG) buraya yükleyin.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="invoice-file">Fatura Dosyası</Label>
                  <Input id="invoice-file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} disabled={isUploading} />
                  {selectedFile && !isUploading && !uploadSuccess && <p className="text-sm text-muted-foreground mt-1">Seçilen dosya: {selectedFile.name}</p>}
               </div>
               {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
               {uploadSuccess && (
                  <div className="flex items-center text-sm text-green-600">
                     <FileCheck2 className="mr-2 h-4 w-4" />
                     Fatura başarıyla yüklendi! İşleniyor...
                  </div>
               )}
            </div>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline" disabled={isUploading}>
                     İptal
                  </Button>
               </DialogClose>
               <Button type="button" onClick={handleUpload} disabled={!selectedFile || isUploading || uploadSuccess}>
                  {isUploading ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yükleniyor...
                     </>
                  ) : (
                     <>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Yükle
                     </>
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
