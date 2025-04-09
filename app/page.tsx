import LocaleSwitcher from "@/components/locale-switcher";
import { useTranslations } from "next-intl";

export default function Home() {
   const t = useTranslations();
   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <LocaleSwitcher />
         <div className="h-20 mt-20">
            <h1 className="text-white">{t("HomePage.title")}</h1>
         </div>
      </div>
   );
}
