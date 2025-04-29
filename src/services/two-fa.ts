/**
 * Generates a 2FA code.
 *
 * @returns A 2FA code.
 */
export async function generate2FACode(): Promise<string> {
  // TODO: Implement this by calling an API.

  return '123456';
}

/**
 * Verifies a 2FA code.
 *
 * @param code The 2FA code to verify.
 * @returns A promise that resolves to true if the code is valid, false otherwise.
 */
export async function verify2FACode(code: string): Promise<boolean> {
  // TODO: Implement this by calling an API.

  return code === '123456';
}
