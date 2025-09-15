import React from 'react';

interface ArticleTextProps {
  children: React.ReactNode;
  className?: string;
}

const ArticleText: React.FC<ArticleTextProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`article-text text-sm md:text-base ${className}
        [&_p]:pb-vgap-md [&_p]:-mt-[0.3em]
        [&_ul]:text-sm [&_ul]:lg:text-base [&_ul]:list-disc [&_ul]:pl-hgap-md [&_ul]:pb-vgap-md [&_ul]:-mt-[0.3em]
        [&_ul>*+*]:mt-vgap-xs
        [&_ul_ul]:ml-0 [&_ul_ul]:mt-vgap-sm [&_ul_ul]:pb-vgap-xs
        [&_ol]:text-sm [&_ol]:lg:text-base [&_ol]:list-decimal [&_ol]:ml-hgap-md [&_ol]:pb-vgap-md [&_ol]:-mt-[0.3em]
        [&_ol>*+*]:mt-vgap-xs
        [&_ol_ol]:ml-hgap-sm [&_ol_ol]:mt-vgap-sm [&_ol_ol]:pb-vgap-xs
        [&_a]:text-zd-link [&_a:hover]:no-underline
        [&_strong]:font-bold [&_strong]:text-zd-link [&_strong]:mx-[2px]
        [&_em]:font-bold [&_em]:not-italic [&_em]:text-[1.1em]
      `}
    >
      {children}
    </div>
  );
};

export default ArticleText;
