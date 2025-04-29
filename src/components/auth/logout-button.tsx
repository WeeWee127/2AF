'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();


  const handleLogout = () => {
    startTransition(async () => {
      await logout();
       toast({
            title: "Вихід",
            description: "Ви успішно вийшли з системи.",
       });
      router.push('/login');
      router.refresh(); // Ensure fresh state after logout
    });
  };

  return (
    <Button onClick={handleLogout} variant="destructive" disabled={isPending} className="mt-4">
       {isPending ? (
         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
       ) : (
         <LogOut className="mr-2 h-4 w-4" />
       )}
      Вийти
    </Button>
  );
}
