import React from 'react';

interface ArrowDownIconProps {
  className?: string;
  fill?: string;
}

export const ArrowDownIcon: React.FC<ArrowDownIconProps> = ({
  className = '',
  fill = '#d6d3d1',
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" className={className} fill={fill}>
      <path d="M7.6.4L7.1,0l-1.6,1.6c-1,1-1.6,1.6-1.6,1.6,0,0-.7-.7-1.6-1.6L.9,0l-.4.4L0,.9s.2.2.4.4c.4.5.9.9,1.3,1.4,1.6,1.7,2.2,2.3,2.2,2.3s0,0,.4-.4c.6-.6,3.6-3.7,3.6-3.7,0,0-.2-.2-.4-.4M7.6,3.4l-.4-.4-.4.4c-.2.2-.6.7-.9,1-1.1,1.2-1.8,1.8-1.8,1.9,0,0,0,0,0,0s-.1-.1-.3-.3c-.2-.2-.8-.9-1.5-1.6-.7-.7-1.2-1.3-1.3-1.3h0C.9,3,0,3.8,0,3.9l4,4.1s4-4.1,4-4.2c0,0-.2-.2-.4-.4" />
    </svg>
  );
};
