"use client";

import type { FC } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TwoFactorSchema, type TwoFactorFormData } from "@/lib/schemas";
import { AuthCard } from "./auth-card";
import { verify2FA } from "@/app/actions/auth"; // Assuming verify2FA exists
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';

export const TwoFactorForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();


  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(TwoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

 const onSubmit = (data: TwoFactorFormData) => {
    startTransition(async () => {
      const result = await verify2FA(data); // Call the server action
      if (result.success) {
        toast({
            title: "Підтвердження успішне",
            description: "Двофакторну автентифікацію пройдено.",
            variant: "default", // Use default theme color for success
           });
        router.push('/dashboard'); // Redirect to dashboard on successful verification
      } else {
        // Check if the server action indicated a redirect is needed (e.g., invalid session)
        if (result.redirect) {
             toast({
                title: "Помилка сесії",
                description: result.error || "Будь ласка, увійдіть знову.",
                variant: "destructive",
            });
            router.push(result.redirect); // Perform client-side redirect
        } else {
             toast({
                title: "Помилка підтвердження",
                description: result.error || "Невірний код. Спробуйте ще раз.",
                variant: "destructive",
             });
             form.resetField("code"); // Clear the code field on error
        }
      }
    });
  };


  return (
    <AuthCard
      title="Двофакторна автентифікація"
      description="Введіть код з вашого автентифікатора"
      footerContent={<></>} // No footer needed here for now
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код підтвердження (6 цифр)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    {...field}
                    maxLength={6}
                    pattern="\d{6}"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Підтвердити
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
