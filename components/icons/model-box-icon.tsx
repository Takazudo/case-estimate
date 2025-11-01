import React from 'react';

interface ModelBoxIconProps {
  className?: string;
}

export const ModelBoxIcon: React.FC<ModelBoxIconProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="461.71"
      height="392.32"
      viewBox="0 0 461.71 392.32"
      className={className}
      fill="currentColor"
    >
      <g>
        <polygon points="215.75 355.52 45.41 238.63 45.41 135 215.75 251.9 215.75 355.52" />
        <polygon points="420.5 225.92 223 355.52 223 251.9 420.5 122.3 420.5 225.92" />
        <polygon points="418.92 114.3 253.82 1 253.82 104.62 341.73 164.95 418.92 114.3" />
        <polygon points="50.82 129.6 50.82 131.45 126.63 183.47 248.32 103.62 248.32 0 50.82 129.6" />
        <polygon points="132.98 186.14 249.32 109.26 337.63 167.3 218.22 245.42 132.98 186.14" />
      </g>
    </svg>
  );
};
