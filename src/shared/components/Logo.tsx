import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Size mapping
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    '2xl': 'w-32 h-32 sm:w-40 sm:h-40',
  }[size];

  return (
    <div className={`inline-flex items-center justify-center text-primary dark:text-white ${className}`}>
      <svg
        viewBox="0 0 200 150"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} shrink-0 transition-transform duration-300 hover:scale-105`}
        aria-label="EIFFEL Emblem Logo"
      >
        {/* Top Spear / Spire Tip */}
        <path d="M100 2 L106 18 L100 26 L94 18 Z" />

        {/* Spire Neck Column */}
        <path d="M96 28 H104 L107 54 H93 Z" />

        {/* Middle Crossbar & Main Tower Body */}
        <path
          d="M91 56 H109 L115 86 H125 L136 116 H118 L107 90 H93 L82 116 H64 L75 86 H85 Z"
        />

        {/* Base Arch Underpass & Outer Legs */}
        <path
          d="M78 116 Q100 92 122 116 L139 116 L124 86 H76 L61 116 Z"
          fill="currentColor"
        />

        {/* Center Triangular Window A */}
        <path
          d="M93 72 H107 L103 84 H97 Z"
          fill="var(--color-surface, #000)"
          className="dark:fill-zinc-950 fill-white"
        />

        {/* Left Wing (Feathers) */}
        <g>
          {/* Feather 1 (Top) */}
          <path d="M90 44 C72 38 48 39 30 45 C45 49 68 50 87 52 Z" />
          {/* Feather 2 */}
          <path d="M86 54 C66 52 42 56 29 65 C44 65 67 62 83 62 Z" />
          {/* Feather 3 */}
          <path d="M82 65 C64 66 45 74 34 85 C47 80 66 74 79 73 Z" />
          {/* Feather 4 (Bottom) */}
          <path d="M78 76 C65 80 50 91 42 102 C52 94 67 86 75 83 Z" />
        </g>

        {/* Right Wing (Feathers) */}
        <g>
          {/* Feather 1 (Top) */}
          <path d="M110 44 C128 38 152 39 170 45 C155 49 132 50 113 52 Z" />
          {/* Feather 2 */}
          <path d="M114 54 C134 52 158 56 171 65 C156 65 133 62 117 62 Z" />
          {/* Feather 3 */}
          <path d="M118 65 C136 66 155 74 166 85 C153 80 134 74 121 73 Z" />
          {/* Feather 4 (Bottom) */}
          <path d="M122 76 C135 80 150 91 158 102 C148 94 133 86 125 83 Z" />
        </g>
      </svg>
    </div>
  );
};
