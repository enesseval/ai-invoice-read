"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Locale, locales } from "@/i18n/config";
import { getUserLocale, setUserLocale } from "@/services/locale";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LocaleSwitcher() {
   const locale = useLocale();
   const [isPending, startTransition] = useTransition();

   const onSelectLocale = (nextLocale: string) => {
      const typedLocale = nextLocale as Locale; // Cast to Locale type
      startTransition(() => {
         setUserLocale(typedLocale);
      });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="cursor-pointer">
               <Languages className="h-5 w-5" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="bg-background">
            {locales.map((loc) => (
               <DropdownMenuItem
                  className={cn("cursor-pointer hover:bg-foreground hover:text-background transition-all duration-300")}
                  key={loc}
                  onSelect={() => onSelectLocale(loc)}
                  disabled={locale === loc || isPending}
               >
                  {loc.toUpperCase()}
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
