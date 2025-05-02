
import React from 'react';
import { BadgeCheck as BadgeCheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCheckProps {
  className?: string;
  size?: number;
}

const BadgeCheck: React.FC<BadgeCheckProps> = ({ className, size = 16 }) => {
  return (
    <BadgeCheckIcon 
      className={cn("text-green-600", className)} 
      size={size} 
    />
  );
};

export default BadgeCheck;
