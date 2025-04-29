"use client";

import type { FC } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoginSchema, type LoginFormData } from "@/lib/schemas";
import { AuthCard } from "./auth-card";
import Link from 'next/link';
import { login } from "@/app/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';


export const LoginForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();


  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const result = await login(data);
      if (result.success) {
        // Redirect based on 2FA status
        if (result.needs2FA) {
          router.push('/verify-2fa');
        } else {
           toast({
            title: "Успішний вхід",
            description: "Вітаємо!",
            variant: "default", // Use default for success with the primary color
           });
           router.push('/dashboard'); // Redirect to dashboard if 2FA is not needed or already verified implicitly
        }
      } else {
        toast({
          title: "Помилка входу",
          description: result.error || "Не вдалося увійти. Будь ласка, перевірте свої дані.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <AuthCard
      title="Вхід"
      description="Увійдіть до свого облікового запису"
      footerContent={
        <p>
          Немає облікового запису?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Зареєструватися
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
                  <Input placeholder="example@mail.com" {...field} disabled={isPending}/>
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
                  <Input type="password" placeholder="••••••••" {...field} disabled={isPending}/>
                </FormControl>
                 <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Увійти
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
