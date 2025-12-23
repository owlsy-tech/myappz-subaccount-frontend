/**
 * User Types
 * Type definitions for user-related data structures
 */

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: TUserRole;
  status: TUserStatus;
  avatar?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  preferences: IUserPreferences;
}

export type TUserRole = 'admin' | 'user' | 'moderator' | 'guest';

export type TUserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: INotificationPreferences;
  privacy: IPrivacyPreferences;
}

export interface INotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface IPrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  allowMessaging: boolean;
}

export interface IUserProfile extends Omit<IUser, 'preferences'> {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: ISocialLinks;
  statistics?: IUserStatistics;
}

export interface ISocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

export interface IUserStatistics {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}

export interface IUserLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IUserRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  acceptTerms: boolean;
}

export interface IUserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  preferences?: Partial<IUserPreferences>;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface IAuthResponse {
  user: IUser;
  tokens: IAuthTokens;
}
