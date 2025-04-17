"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button"; // Corrected import path
import Link from "next/link";
import { useTranslations } from "next-intl";

function Unauthorized() {
   const t = useTranslations("Unauthorized"); // Assuming you have translations set up
   return (
      // Use theme background
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-background text-foreground">
         {/* Removed gradient and grid background */}
         <div className="relative flex flex-col items-center justify-center">
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-12 flex items-center gap-3">
               <div className="relative">
                  {/* Assuming logonotext.png is in the public folder */}
                  {/* Ensure image path is correct */}
                  <Image src="/chorifyx-logo.png" alt="Logo" width={200} height={100} className="relative h-12 w-auto" />
               </div>
               {/* Removed CHORIFYX text as it's part of the logo image */}
            </motion.div>

            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative">
               {/* Use destructive color with low opacity */}
               <div className="text-[150px] font-bold text-destructive/10 select-none absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">401</div>
               <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                     {/* Use destructive color for icon background and icon */}
                     <div className="p-4 bg-destructive/10 rounded-full">
                        <ShieldAlert className="h-12 w-12 text-destructive" />
                     </div>
                  </div>
                  {/* Use foreground color for headings */}
                  <h1 className="text-6xl font-bold text-foreground mb-4">{t("title")}</h1>
                  <h2 className="text-xl font-medium text-foreground mb-6">{t("subtitle")}</h2>
                  {/* Use muted foreground color for description */}
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">{t("description")}</p>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex gap-4 justify-center">
                     {/* Use destructive variant for the primary action button */}
                     <Button asChild variant="destructive" className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:shadow-lg">
                        <Link href="/sign-in">{t("loginButton")}</Link>
                     </Button>
                     {/* Use default outline variant for the secondary action button */}
                     <Button asChild variant="outline" className="px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 hover:shadow-lg">
                        <Link href="/">{t("homeButton")}</Link>
                     </Button>
                  </motion.div>
               </div>
            </motion.div>
            {/* Removed gradient overlay */}
         </div>
      </div>
   );
}

export default Unauthorized;
