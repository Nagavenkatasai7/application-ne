/**
 * @resume-maker/auth/password - Type Declarations
 */

/**
 * Hash a password using bcrypt
 */
export declare function hashPassword(password: string): Promise<string>;

/**
 * Verify a password against a hash
 */
export declare function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean>;

/**
 * Generate a 6-digit security code for password reset
 */
export declare function generateSecurityCode(): string;

/**
 * Generate a secure verification/reset token
 */
export declare function generateVerificationToken(): string;

/**
 * Get token expiration date (default 1 hour from now)
 */
export declare function getTokenExpiration(hours?: number): Date;

/**
 * Get security code expiration (10 minutes from now)
 */
export declare function getSecurityCodeExpiration(): Date;

/**
 * Check if a token/code has expired
 */
export declare function isTokenExpired(expirationDate: Date | null): boolean;
