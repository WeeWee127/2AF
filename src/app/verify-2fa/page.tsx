import type { Metadata } from 'next';
import { TwoFactorForm } from '@/components/auth/two-factor-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Підтвердження 2FA | AuthGuard',
  description: 'Сторінка підтвердження двофакторної автентифікації для AuthGuard',
};

export default function Verify2FAPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card><CardHeader><CardTitle>2FA Verification</CardTitle></CardHeader><CardContent><TwoFactorForm /></CardContent></Card>
    </div>
  );
}
