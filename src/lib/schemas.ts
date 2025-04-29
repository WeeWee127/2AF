import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Невірна адреса електронної пошти." }),
  password: z.string().min(1, { message: "Пароль не може бути порожнім." }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegistrationSchema = z.object({
  email: z.string().email({ message: "Невірна адреса електронної пошти." }),
  password: z.string().min(6, { message: "Пароль має містити щонайменше 6 символів." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають.",
  path: ["confirmPassword"], // path of error
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;


export const TwoFactorSchema = z.object({
  code: z.string().length(6, { message: "Код повинен містити 6 цифр." }).regex(/^\d{6}$/, { message: "Код повинен містити лише цифри." }),
});

export type TwoFactorFormData = z.infer<typeof TwoFactorSchema>;
