
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IcebreakerQuestion {
  id: string;
  text: string;
  category: string;
}

const icebreakers: IcebreakerQuestion[] = [
  { id: 'ice1', text: 'What's your favorite way to spend a weekend?', category: 'Leisure' },
  { id: 'ice2', text: 'What's one place you've always wanted to travel to?', category: 'Travel' },
  { id: 'ice3', text: 'Two truths and a lie. Go!', category: 'Fun' },
  { id: 'ice4', text: 'What's your all-time favorite movie or TV show?', category: 'Entertainment' },
  { id: 'ice5', text: 'If you could have any superpower, what would it be?', category: 'Fantasy' },
  { id: 'ice6', text: 'What's your go-to comfort food?', category: 'Food' },
  { id: 'ice7', text: 'What's a skill you'd love to learn?', category: 'Personal Growth' },
  { id: 'ice8', text: 'Early bird or night owl?', category: 'Lifestyle' },
];

interface IceBreakersProps {
  onSelectIcebreaker?: (icebreaker: IcebreakerQuestion) => void;
  className?: string;
}

const IceBreakers = ({ onSelectIcebreaker, className }: IceBreakersProps) => {
  const [currentIcebreaker, setCurrentIcebreaker] = useState<IcebreakerQuestion>(
    icebreakers[Math.floor(Math.random() * icebreakers.length)]
  );
  
  const getNewIcebreaker = () => {
    const newIcebreakers = icebreakers.filter(ice => ice.id !== currentIcebreaker.id);
    setCurrentIcebreaker(newIcebreakers[Math.floor(Math.random() * newIcebreakers.length)]);
  };
  
  const handleSelectIcebreaker = () => {
    onSelectIcebreaker?.(currentIcebreaker);
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="bg-matchee-gradient-start/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-matchee-primary" />
          <h3 className="font-medium text-base">Icebreaker</h3>
        </div>
        <span className="text-xs bg-matchee-secondary/30 text-matchee-dark px-2 py-0.5 rounded-full">
          {currentIcebreaker.category}
        </span>
      </div>
      
      <CardContent className="p-4">
        <p className="text-base mb-4 min-h-[48px]">{currentIcebreaker.text}</p>
        
        <div className="flex gap-2 justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={getNewIcebreaker}
            className="text-xs"
          >
            Skip
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleSelectIcebreaker}
            className="text-xs bg-matchee-primary hover:bg-matchee-primary/90 text-white"
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IceBreakers;
