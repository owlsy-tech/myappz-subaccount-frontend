/**
 * User Store
 * Zustand store for user state management
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { logger } from '../utils/logger';

import type { IUser, IAuthTokens } from '../types/user.types';

interface IUserState {
  user: IUser | null;
  tokens: IAuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface IUserActions {
  setUser: (user: IUser) => void;
  setTokens: (tokens: IAuthTokens) => void;
  login: (user: IUser, tokens: IAuthTokens) => void;
  logout: () => void;
  updateUser: (updates: Partial<IUser>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshToken: (tokens: IAuthTokens) => void;
}

type TUserStore = IUserState & IUserActions;

const initialState: IUserState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * User store with persistence
 */
export const useUserStore = create<TUserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Set user data
         */
        setUser: (user: IUser) => {
          logger.debug('Setting user', { userId: user.id });
          set(
            {
              user,
              isAuthenticated: true,
              error: null,
            },
            false,
            'setUser'
          );
        },

        /**
         * Set authentication tokens
         */
        setTokens: (tokens: IAuthTokens) => {
          logger.debug('Setting tokens');
          set(
            {
              tokens,
            },
            false,
            'setTokens'
          );
        },

        /**
         * Login user with credentials
         */
        login: (user: IUser, tokens: IAuthTokens) => {
          logger.info('User logged in', { userId: user.id, email: user.email });
          set(
            {
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            },
            false,
            'login'
          );
        },

        /**
         * Logout user
         */
        logout: () => {
          const currentUser = get().user;
          if (currentUser) {
            logger.info('User logged out', { userId: currentUser.id });
          }
          set(
            {
              ...initialState,
            },
            false,
            'logout'
          );
        },

        /**
         * Update user data
         */
        updateUser: (updates: Partial<IUser>) => {
          const currentUser = get().user;
          if (!currentUser) {
            logger.warn('Attempted to update user when no user is logged in');
            return;
          }

          logger.debug('Updating user', { userId: currentUser.id, updates });
          set(
            {
              user: {
                ...currentUser,
                ...updates,
              },
            },
            false,
            'updateUser'
          );
        },

        /**
         * Set loading state
         */
        setLoading: (loading: boolean) => {
          set(
            {
              isLoading: loading,
            },
            false,
            'setLoading'
          );
        },

        /**
         * Set error
         */
        setError: (error: string | null) => {
          if (error) {
            logger.error('User store error', new Error(error));
          }
          set(
            {
              error,
              isLoading: false,
            },
            false,
            'setError'
          );
        },

        /**
         * Clear error
         */
        clearError: () => {
          set(
            {
              error: null,
            },
            false,
            'clearError'
          );
        },

        /**
         * Refresh authentication tokens
         */
        refreshToken: (tokens: IAuthTokens) => {
          logger.debug('Refreshing authentication tokens');
          set(
            {
              tokens,
            },
            false,
            'refreshToken'
          );
        },
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          user: state.user,
          tokens: state.tokens,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'UserStore',
      enabled: import.meta.env.MODE === 'development',
    }
  )
);

/**
 * Selectors for common user data access
 */
export const selectUser = (state: TUserStore) => state.user;
export const selectTokens = (state: TUserStore) => state.tokens;
export const selectIsAuthenticated = (state: TUserStore) => state.isAuthenticated;
export const selectIsLoading = (state: TUserStore) => state.isLoading;
export const selectError = (state: TUserStore) => state.error;
export const selectUserRole = (state: TUserStore) => state.user?.role;
export const selectUserEmail = (state: TUserStore) => state.user?.email;

/**
 * Custom hooks for specific user data
 */
export const useUser = () => useUserStore(selectUser);
export const useTokens = () => useUserStore(selectTokens);
export const useIsAuthenticated = () => useUserStore(selectIsAuthenticated);
export const useUserRole = () => useUserStore(selectUserRole);
export const useUserEmail = () => useUserStore(selectUserEmail);
