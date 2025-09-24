interface ImgFloatRightProps {
  src: string;
  alt?: string;
  className?: string;
}

export function ImgFloatRight({ src, alt = '', className = '' }: ImgFloatRightProps) {
  return (
    <div
      className={`
      float-right ml-hgap-sm mb-vgap-sm
      ${className}
    `}
    >
      <img src={src} alt={alt} />
    </div>
  );
}
