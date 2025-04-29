import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footerContent: ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, footerContent, className }: AuthCardProps) {
  return (
    <Card className={cn("w-full max-w-md mx-auto shadow-lg", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="justify-center text-sm">
        {footerContent}
      </CardFooter>
    </Card>
  );
}
