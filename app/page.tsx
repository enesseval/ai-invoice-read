import LocaleSwitcher from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTranslations } from "next-intl";

export default function Home() {
   const t = useTranslations();
   return (
      <div className="flex flex-col items-center justify-center h-screen">
         <LocaleSwitcher />
         <ThemeSwitcher />
         <div className="h-20 mt-20">
            <h1 className="">{t("HomePage.title")}</h1>
         </div>
      </div>
   );
}
