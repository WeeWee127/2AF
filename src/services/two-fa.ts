import { db } from '@/lib/db';

/**
 * Generates a 2FA code.
 *
 * @returns A 2FA code.
 */
export async function generate2FACode(userId: string): Promise<string> {
  // TODO: Implement this by calling an API.
  const code = '123456';
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorToken: code,
    },
  });
  return code;
}

/**
 * Verifies a 2FA code and updates user's twoFactorEnabled status.
 * @param userId - The ID of the user.
 * @param token - The 2FA token entered by the user.
 * @returns A promise that resolves to true if the token is valid, false otherwise.
 */
export async function verifyTwoFactorToken(
  userId: string,
  token: string,
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || user.twoFactorToken !== token) {
    return false;
  }
  await db.user.update({
    where: { id: userId },
    data: { isTwoFactorEnabled: true },
  });

  return true;
}
