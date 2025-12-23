/**
 * Validation Utilities Tests
 * Unit tests for validation schemas and helper functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  userRegisterSchema,
  userLoginSchema,
  contactFormSchema,
  userProfileUpdateSchema,
  passwordChangeSchema,
  searchQuerySchema,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidUsername,
  isValidPassword,
  getPasswordStrength,
  sanitizeString,
  validateFile,
  debounce,
} from './validation';

describe('Validation Schemas', () => {
  describe('userRegisterSchema', () => {
    it('should validate a correct registration form', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        phoneNumber: '+1234567890',
        acceptTerms: true,
      };

      const result = userRegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation when passwords do not match', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
        phoneNumber: '+1234567890',
        acceptTerms: true,
      };

      const result = userRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('confirmPassword');
      }
    });

    it('should fail validation when terms are not accepted', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        phoneNumber: '+1234567890',
        acceptTerms: false,
      };

      const result = userRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail validation with invalid email', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'invalid-email',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        phoneNumber: '+1234567890',
        acceptTerms: true,
      };

      const result = userRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail validation with weak password', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        phoneNumber: '+1234567890',
        acceptTerms: true,
      };

      const result = userRegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('userLoginSchema', () => {
    it('should validate a correct login form', () => {
      const validData = {
        email: 'john.doe@example.com',
        password: 'anyPassword',
        rememberMe: true,
      };

      const result = userLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation with invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'anyPassword',
      };

      const result = userLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail validation with empty password', () => {
      const invalidData = {
        email: 'john.doe@example.com',
        password: '',
      };

      const result = userLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('contactFormSchema', () => {
    it('should validate a correct contact form', () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Inquiry about services',
        message: 'I would like to know more about your services.',
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation with short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Inquiry about services',
        message: 'Too short',
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('passwordChangeSchema', () => {
    it('should validate a correct password change', () => {
      const validData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmPassword: 'NewPass123!',
      };

      const result = passwordChangeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail when new passwords do not match', () => {
      const invalidData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmPassword: 'DifferentPass123!',
      };

      const result = passwordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail when new password is same as current', () => {
      const invalidData = {
        currentPassword: 'SamePass123!',
        newPassword: 'SamePass123!',
        confirmPassword: 'SamePass123!',
      };

      const result = passwordChangeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Validation Helper Functions', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('test123@test-domain.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('+441234567890')).toBe(true);
      expect(isValidPhone('1234567890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('1')).toBe(false); // Too short (needs at least 2 digits total)
      expect(isValidPhone('+abc123')).toBe(false);
      expect(isValidPhone('0123456789')).toBe(false); // Cannot start with 0
      expect(isValidPhone('')).toBe(false); // Empty string
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://www.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=1')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('invalid')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should return true for valid usernames', () => {
      expect(isValidUsername('johndoe')).toBe(true);
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('john-doe123')).toBe(true);
    });

    it('should return false for invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false);
      expect(isValidUsername('john doe')).toBe(false);
      expect(isValidUsername('john@doe')).toBe(false);
      expect(isValidUsername('a'.repeat(21))).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for strong passwords', () => {
      expect(isValidPassword('SecurePass123!')).toBe(true);
      expect(isValidPassword('MyP@ssw0rd')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(isValidPassword('weak')).toBe(false);
      expect(isValidPassword('nouppercase1!')).toBe(false);
      expect(isValidPassword('NOLOWERCASE1!')).toBe(false);
      expect(isValidPassword('NoNumbers!')).toBe(false);
      expect(isValidPassword('NoSpecial123')).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return 0 for very weak passwords', () => {
      expect(getPasswordStrength('weak')).toBe(0);
    });

    it('should return low strength for basic passwords', () => {
      expect(getPasswordStrength('password')).toBeLessThanOrEqual(2);
    });

    it('should return high strength for strong passwords', () => {
      expect(getPasswordStrength('SecurePass123!')).toBeGreaterThanOrEqual(3);
    });

    it('should cap strength at 4', () => {
      expect(getPasswordStrength('VerySecureP@ssw0rd123')).toBeLessThanOrEqual(4);
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize HTML special characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should handle ampersands', () => {
      expect(sanitizeString('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should handle quotes', () => {
      expect(sanitizeString('He said "hello"')).toBe('He said &quot;hello&quot;');
      expect(sanitizeString("It's working")).toBe('It&#x27;s working');
    });

    it('should return unchanged string without special chars', () => {
      expect(sanitizeString('Hello World')).toBe('Hello World');
    });
  });

  describe('validateFile', () => {
    it('should validate file within size limit', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateFile(file, { maxSize: 1024 * 1024 });
      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const largeContent = new Array(6 * 1024 * 1024).join('a');
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('size');
    });

    it('should validate allowed file types', () => {
      const file = new File(['content'], 'image.png', { type: 'image/png' });
      const result = validateFile(file, { allowedTypes: ['image/png', 'image/jpeg'] });
      expect(result.valid).toBe(true);
    });

    it('should reject disallowed file types', () => {
      const file = new File(['content'], 'script.js', { type: 'application/javascript' });
      const result = validateFile(file, { allowedTypes: ['image/png', 'image/jpeg'] });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('type');
    });

    it('should validate allowed file extensions', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const result = validateFile(file, { allowedExtensions: ['pdf', 'doc'] });
      expect(result.valid).toBe(true);
    });

    it('should reject disallowed file extensions', () => {
      const file = new File(['content'], 'script.exe', { type: 'application/octet-stream' });
      const result = validateFile(file, { allowedExtensions: ['pdf', 'doc'] });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('extension');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('should call function after delay', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('test');

      vi.advanceTimersByTime(499);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
