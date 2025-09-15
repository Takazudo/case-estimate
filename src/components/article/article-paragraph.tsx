import React from 'react';

interface ArticleParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const ArticleParagraph: React.FC<ArticleParagraphProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-vgap-sm ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (typeof child === 'string') {
          return (
            <p key={index} className="text-base leading-normal">
              {child}
            </p>
          );
        }
        return child;
      })}
    </div>
  );
};

export default ArticleParagraph;
