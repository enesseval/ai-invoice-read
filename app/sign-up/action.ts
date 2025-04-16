"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(values: any) {
   const supabase = await createClient();

   const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
   });

   if (error) redirect("/sign-up");

   console.log(data);
   redirect("/dashboard");
}
