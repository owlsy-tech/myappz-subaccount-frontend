/**
 * Validation Utilities
 * Zod schemas and validation helpers for form validation
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Error messages
 */
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  username:
    'Username must be 3-20 characters and contain only letters, numbers, hyphens, and underscores',
  password:
    'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  passwordMatch: 'Passwords do not match',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be at most ${max}`,
  alphanumeric: 'Must contain only letters and numbers',
  numeric: 'Must contain only numbers',
  alpha: 'Must contain only letters',
  terms: 'You must accept the terms and conditions',
};

/**
 * Base schemas
 */
export const emailSchema = z
  .string()
  .min(1, validationMessages.required)
  .regex(EMAIL_REGEX, validationMessages.email)
  .email(validationMessages.email);

export const passwordSchema = z
  .string()
  .min(8, validationMessages.minLength(8))
  .regex(PASSWORD_REGEX, validationMessages.password);

export const usernameSchema = z
  .string()
  .min(3, validationMessages.minLength(3))
  .max(20, validationMessages.maxLength(20))
  .regex(USERNAME_REGEX, validationMessages.username);

export const phoneSchema = z
  .string()
  .regex(PHONE_REGEX, validationMessages.phone)
  .optional()
  .or(z.literal(''));

export const urlSchema = z
  .string()
  .regex(URL_REGEX, validationMessages.url)
  .optional()
  .or(z.literal(''));

/**
 * User registration schema
 */
export const userRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, validationMessages.required)
      .min(2, validationMessages.minLength(2))
      .max(50, validationMessages.maxLength(50))
      .regex(/^[a-zA-Z\s'-]+$/, 'First name must contain only letters'),
    lastName: z
      .string()
      .min(1, validationMessages.required)
      .min(2, validationMessages.minLength(2))
      .max(50, validationMessages.maxLength(50))
      .regex(/^[a-zA-Z\s'-]+$/, 'Last name must contain only letters'),
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, validationMessages.required),
    phoneNumber: phoneSchema,
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: validationMessages.terms,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: validationMessages.passwordMatch,
    path: ['confirmPassword'],
  });

/**
 * User login schema
 */
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, validationMessages.required),
  rememberMe: z.boolean().optional(),
});

/**
 * Contact form schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, validationMessages.required)
    .min(2, validationMessages.minLength(2))
    .max(100, validationMessages.maxLength(100)),
  email: emailSchema,
  subject: z
    .string()
    .min(1, validationMessages.required)
    .min(5, validationMessages.minLength(5))
    .max(200, validationMessages.maxLength(200)),
  message: z
    .string()
    .min(1, validationMessages.required)
    .min(10, validationMessages.minLength(10))
    .max(2000, validationMessages.maxLength(2000)),
});

/**
 * User profile update schema
 */
export const userProfileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, validationMessages.minLength(2))
    .max(50, validationMessages.maxLength(50))
    .optional(),
  lastName: z
    .string()
    .min(2, validationMessages.minLength(2))
    .max(50, validationMessages.maxLength(50))
    .optional(),
  phoneNumber: phoneSchema,
  bio: z.string().max(500, validationMessages.maxLength(500)).optional().or(z.literal('')),
  website: urlSchema,
  location: z.string().max(100, validationMessages.maxLength(100)).optional().or(z.literal('')),
});

/**
 * Password change schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, validationMessages.required),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, validationMessages.required),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: validationMessages.passwordMatch,
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(1, validationMessages.required)
    .min(2, validationMessages.minLength(2))
    .max(100, validationMessages.maxLength(100)),
  category: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'popularity']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

/**
 * Type exports
 */
export type TUserRegisterForm = z.infer<typeof userRegisterSchema>;
export type TUserLoginForm = z.infer<typeof userLoginSchema>;
export type TContactForm = z.infer<typeof contactFormSchema>;
export type TUserProfileUpdateForm = z.infer<typeof userProfileUpdateSchema>;
export type TPasswordChangeForm = z.infer<typeof passwordChangeSchema>;
export type TSearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * Validation helper functions
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  return URL_REGEX.test(url);
};

/**
 * Validates username format
 */
export const isValidUsername = (username: string): boolean => {
  return USERNAME_REGEX.test(username);
};

/**
 * Validates password strength
 */
export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

/**
 * Calculates password strength (0-4)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[@$!%*?&]/.test(password)) strength += 1;

  return Math.min(strength, 4);
};

/**
 * Sanitizes string input (removes XSS)
 */
export const sanitizeString = (input: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/gi;
  return input.replace(reg, (match) => map[match] ?? match);
};

/**
 * Validates file upload
 */
export interface IFileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export const validateFile = (
  file: File,
  options: IFileValidationOptions = {}
): { valid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension must be one of: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  return { valid: true };
};

/**
 * Debounce validation for real-time input
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
