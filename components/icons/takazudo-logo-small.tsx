import React from 'react';

interface TakazudoLogoSmallProps {
  className?: string;
  fill?: string;
}

export const TakazudoLogoSmall: React.FC<TakazudoLogoSmallProps> = ({
  className = '',
  fill = 'white',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 36.166 32.879"
      className={className}
      fill={fill}
    >
      <path d="m31.342 10.516-9.907.001-4.679 7.772.115 1.468 4.466 7.382 9.407.177.982-.625 4.44-8.002zm-2.656 12.091-.466.297-4.465-.084-2.119-3.504-.055-.697 2.221-3.689h4.702l2.29 3.879zM.876 7.505l-.664-.541L0 1.143 1.001 0l17.292.004 1.14.735v5.902l-.743.864h-4.956l-.201.201v5.555L6.032 11.32V7.706l-.201-.201zM6.032 27.852l7.378 1.962-.209 1.253-1.737 1.745-3.296.067-1.922-1.895-.214-.053zM6.032 18.348l7.232 1.809.201 2.34-.373.239-6.823-1.713-.237-.332zM6.032 16.206v-2.409l7.501 1.941v2.008l-.44.311zM13.533 27.317l-7.501-1.808v-2.141l.432-.177 7.069 2.185z" />
    </svg>
  );
};
