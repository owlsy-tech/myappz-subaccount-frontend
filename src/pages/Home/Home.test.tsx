/**
 * Home Page Component Tests
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as hooks from '../../hooks';

import Home from './Home';

// Mock the hooks
vi.mock('../../hooks', () => ({
  usePerformanceMonitor: vi.fn(),
  useMemoryLeakDetector: vi.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to React Boilerplate/i)).toBeInTheDocument();
  });

  it('should render the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Welcome to React Boilerplate/i });
    expect(heading).toBeInTheDocument();
  });

  it('should render the description paragraph', () => {
    render(<Home />);
    const description = screen.getByText(/A production-ready React TypeScript boilerplate/i);
    expect(description).toBeInTheDocument();
  });

  it('should render the Features section', () => {
    render(<Home />);
    const featuresHeading = screen.getByRole('heading', { name: /Features/i });
    expect(featuresHeading).toBeInTheDocument();
  });

  it('should render all feature list items', () => {
    render(<Home />);

    expect(screen.getByText(/TypeScript with strict mode/i)).toBeInTheDocument();
    expect(screen.getByText(/ESLint \+ Prettier \+ Husky pre-commit hooks/i)).toBeInTheDocument();
    expect(screen.getByText(/React Router v6 for navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Zustand for state management/i)).toBeInTheDocument();
    expect(screen.getByText(/Axios with interceptors and retry logic/i)).toBeInTheDocument();
    expect(screen.getByText(/React Hook Form \+ Zod validation/i)).toBeInTheDocument();
    expect(screen.getByText(/Jest \+ React Testing Library \(80%\+ coverage\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Cypress for E2E testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance monitoring with Web Vitals/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory leak detection/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Actions CI\/CD pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/SonarQube integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Error boundaries and logging/i)).toBeInTheDocument();
  });

  it('should have proper ARIA labelledby attribute on features section', () => {
    render(<Home />);
    const section = screen.getByRole('region', { name: /Features/i });
    expect(section).toHaveAttribute('aria-labelledby', 'features-heading');
  });

  it('should render 13 feature items', () => {
    render(<Home />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(13);
  });

  it('should call usePerformanceMonitor hook', () => {
    const mockUsePerformanceMonitor = vi.mocked(hooks.usePerformanceMonitor);
    render(<Home />);

    expect(mockUsePerformanceMonitor).toHaveBeenCalledWith({
      componentName: 'Home',
      logSlowRenders: true,
      slowRenderThreshold: 16,
    });
  });

  it('should call useMemoryLeakDetector hook', () => {
    const mockUseMemoryLeakDetector = vi.mocked(hooks.useMemoryLeakDetector);
    render(<Home />);

    expect(mockUseMemoryLeakDetector).toHaveBeenCalledWith({
      componentName: 'Home',
      enabled: expect.any(Boolean),
    });
  });

  it('should apply correct styling to container', () => {
    const { container } = render(<Home />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveStyle({
      maxWidth: '600px',
      margin: '0 auto',
    });
  });

  it('should have proper semantic structure', () => {
    render(<Home />);

    // Check for header element
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    // Check for section element
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
  });
});
