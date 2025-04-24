import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Wallet, FileText } from "lucide-react";

// Dummy Data
const summaryData = {
   totalMonthlySpending: 1248.42,
   lastMonthComparison: 20.1,
   topSpendingCategory: "Market",
   topCategoryAmount: 420.69,
   remainingBudget: 1751.58,
   budgetPercentageLeft: 58.4,
   upcomingBills: 345.0,
};

const spendingOverTimeData = [
   // Zaman içindeki harcama verileri buraya gelecek (örnek)
   { date: "Mar 27", amount: 30 },
   { date: "Mar 31", amount: 90 },
   { date: "Apr 04", amount: 60 },
   { date: "Apr 08", amount: 110 },
   { date: "Apr 12", amount: 50 },
   { date: "Apr 16", amount: 95 },
   { date: "Apr 20", amount: 70 },
   { date: "Apr 24", amount: 100 },
];

const spendingByCategoryData = [
   // Kategoriye göre harcama verileri buraya gelecek (örnek)
   { category: "Market", percentage: 34, color: "bg-green-500" },
   { category: "Yeme-İçme", percentage: 19, color: "bg-orange-500" },
   { category: "Ulaşım", percentage: 14, color: "bg-blue-500" },
   { category: "Faturalar", percentage: 12, color: "bg-purple-500" },
   { category: "Eğlence", percentage: 11, color: "bg-pink-500" },
   { category: "Alışveriş", percentage: 7, color: "bg-yellow-500" },
   { category: "Sağlık", percentage: 3, color: "bg-red-500" },
];

// Placeholder Components (Bunları daha sonra gerçek grafiklerle değiştireceğiz)
const SpendingOverTimeChart = ({ data }: { data: any[] }) => (
   <Card>
      <CardHeader>
         <CardTitle>Zaman İçindeki Harcamalar</CardTitle>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
         {/* Gerçek grafik buraya gelecek */}
         Zaman İçindeki Harcama Grafiği Alanı
      </CardContent>
   </Card>
);

const SpendingByCategoryChart = ({ data }: { data: any[] }) => (
   <Card>
      <CardHeader>
         <CardTitle>Kategoriye Göre Harcamalar</CardTitle>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
         {/* Gerçek grafik buraya gelecek */}
         Kategoriye Göre Harcama Grafiği Alanı
      </CardContent>
   </Card>
);

const RecentTransactionsTable = () => (
   <Card>
      <CardHeader>
         <CardTitle>Son İşlemler</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
         {/* Gerçek tablo buraya gelecek */}
         Son İşlemler Tablosu Alanı
      </CardContent>
   </Card>
);

const CategoriesTable = () => (
   <Card>
      <CardHeader>
         <CardTitle>Kategoriler</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
         {/* Gerçek tablo buraya gelecek */}
         Kategoriler Tablosu Alanı
      </CardContent>
   </Card>
);

export default function DashboardPage() {
   return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Merhaba, Kullanıcı!</h2>
            {/* İleride buraya fatura yükleme butonu eklenebilir */}
         </div>

         {/* Özet Kartları */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Aylık Harcama</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">₺{summaryData.totalMonthlySpending.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Geçen aya göre +%{summaryData.lastMonthComparison}</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Çok Harcanan Kategori</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{summaryData.topSpendingCategory}</div>
                  <p className="text-xs text-muted-foreground">Bu ay ₺{summaryData.topCategoryAmount.toFixed(2)}</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kalan Bütçe</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">₺{summaryData.remainingBudget.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Aylık bütçenin %{summaryData.budgetPercentageLeft}'i kaldı</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yaklaşan Faturalar</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">₺{summaryData.upcomingBills.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Sonraki 7 gün içinde ödenecek</p>
               </CardContent>
            </Card>
         </div>

         {/* Sekmeler ve İçerikleri */}
         <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
               <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
               <TabsTrigger value="transactions">Son İşlemler</TabsTrigger>
               <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <div className="col-span-4">
                     <SpendingOverTimeChart data={spendingOverTimeData} />
                  </div>
                  <div className="col-span-4 md:col-span-3">
                     <SpendingByCategoryChart data={spendingByCategoryData} />
                  </div>
               </div>
            </TabsContent>
            <TabsContent value="transactions" className="space-y-4">
               <RecentTransactionsTable />
            </TabsContent>
            <TabsContent value="categories" className="space-y-4">
               <CategoriesTable />
            </TabsContent>
         </Tabs>
      </div>
   );
}
