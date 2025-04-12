
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Radio, RadioGroup } from '@radix-ui/react-radio-group';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    value: number;
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'How do you prefer to spend your free time?',
    options: [
      { id: 'q1_a', text: 'Going out and socializing', value: 1 },
      { id: 'q1_b', text: 'A mix of social activities and me-time', value: 2 },
      { id: 'q1_c', text: 'Cozy nights at home', value: 3 },
    ],
  },
  {
    id: 'q2',
    text: 'What\'s your approach to fitness and wellness?',
    options: [
      { id: 'q2_a', text: 'It\'s a top priority in my life', value: 1 },
      { id: 'q2_b', text: 'I try to stay active and healthy', value: 2 },
      { id: 'q2_c', text: 'I\'m pretty relaxed about it', value: 3 },
    ],
  },
  {
    id: 'q3',
    text: 'How important are shared interests in your relationships?',
    options: [
      { id: 'q3_a', text: 'Very important', value: 1 },
      { id: 'q3_b', text: 'Somewhat important', value: 2 },
      { id: 'q3_c', text: 'Not very important', value: 3 },
    ],
  },
  {
    id: 'q4',
    text: 'What\'s your communication style?',
    options: [
      { id: 'q4_a', text: 'I share everything and talk frequently', value: 1 },
      { id: 'q4_b', text: 'I communicate when needed', value: 2 },
      { id: 'q4_c', text: 'I\'m more reserved and private', value: 3 },
    ],
  },
  {
    id: 'q5',
    text: 'What are your long-term relationship goals?',
    options: [
      { id: 'q5_a', text: 'Marriage and family', value: 1 },
      { id: 'q5_b', text: 'Long-term partnership without marriage', value: 2 },
      { id: 'q5_c', text: 'Taking it day by day', value: 3 },
    ],
  },
];

interface CompatibilityQuizProps {
  onComplete?: (results: Record<string, number>) => void;
  className?: string;
}

const CompatibilityQuiz = ({ onComplete, className }: CompatibilityQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  const handleNext = () => {
    if (!selectedOption) return;
    
    const option = currentQuestion.options.find(opt => opt.id === selectedOption);
    if (!option) return;
    
    // Save answer
    setAnswers({
      ...answers,
      [currentQuestion.id]: option.value,
    });
    
    // Move to next question or finish
    if (isLastQuestion) {
      const finalAnswers = {
        ...answers,
        [currentQuestion.id]: option.value,
      };
      onComplete?.(finalAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };
  
  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestionId = quizQuestions[currentQuestionIndex - 1].id;
      setSelectedOption(
        currentQuestion.options.find(opt => opt.value === answers[prevQuestionId])?.id || null
      );
    }
  };
  
  return (
    <Card className={cn("p-6", className)}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Compatibility Quiz</h3>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1}/{quizQuestions.length}
          </span>
        </div>
        
        <div className="w-full bg-secondary h-1.5 rounded-full mb-8">
          <div 
            className="bg-matchee-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
        
        <h4 className="text-xl font-medium mb-6">{currentQuestion.text}</h4>
        
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => (
            <div 
              key={option.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                selectedOption === option.id 
                  ? "border-matchee-primary bg-matchee-secondary/10" 
                  : "hover:bg-accent"
              )}
              onClick={() => setSelectedOption(option.id)}
            >
              <div className="flex items-center justify-between">
                <span>{option.text}</span>
                {selectedOption === option.id && (
                  <div className="h-5 w-5 rounded-full bg-matchee-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={cn(isFirstQuestion ? 'invisible' : '')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={!selectedOption}
          className="matchee-gradient"
        >
          {isLastQuestion ? 'Finish' : 'Next'}
          {!isLastQuestion && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </Card>
  );
};

export default CompatibilityQuiz;
