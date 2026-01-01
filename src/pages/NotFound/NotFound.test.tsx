/**
 * NotFound Page Component Tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import NotFound from './NotFound';

// Mock window.history.back
const mockHistoryBack = vi.fn();

describe('NotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'history', {
      value: { back: mockHistoryBack },
      writable: true,
      configurable: true,
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('should render without crashing', () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render the 404 error code', () => {
    renderWithRouter(<NotFound />);
    const errorCode = screen.getByText('404');
    expect(errorCode).toBeInTheDocument();
    expect(errorCode).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render the main heading', () => {
    renderWithRouter(<NotFound />);
    const heading = screen.getByRole('heading', { name: /Page Not Found/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should render the error description', () => {
    renderWithRouter(<NotFound />);
    const description = screen.getByText(
      /Sorry, the page you are looking for does not exist or has been moved/i
    );
    expect(description).toBeInTheDocument();
  });

  it('should render "Go to Home" link', () => {
    renderWithRouter(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /Go to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render "Go Back" button', () => {
    renderWithRouter(<NotFound />);
    const backButton = screen.getByRole('button', { name: /Go Back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('type', 'button');
  });

  it('should call window.history.back when Go Back button is clicked', () => {
    renderWithRouter(<NotFound />);
    const backButton = screen.getByRole('button', { name: /Go Back/i });

    fireEvent.click(backButton);

    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });

  it('should render the "Need Help?" section', () => {
    renderWithRouter(<NotFound />);
    const helpHeading = screen.getByRole('heading', { name: /Need Help\?/i, level: 2 });
    expect(helpHeading).toBeInTheDocument();
  });

  it('should render help instructions', () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText(/Check the URL for typos/i)).toBeInTheDocument();
    expect(screen.getByText(/Make sure you have the correct permissions/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Try refreshing the page or clearing your browser cache/i)
    ).toBeInTheDocument();
  });

  it('should have proper styling on home link', () => {
    renderWithRouter(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /Go to Home/i });

    const computedStyle = window.getComputedStyle(homeLink);
    expect(homeLink.style.backgroundColor).toBe('rgb(66, 153, 225)');
    expect(homeLink.style.color).toBe('white');
    expect(homeLink.style.textDecoration).toBe('none');
  });

  it('should change background color on home link hover', () => {
    renderWithRouter(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /Go to Home/i });

    // Initial state
    expect(homeLink.style.backgroundColor).toBe('rgb(66, 153, 225)');

    // Hover state
    fireEvent.mouseOver(homeLink);
    expect(homeLink.style.backgroundColor).toBe('rgb(49, 130, 206)');

    // Mouse out state
    fireEvent.mouseOut(homeLink);
    expect(homeLink.style.backgroundColor).toBe('rgb(66, 153, 225)');
  });

  it('should change background color on home link focus', () => {
    renderWithRouter(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /Go to Home/i });

    // Initial state
    expect(homeLink.style.backgroundColor).toBe('rgb(66, 153, 225)');

    // Focus state
    fireEvent.focus(homeLink);
    expect(homeLink.style.backgroundColor).toBe('rgb(49, 130, 206)');

    // Blur state
    fireEvent.blur(homeLink);
    expect(homeLink.style.backgroundColor).toBe('rgb(66, 153, 225)');
  });

  it('should change background color on back button hover', () => {
    renderWithRouter(<NotFound />);
    const backButton = screen.getByRole('button', { name: /Go Back/i });

    // Initial state
    expect(backButton.style.backgroundColor).toBe('rgb(237, 242, 247)');

    // Hover state
    fireEvent.mouseOver(backButton);
    expect(backButton.style.backgroundColor).toBe('rgb(226, 232, 240)');

    // Mouse out state
    fireEvent.mouseOut(backButton);
    expect(backButton.style.backgroundColor).toBe('rgb(237, 242, 247)');
  });

  it('should change background color on back button focus', () => {
    renderWithRouter(<NotFound />);
    const backButton = screen.getByRole('button', { name: /Go Back/i });

    // Initial state
    expect(backButton.style.backgroundColor).toBe('rgb(237, 242, 247)');

    // Focus state
    fireEvent.focus(backButton);
    expect(backButton.style.backgroundColor).toBe('rgb(226, 232, 240)');

    // Blur state
    fireEvent.blur(backButton);
    expect(backButton.style.backgroundColor).toBe('rgb(237, 242, 247)');
  });

  it('should render all help list items', () => {
    renderWithRouter(<NotFound />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should have proper container styling', () => {
    const { container } = renderWithRouter(<NotFound />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv.style.display).toBe('flex');
    expect(mainDiv.style.flexDirection).toBe('column');
    expect(mainDiv.style.alignItems).toBe('center');
    expect(mainDiv.style.justifyContent).toBe('center');
  });

  it('should render as a memoized component', () => {
    const { rerender } = renderWithRouter(<NotFound />);

    // Rerender with same props
    rerender(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    // Component should still be in the document
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should have accessible structure', () => {
    renderWithRouter(<NotFound />);

    // Check headings hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });

    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });

  it('should render error code with large font size', () => {
    renderWithRouter(<NotFound />);
    const errorCode = screen.getByText('404');

    expect(errorCode.style.fontSize).toBe('8rem');
    expect(errorCode.style.fontWeight).toBe('bold');
    expect(errorCode.style.color).toBe('rgb(66, 153, 225)');
  });
});
