"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz } from '@/lib/quizzes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';


export function QuizConfigDialog({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [numQuestions, setNumQuestions] = useState(10);
  const maxQuestions = quiz.questions.length;

  const handleStartQuiz = () => {
    router.push(`/quiz/${quiz.id}?questions=${numQuestions}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          Configure & Start <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure Quiz: {quiz.title}</DialogTitle>
          <DialogDescription>
            Choose the number of questions you want to answer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <Label htmlFor="num-questions" className="text-center">
              Number of Questions: <span className="font-bold text-primary">{numQuestions}</span>
            </Label>
            <Slider
              id="num-questions"
              min={5}
              max={maxQuestions}
              step={1}
              value={[numQuestions]}
              onValueChange={(value) => setNumQuestions(value[0])}
            />
             <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>{maxQuestions}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleStartQuiz} className="w-full">
            Start Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
