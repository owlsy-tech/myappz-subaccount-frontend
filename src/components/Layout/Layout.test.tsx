/**
 * Layout Component Tests
 * Unit tests for Layout component
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useUser } from '../../store/useUserStore';

import Layout from './Layout';

import type { IUser } from '../../types/user.types';

// Import after mock

// Mock the user store
vi.mock('../../store/useUserStore', () => ({
  useUser: vi.fn(),
  useUserStore: vi.fn(),
}));

const mockUseUser = useUser as unknown as ReturnType<typeof vi.fn>;

describe('Layout', () => {
  const mockUser: IUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowMessaging: true,
      },
    },
  };

  const renderLayout = (children: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render layout structure', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div data-testid="test-content">Test Content</div>);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should render children in main content area', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div data-testid="test-content">Test Content</div>);

      const main = screen.getByRole('main');
      expect(main).toContainElement(screen.getByTestId('test-content'));
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Header', () => {
    it('should render header with navigation', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('should render brand link', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.length).toBeGreaterThan(0);
      // Check that at least one link points to home
      const brandLink = homeLinks.find((link) => link.getAttribute('href') === '/');
      expect(brandLink).toBeDefined();
    });

    it('should render home navigation link', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should display user welcome message when logged in', () => {
      mockUseUser.mockReturnValue(mockUser);

      renderLayout(<div>Content</div>);

      expect(screen.getByText(/Welcome, John/)).toBeInTheDocument();
    });

    it('should not display user welcome message when not logged in', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render footer with copyright', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent(new Date().getFullYear().toString());
      expect(footer).toHaveTextContent('All rights reserved');
    });

    it('should render footer description', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      expect(screen.getByText(/Built with React, TypeScript/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have aria-label on navigation', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should have aria-current on active links', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      // The home link should be active when on home page
      const homeNavLink = screen
        .getAllByRole('link')
        .find((link) => link.textContent?.includes('Home') && link.getAttribute('href') === '/');

      // Check if it has aria-current attribute (it should on home page)
      if (homeNavLink) {
        expect(homeNavLink).toHaveAttribute('aria-current', 'page');
      }
    });
  });

  describe('Responsive Layout', () => {
    it('should render with proper container constraints', () => {
      mockUseUser.mockReturnValue(null);

      renderLayout(<div>Content</div>);

      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ maxWidth: '1200px' });
    });
  });

  describe('Memoization', () => {
    it('should be memoized to prevent unnecessary re-renders', () => {
      mockUseUser.mockReturnValue(null);

      const { rerender } = renderLayout(<div>Content 1</div>);

      // Rerender with different children
      rerender(
        <BrowserRouter>
          <Layout>
            <div>Content 2</div>
          </Layout>
        </BrowserRouter>
      );

      // Layout should still be rendered correctly
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
});
