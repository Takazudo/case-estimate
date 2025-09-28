import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  autoFocus?: boolean;
  returnFocusOnDeactivate?: boolean;
  onClose?: () => void;
}

/**
 * Custom hook for implementing focus trapping in modal/drawer components
 * Based on accessibility best practices from focus-trap library
 */
export const useFocusTrap = ({
  isActive,
  autoFocus = true,
  returnFocusOnDeactivate = true,
}: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement | HTMLDialogElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  // Handle Tab key navigation within the trap
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: move to previous element or cycle to last
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move to next element or cycle to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements],
  );

  // Note: Escape key handling is removed from focus trap
  // to avoid conflicts with other keyboard handlers

  // Main effect for managing focus trap
  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element before activating trap
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    // Auto-focus the first focusable element if enabled
    if (autoFocus && containerRef.current) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          focusableElements[0].focus();
        }, 50);
      }
    }

    // Add keyboard event listeners
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, autoFocus, handleTabKey, getFocusableElements]);

  // Return focus when trap is deactivated
  useEffect(() => {
    if (!isActive && returnFocusOnDeactivate && previouslyFocusedElementRef.current) {
      // Small delay to ensure the element is focusable again
      setTimeout(() => {
        previouslyFocusedElementRef.current?.focus();
      }, 50);
    }
  }, [isActive, returnFocusOnDeactivate]);

  return {
    containerRef,
    focusFirstElement: () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },
    focusLastElement: () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    },
  };
};
