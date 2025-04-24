import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Badge bileşenini de ekleyeceğiz
import { FileText, Calendar, Tag, CheckCircle, AlertCircle, Clock } from "lucide-react";

// Dummy Data
const invoices = [
   {
      id: "INV001",
      fileName: "market-faturasi-nisan.pdf",
      uploadDate: "2025-04-20",
      category: "Market",
      amount: 150.75,
      status: "processed", // processed, pending, error
   },
   {
      id: "INV002",
      fileName: "restoran-hesabi.jpg",
      uploadDate: "2025-04-18",
      category: "Yeme-İçme",
      amount: 85.5,
      status: "processed",
   },
   {
      id: "INV003",
      fileName: "elektrik-faturasi-mart.pdf",
      uploadDate: "2025-04-15",
      category: "Faturalar",
      amount: 210.0,
      status: "pending",
   },
   {
      id: "INV004",
      fileName: "benzin-fisi.png",
      uploadDate: "2025-04-12",
      category: "Ulaşım",
      amount: 320.0,
      status: "processed",
   },
   {
      id: "INV005",
      fileName: "sinema-biletleri.pdf",
      uploadDate: "2025-04-10",
      category: "Eğlence",
      amount: 90.0,
      status: "error",
   },
];

// Duruma göre ikon ve renk döndüren yardımcı fonksiyon
const getStatusBadge = (status: string) => {
   switch (status) {
      case "processed":
         return (
            <Badge variant="outline" className="text-green-600 border-green-600">
               <CheckCircle className="mr-1 h-3 w-3" /> İşlendi
            </Badge>
         );
      case "pending":
         return (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
               <Clock className="mr-1 h-3 w-3" /> Bekliyor
            </Badge>
         );
      case "error":
         return (
            <Badge variant="destructive">
               <AlertCircle className="mr-1 h-3 w-3" /> Hata
            </Badge>
         );
      default:
         return <Badge variant="secondary">Bilinmiyor</Badge>;
   }
};

export default function InvoicesPage() {
   return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Fatura Geçmişi</h2>
            {/* İleride buraya filtreleme/arama eklenebilir */}
         </div>
         <Table>
            <TableCaption>Yüklenen faturalarınızın listesi.</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>
                     <FileText className="inline-block mr-1 h-4 w-4" />
                     Dosya Adı
                  </TableHead>
                  <TableHead>
                     <Calendar className="inline-block mr-1 h-4 w-4" />
                     Yükleme Tarihi
                  </TableHead>
                  <TableHead>
                     <Tag className="inline-block mr-1 h-4 w-4" />
                     Kategori
                  </TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                  <TableHead>Durum</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                     <TableCell className="font-medium">{invoice.id}</TableCell>
                     <TableCell>{invoice.fileName}</TableCell>
                     <TableCell>{invoice.uploadDate}</TableCell>
                     <TableCell>{invoice.category}</TableCell>
                     <TableCell className="text-right">₺{invoice.amount.toFixed(2)}</TableCell>
                     <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
