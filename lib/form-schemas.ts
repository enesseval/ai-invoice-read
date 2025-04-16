import z from "zod";

export const signUpFormSchema = (t: (arg: string) => string) =>
   z.object({
      name: z.string().min(1, { message: t("name-is-required") }),
      surname: z.string().min(1, { message: t("surname-is-required") }),
      email: z.string().email({ message: t("email-is-invalid") }),
      password: z
         .string()
         .min(8, t("password-min-8"))
         .max(32, t("password-max-32"))
         .regex(/^(?=.*[A-Z]).{8,}$/, t("password-regex")),
   });
