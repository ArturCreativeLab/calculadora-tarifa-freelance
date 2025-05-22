
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string; // Emoji
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl p-6 sm:p-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 flex items-center">
          {icon && <span className="mr-3 text-3xl">{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
