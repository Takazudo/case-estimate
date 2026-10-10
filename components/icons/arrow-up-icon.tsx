interface ArrowUpIconProps {
  className?: string;
}

export const ArrowUpIcon = ({ className = '' }: ArrowUpIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class={className}>
      <path
        d="M12 19V5M12 5L5 12M12 5L19 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
