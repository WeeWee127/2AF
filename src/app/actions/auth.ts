'use server';

import { z } from 'zod';
import { LoginSchema, RegistrationSchema, TwoFactorSchema, type LoginFormData, type RegistrationFormData, type TwoFactorFormData } from '@/lib/schemas';
import { createUser, findUserByEmail, updateUser, MOCK_USERS } from '@/lib/db'; // Mock DB functions
import { createSession, destroySession, generate2FASecret, getSession, hashPassword, updateSession, verifyPassword, verify2FAToken } from '@/lib/auth'; // Use updated mock Auth functions
import { redirect } from 'next/navigation';

// --- Registration Action ---
export async function register(values: RegistrationFormData) {
  const validatedFields = RegistrationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Невірні дані.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  // Check if user already exists (using mock DB function)
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return { success: false, error: 'Користувач з такою поштою вже існує.' };
  }

  // Hash password (using updated mock Auth function)
  const hashedPassword = await hashPassword(password);

  // Create user (using mock DB function)
  try {
    await createUser({ email, password: hashedPassword });
    console.log("Mock User created:", email);
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: 'Помилка сервера під час реєстрації.' };
  }
}

// --- Login Action ---
export async function login(values: LoginFormData) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Невірні дані.', details: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  // Find user (using mock DB function)
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Невірний email або пароль.' };
  }

  // Verify password (using updated mock Auth function)
  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    return { success: false, error: 'Невірний email або пароль.' };
  }

  // --- Handle 2FA ---
  const twoFactorEnabled = !!user.twoFactorEnabled; // Check if 2FA is set up

  // If user exists but 2FA setup seems incomplete (no secret), generate one now.
  // In a real app, this setup would likely be a separate step.
  let needs2FASetup = false;
  if (twoFactorEnabled && !user.twoFactorSecret) {
      const secret = generate2FASecret();
      await updateUser(user.id, { twoFactorSecret: secret });
      user.twoFactorSecret = secret; // Update local user object
      console.log(`Mock 2FA secret generated for user ${user.email} during login.`);
      needs2FASetup = true; // Indicate that setup just happened
  }


  // Create session (using mock Auth function)
  // Mark session as needing 2FA if enabled
  await createSession(user.id, twoFactorEnabled);


  console.log(`Login attempt for ${email}, password valid: ${isPasswordValid}, 2FA enabled: ${twoFactorEnabled}`);

  if (twoFactorEnabled) {
       // If 2FA was just set up, might still redirect to 2FA page for immediate verification
       // or potentially skip if design allows direct dashboard access after setup.
       // For now, always require verification if enabled.
       return { success: true, needs2FA: true };
   } else {
       // If 2FA is not enabled, login is complete
       return { success: true, needs2FA: false };
   }
}

// --- 2FA Verification Action ---
export async function verify2FA(values: TwoFactorFormData) {
    const validatedFields = TwoFactorSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: 'Невірний формат коду.', details: validatedFields.error.flatten().fieldErrors };
    }

    const { code } = validatedFields.data;

    // Get current session (which should exist and require 2FA)
    const session = await getSession();
    if (!session || !session.needs2FA) {
        // If session lost or doesn't need 2FA, redirect to login
        // This prevents accessing verify-2fa directly without a preceding login attempt
        console.warn("verify2FA called without valid session needing 2FA. Redirecting to login.");
        // Server actions cannot directly redirect, return error to client
         return { success: false, error: 'Сесія недійсна або не потребує 2FA.', redirect: '/login' };

    }

    // Find user associated with session
     const user = MOCK_USERS.find(u => u.id === session.userId); // Directly use mock array
    if (!user || !user.twoFactorSecret) {
        return { success: false, error: 'Користувача не знайдено або 2FA не налаштовано.' };
    }

    // Verify the token (using mock Auth function)
    const isTokenValid = verify2FAToken(user.twoFactorSecret, code);

    if (!isTokenValid) {
        return { success: false, error: 'Невірний код 2FA.' };
    }

    // Token is valid, update session to mark 2FA as complete
    await updateSession({ needs2FA: false });
    console.log(`2FA verified for user ${user.email}`);

    return { success: true };
}


// --- Logout Action ---
export async function logout() {
  // Destroy session (using mock Auth function)
  await destroySession();
  console.log("User logged out");
  // No redirect needed here, client-side router handles it
   return { success: true };
}
