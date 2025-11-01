import React from 'react';

interface ModelBoxIconProps {
  className?: string;
}

export const ModelBoxIcon: React.FC<ModelBoxIconProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1026.18"
      height="996.08"
      viewBox="0 0 1026.18 996.08"
      className={className}
      fill="currentColor"
    >
      <path d="M1026.18 637.41C849.66 754.6 674.71 874.25 498.6 992.08V697.85l527.58-355.17zM458.63 996.08 0 673.88V379.65l458.63 322.2zM549.56 0v293.23c-101.51 67.66-204.07 133.79-306.33 200.34L25 342.18zM595.53 6.99l416.66 290.72-216.32 142.55-200.34-140.04zM281.78 520.53l283.26-186.52 190.34 133.06-282.24 188.09z" />
    </svg>
  );
};
