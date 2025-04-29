import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { logout } from '@/app/actions/auth'; // Assuming logout exists
import { LogoutButton } from '@/components/auth/logout-button';

export const metadata: Metadata = {
  title: 'Панель керування | AuthGuard',
  description: 'Ваша панель керування AuthGuard',
};

// Mock user data - replace with actual data fetching later
const user = {
  email: 'user@example.com', // This should come from the session/server
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Вітаємо!</CardTitle>
          <CardDescription>Ви успішно увійшли в систему.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>Ваша електронна пошта: <span className="font-medium">{user.email}</span></p>
          <p className="text-muted-foreground">Це ваша захищена панель керування.</p>
           <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
