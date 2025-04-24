"use client"; // Kenar çubuğu etkileşimli olabileceğinden (örn. aktif link vurgulama)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn/ui ile gelen yardımcı fonksiyon
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Receipt, UserCircle, LogOut, FileUp } from "lucide-react";
import Image from "next/image"; // Logo için
import { InvoiceUploadModal } from "./invoice-upload-modal"; // Modal'ı import et

// Gelecekte logout işlemi için
// import { logout } from "@/utils/supabase/actions";

const navItems = [
   { href: "/dashboard", label: "Gösterge Paneli", icon: LayoutDashboard },
   { href: "/invoices", label: "Faturalar", icon: Receipt },
   { href: "/profile", label: "Profil", icon: UserCircle },
];

export function Sidebar() {
   const pathname = usePathname();

   return (
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-background p-4 space-y-6">
         <div className="flex items-center gap-2 px-2">
            {/* Logo veya Uygulama Adı */}
            <Image src="/chorifyx-logo.png" alt="FinTrack Logo" width={32} height={32} />
            <span className="text-lg font-semibold">FinTrack</span>
         </div>

         <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => (
               <Link href={item.href} key={item.href}>
                  <Button variant={pathname === item.href ? "secondary" : "ghost"} className={cn("w-full justify-start", pathname === item.href && "font-semibold")}>
                     <item.icon className="mr-2 h-4 w-4" />
                     {item.label}
                  </Button>
               </Link>
            ))}
            {/* Fatura Yükleme Butonu (Modal Trigger) */}
            <InvoiceUploadModal>
               <Button variant="default" className="mt-4 w-full">
                  <FileUp className="mr-2 h-4 w-4" />
                  Fatura Yükle
               </Button>
            </InvoiceUploadModal>
         </nav>

         {/* Alt Kısım (Örn: Çıkış Yap) */}
         <div className="mt-auto">
            {/* Çıkış Yap Formu veya Butonu */}
            {/*
         <form action={logout}>
            <Button variant="ghost" className="w-full justify-start">
               <LogOut className="mr-2 h-4 w-4" />
               Çıkış Yap
            </Button>
         </form>
         */}
            <Button variant="ghost" className="w-full justify-start" disabled>
               <LogOut className="mr-2 h-4 w-4" />
               Çıkış Yap (Devre Dışı)
            </Button>
         </div>
      </aside>
   );
}
