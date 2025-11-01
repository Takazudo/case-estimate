'use client';

import React, { useEffect, useState } from 'react';
import { CloseIcon } from '@/components/icons/close-icon';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  ariaLabelledBy?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  ariaLabelledBy = 'base-modal-title',
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      return undefined;
    }

    if (shouldRender) {
      // Delay unmounting to allow fade-out animation
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isOpen, shouldRender]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-300
        bg-zd-black/70
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative bg-zd-black shadow-xl border border-zd-white
          w-full md:w-[90vw] max-w-[1400px]
          h-full md:h-[85vh]
          overflow-hidden
          transition-transform duration-300
          ${isOpen ? 'scale-100' : 'scale-95'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`
            px-hgap-sm py-vgap-sm
            md:px-hgap-md md:py-vgap-md
            flex items-center justify-between
            border-b border-zd-white
          `}
        >
          <h2
            id={ariaLabelledBy}
            className={`
              font-bold text-zd-white
              flex items-baseline gap-hgap-xs
            `}
          >
            {icon}
            <span className="text-base lg:text-xl">{title}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-zd-white zd-invert-color-link"
            aria-label="Close modal"
          >
            <CloseIcon className="w-[30px] md:w-[44px] aspect-square" />
          </button>
        </div>

        {/* Content */}
        <div
          className={`
            overflow-y-auto
            h-[calc(100%-80px)]
            px-hgap-md
            pt-vgap-md
            pb-[100px]
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export { BaseModal };
