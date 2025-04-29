import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Реєстрація | AuthGuard',
  description: 'Сторінка реєстрації для AuthGuard',
};


export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
       <RegisterForm />
    </div>
  );
}
