import { useEffect } from 'react';

interface UseGalleryKeyboardNavigationProps {
  isActive: boolean;
  onClose?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const useGalleryKeyboardNavigation = ({
  isActive,
  onClose,
  onNext,
  onPrevious,
}: UseGalleryKeyboardNavigationProps) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          if (onClose) {
            event.preventDefault();
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (onPrevious) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (onNext) {
            event.preventDefault();
            onNext();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onClose, onNext, onPrevious]);
};
