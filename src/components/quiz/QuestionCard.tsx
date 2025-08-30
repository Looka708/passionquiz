"use client";

import { useState } from 'react';
import type { Question } from '@/lib/quizzes';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from './Timer';

type QuestionCardProps = {
  question: Question;
  onQuestionSubmit: (answer: string) => void;
  onTimeUp: () => void;
  timeLimit: number;
};

export function QuestionCard({ question, onQuestionSubmit, onTimeUp, timeLimit }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswer) {
      onQuestionSubmit(selectedAnswer);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-start">
        <p className="text-xl font-medium">{question.text}</p>
        <Timer key={question.id} duration={timeLimit} onTimeUp={onTimeUp} />
      </div>

      {question.codeSnippet && (
        <div className="bg-gray-800 text-white p-4 rounded-md my-4">
          <pre><code className="font-code text-sm">{question.codeSnippet}</code></pre>
        </div>
      )}

      {question.type === 'mcq' && question.options && (
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer} className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2 p-3 rounded-md border has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 transition-colors">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="text-base flex-1 cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {question.type === 'code' && (
        <div>
          <Label htmlFor="code-answer" className="mb-2 block">Your Answer:</Label>
          <Textarea
            id="code-answer"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            className="font-code"
            placeholder="Type your answer here..."
          />
        </div>
      )}

      <Button type="submit" disabled={!selectedAnswer} className="w-full">
        Submit Answer
      </Button>
    </form>
  );
}
