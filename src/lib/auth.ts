// Placeholder for authentication helper functions
import { MOCK_SESSIONS, MOCK_USERS } from './db'; // Import mock data/functions
import { cookies } from 'next/headers';
// import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'; // Use Node.js crypto - Commented out for Edge compatibility

const SESSION_COOKIE_NAME = 'authguard_session';
const MOCK_PASSWORD_SALT = 'mock-salt-for-demo'; // Fixed salt for demo hashing

// --- Password Hashing ---
export const hashPassword = async (password: string): Promise<string> => {
  // In a real app, use a strong hashing library like bcrypt
  // This is a placeholder mock hash function NOT using crypto
  console.warn("Using MOCK hashPassword (DEMO ONLY - NOT SECURE)");
  // Simple "hash" for demo purposes: salt + password
  return `${MOCK_PASSWORD_SALT}:${password}`;
};

export const verifyPassword = async (storedHash: string, providedPass: string): Promise<boolean> => {
 // In a real app, use the corresponding bcrypt compare function
 // This is a placeholder mock verification NOT using crypto
 console.warn("Using MOCK verifyPassword (DEMO ONLY - NOT SECURE)");
 try {
    const [salt, storedPasswordPart] = storedHash.split(':');
    if (salt !== MOCK_PASSWORD_SALT) {
        console.error("Password verification error: Invalid mock salt");
        return false;
    }
    // Simple comparison for demo purposes
    return storedPasswordPart === providedPass;
 } catch (error) {
    console.error("Password verification error:", error);
    return false;
 }
};


// --- Session Management (Mocked with Cookies) ---

export const createSession = async (userId: number, needs2FA: boolean = false): Promise<string> => {
  // Use a secure random generator in production
  const sessionId = `mockSession_${Date.now()}_${Math.random()}`; // Simple mock session ID
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Store session data (in memory for demo)
  MOCK_SESSIONS[sessionId] = { userId, expires: expires.toISOString(), needs2FA };

  // Set cookie
  cookies().set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
    sameSite: 'lax',
  });

  console.log(`Session created: ${sessionId} for user ${userId}, needs2FA: ${needs2FA}`);
  return sessionId;
};

export const getSession = async (): Promise<any | null> => {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    return null;
  }

  const session = MOCK_SESSIONS[sessionId];
  if (!session || new Date(session.expires) < new Date()) {
    // Session expired or invalid, clear cookie and mock store
    delete MOCK_SESSIONS[sessionId];
    cookies().delete(SESSION_COOKIE_NAME);
    return null;
  }

  // Optionally refresh expiry on activity (not implemented here)

  // Fetch user associated with the session
  const user = MOCK_USERS.find(u => u.id === session.userId);
   if (!user) {
     // User deleted? Session invalid.
     delete MOCK_SESSIONS[sessionId];
     cookies().delete(SESSION_COOKIE_NAME);
     return null;
   }

  return { ...session, user: { id: user.id, email: user.email, twoFactorEnabled: user.twoFactorEnabled } }; // Return session and basic user info
};

export const updateSession = async (updates: Partial<any>): Promise<void> => {
    const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId || !MOCK_SESSIONS[sessionId]) {
        console.warn("Attempted to update non-existent session");
        return;
    }
    MOCK_SESSIONS[sessionId] = { ...MOCK_SESSIONS[sessionId], ...updates };
    console.log(`Session updated: ${sessionId}`, updates);
};


export const destroySession = async (): Promise<void> => {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    delete MOCK_SESSIONS[sessionId]; // Remove from mock store
    cookies().delete(SESSION_COOKIE_NAME); // Clear cookie
     console.log(`Session destroyed: ${sessionId}`);
  }
};


// --- 2FA Logic (Placeholder/Mocked) ---
// In a real app, integrate with libraries like 'speakeasy' or 'otplib'

// Mock secret generation
export const generate2FASecret = (): string => {
  // Replace with actual secret generation (e.g., speakeasy.generateSecret())
   console.warn("Using mocked generate2FASecret");
  // Use a simpler random generation that doesn't rely on crypto
   const mockRandom = Math.random().toString(36).substring(2, 10);
  return `MOCKSECRET${mockRandom}`;
};

// Mock code verification
export const verify2FAToken = (secret: string | null, token: string): boolean => {
  // Replace with actual verification (e.g., speakeasy.totp.verify())
  console.warn("Using mocked verify2FAToken");
  if (!secret) return false;
  // Simple mock: allow specific codes for testing if secret exists
  return secret.startsWith("MOCKSECRET") && (token === '123456' || token === '000000');
};
