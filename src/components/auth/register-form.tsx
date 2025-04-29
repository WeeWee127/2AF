"use client";

import type { FC } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RegistrationSchema, type RegistrationFormData } from "@/lib/schemas";
import { AuthCard } from "./auth-card";
import Link from 'next/link';
import { register } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';


export const RegisterForm: FC = () => {
 const { toast } = useToast();
 const router = useRouter();
 const [isPending, startTransition] = useTransition();


  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    startTransition(async () => {
        const result = await register(data);
         if (result.success) {
           toast({
            title: "Реєстрація успішна",
            description: "Ваш акаунт створено. Будь ласка, увійдіть.",
            variant: "default", // Use default theme color for success
           });
           router.push('/login');
         } else {
           toast({
             title: "Помилка реєстрації",
             description: result.error || "Не вдалося зареєструватися. Спробуйте ще раз.",
             variant: "destructive",
           });
         }
    });
  };

  return (
    <AuthCard
      title="Реєстрація"
      description="Створіть новий обліковий запис"
       footerContent={
        <p>
          Вже маєте обліковий запис?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Увійти
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Електронна пошта</FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.com" {...field} disabled={isPending} />
                </FormControl>
                 <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Підтвердіть пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Зареєструватися
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
