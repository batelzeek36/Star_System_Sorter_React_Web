import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders with message', () => {
    const onClose = vi.fn();
    render(<Toast message="Test message" onClose={onClose} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders error type with correct styling', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Toast message="Error occurred" type="error" onClose={onClose} />
    );
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    // Check for error gradient background
    const toastContent = container.querySelector('.from-\\[var\\(--s3-error\\)\\]');
    expect(toastContent).toBeInTheDocument();
  });

  it('displays retry button when onRetry is provided', () => {
    const onClose = vi.fn();
    const onRetry = vi.fn();
    render(
      <Toast
        message="Network error"
        type="error"
        onClose={onClose}
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('does not display retry button when onRetry is not provided', () => {
    const onClose = vi.fn();
    render(<Toast message="Success" type="success" onClose={onClose} />);
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });

  it('calls onRetry and onClose when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onRetry = vi.fn();
    
    render(
      <Toast
        message="Network error"
        type="error"
        onClose={onClose}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
    
    // Wait for the close animation
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    }, { timeout: 500 });
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<Toast message="Test" onClose={onClose} />);

    // Find the X close button (there should be one X icon button)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => btn.querySelector('svg'));
    
    if (closeButton) {
      await user.click(closeButton);
      
      // Wait for the close animation
      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      }, { timeout: 500 });
    }
  });

  it('auto-closes after duration when no retry button', async () => {
    const onClose = vi.fn();
    
    render(<Toast message="Auto close" onClose={onClose} duration={100} />);

    // Wait for auto-close (100ms duration + 300ms animation)
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    }, { timeout: 500 });
  });

  it('does not auto-close when retry button is present', async () => {
    const onClose = vi.fn();
    const onRetry = vi.fn();
    
    render(
      <Toast
        message="Error"
        onClose={onClose}
        onRetry={onRetry}
        duration={100}
      />
    );

    // Wait longer than duration
    await new Promise(resolve => setTimeout(resolve, 200));

    // Should not have auto-closed
    expect(onClose).not.toHaveBeenCalled();
  });
});
