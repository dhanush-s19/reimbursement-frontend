import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

const Card = ({ children, className = "", hoverable = false, ...props }: CardProps) => {
  const baseStyles = "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300";
  const hoverStyles = hoverable ? "hover:shadow-md hover:border-gray-300 cursor-pointer" : "";
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

const Header = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-5 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const Title = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-bold text-gray-900 tracking-tight ${className}`}>
    {children}
  </h3>
);

const Description = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>
    {children}
  </p>
);

const Content = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-5 ${className}`}>
    {children}
  </div>
);

const Footer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 bg-gray-50/50 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

// Assign sub-components
Card.Header = Header;
Card.Title = Title;
Card.Description = Description;
Card.Content = Content;
Card.Footer = Footer;

export default Card;