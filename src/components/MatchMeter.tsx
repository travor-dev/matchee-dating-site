
import React from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface MatchMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const MatchMeter = ({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: MatchMeterProps) => {
  // Ensure score is between 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  // Determine color based on score
  let meterColor = 'bg-gray-300';
  if (normalizedScore >= 80) {
    meterColor = 'bg-green-500';
  } else if (normalizedScore >= 60) {
    meterColor = 'bg-yellow-500';
  } else if (normalizedScore >= 40) {
    meterColor = 'bg-orange-500';
  } else {
    meterColor = 'bg-red-500';
  }
  
  // Size mapping
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base'
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative rounded-full border-4 border-gray-200 flex items-center justify-center", sizeClasses[size])}>
        {/* Circular meter background */}
        <svg className="absolute top-0 left-0 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={meterColor}
            strokeWidth="8%"
            strokeDasharray={`${normalizedScore} 100`}
            transform="rotate(-90) translate(-100, 0)"
            style={{ transformOrigin: 'center' }}
          />
        </svg>
        
        {/* Score display */}
        <div className="flex flex-col items-center justify-center z-10">
          <Heart className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} text-matchee-primary mb-0.5`} />
          <span className="font-bold">{normalizedScore}%</span>
        </div>
      </div>
      
      {showLabel && (
        <span className="mt-2 font-medium text-sm">Matchee Meter</span>
      )}
    </div>
  );
};

export default MatchMeter;
