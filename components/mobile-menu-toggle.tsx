import React from 'react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  'aria-label'?: string;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({
  isOpen,
  onToggle,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        zd-invert-color-link
        cursor-pointer
        relative z-50 flex w-[40px] h-[40px]
        flex-col
        items-center justify-center
        focus:outline-none text-zd-white ${className}
      `}
      aria-expanded={isOpen}
      aria-label={ariaLabel || 'Toggle menu'}
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      <div className="relative flex h-[20px] w-[28px] flex-col items-center justify-center">
        <span
          className={`
            absolute h-[2px] w-[28px] transform bg-current
            transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-y-0 rotate-45' : '-translate-y-[8px]'}
          `}
        />
        <span
          className={`
            absolute h-[2px] w-[28px] transform bg-current
            transition-all duration-300 ease-in-out
            ${isOpen ? 'scale-0 opacity-0' : ''}
          `}
        />
        <span
          className={`
            absolute h-[2px] w-[28px] transform bg-current
            transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[8px]'}
          `}
        />
      </div>
    </button>
  );
};

export default MobileMenuToggle;
