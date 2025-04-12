
import React from 'react';
import { Heart, MessageCircle, X, Star, MapPin, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Interest {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  bio: string;
  photos: string[];
  interests: Interest[];
  compatibilityScore: number;
  isVerified: boolean;
}

interface MatcheeCardProps {
  profile: Profile;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onMessage?: (id: string) => void;
  onSpark?: (id: string) => void;
  className?: string;
}

const MatcheeCard = ({ 
  profile, 
  onLike, 
  onDislike, 
  onMessage, 
  onSpark,
  className 
}: MatcheeCardProps) => {
  const { id, name, age, location, distance, bio, photos, interests, compatibilityScore, isVerified } = profile;
  
  // Calculate meter level (0-100%)
  const meterLevel = Math.min(100, Math.max(0, compatibilityScore));
  
  return (
    <div className={cn("matchee-card overflow-hidden bg-white", className)}>
      {/* Main Photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={photos[0]} 
          alt={`${name}'s profile`} 
          className="w-full h-full object-cover"
        />
        
        {/* Compatibility Meter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full border-2 border-white relative flex items-center justify-center">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-matchee-primary to-matchee-gradient-end rounded-full"
              style={{ height: `${meterLevel}%` }}
            />
            <span className="text-xs font-bold text-white relative z-10">
              {compatibilityScore}%
            </span>
          </div>
          <span className="text-xs font-medium text-white">Match</span>
        </div>
        
        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-1">
            <BadgeCheck className="h-5 w-5 text-blue-500" />
          </div>
        )}
        
        {/* Location */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-white" />
          <span className="text-xs text-white">{distance} away</span>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">
              {name}, {age}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        
        <p className="text-sm line-clamp-2">{bio}</p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-1.5">
          {interests.map((interest) => (
            <Badge 
              key={interest.id} 
              variant="secondary" 
              className="rounded-full text-xs py-0 px-2"
            >
              {interest.name}
            </Badge>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full h-10 w-10 border-muted"
            onClick={() => onDislike?.(id)}
            aria-label="Dislike"
          >
            <X className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full h-10 w-10 border-muted"
            onClick={() => onMessage?.(id)}
            aria-label="Message"
          >
            <MessageCircle className="h-5 w-5 text-matchee-primary" />
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full h-10 w-10 border-muted"
            onClick={() => onSpark?.(id)}
            aria-label="Send spark"
          >
            <Star className="h-5 w-5 text-amber-400" />
          </Button>
          
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full h-10 w-10 border-muted"
            onClick={() => onLike?.(id)}
            aria-label="Like"
          >
            <Heart className="h-5 w-5 text-matchee-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatcheeCard;
