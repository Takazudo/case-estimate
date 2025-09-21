'use client';

import React, { useEffect, useState } from 'react';
import { useFocusTrap } from '../../hooks/use-focus-trap';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageAlt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, imageAlt, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const { containerRef } = useFocusTrap({
    isActive: isOpen && shouldRender,
    autoFocus: true,
    returnFocusOnDeactivate: true,
    onClose,
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setImageLoaded(false);
    } else if (shouldRender) {
      // Start fade-out by setting imageLoaded to false
      setImageLoaded(false);
      // Hide modal after fade-out animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);

      return () => clearTimeout(timer);
    }

    return () => {
      if (isOpen) {
        document.body.style.overflow = 'unset';
      }
      setIsLoading(false);
    };
  }, [isOpen, shouldRender]);

  const handleImageLoad = () => {
    setIsLoading(false);
    // Small delay to allow DOM to update before fade-in
    setTimeout(() => {
      setImageLoaded(true);
    }, 10);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageLoaded(true); // Show even if error occurs
  };

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ backgroundColor: 'rgba(32, 31, 31, 0.7)' }}
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-[10px] md:p-[15px] lg:p-[20px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="loader" />
          </div>
        )}

        {imageUrl && (
          <img
            id="modal-description"
            src={imageUrl}
            alt={imageAlt}
            className={`
              max-w-full max-h-full object-contain bg-white rounded-lg
              transition-opacity duration-300 ease-in-out
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={(e) => e.stopPropagation()}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}

        {/* Hidden title for screen readers */}
        <h2 id="modal-title" className="sr-only">
          {imageAlt} - Enlarged Image
        </h2>
      </div>
    </div>
  );
};

export { ImageModal };
