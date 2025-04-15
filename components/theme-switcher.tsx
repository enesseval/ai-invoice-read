"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
   const [mounted, setMounted] = React.useState(false);
   const { theme, setTheme } = useTheme();

   // useEffect only runs on the client, so now we can safely show the UI
   React.useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      // Render a placeholder or null on the server and initial client render
      // to avoid hydration mismatch. Match the size of the button.
      return <Button size="icon" variant="outline" className="cursor-pointer" disabled />;
   }

   return (
      <Button size="icon" variant="outline" className="cursor-pointer" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
         {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
   );
}
