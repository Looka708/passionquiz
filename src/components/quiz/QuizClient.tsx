"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, Question } from '@/lib/quizzes';
import { QuestionCard } from './QuestionCard';
import { ResultsCard } from './ResultsCard';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const QUESTION_TIME_LIMIT = 30; // 30 seconds per question

export function QuizClient({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleNextQuestion = useCallback((answer: string) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setUserAnswers((prev) => [...prev, answer]);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestionIndex, quiz.questions]);


  const handleTimeUp = useCallback(() => {
    handleNextQuestion(''); // Submit an empty answer when time is up
  }, [handleNextQuestion]);


  if (isFinished) {
    return <ResultsCard score={score} totalQuestions={quiz.questions.length} quizId={quiz.id} />;
  }
  
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold font-headline mb-2">{quiz.title}</h1>
      <p className="text-muted-foreground mb-6">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </p>

      <Progress value={progress} className="w-full mb-4 h-2 bg-muted" indicatorClassName="bg-accent"/>

      <Card>
        <CardContent className="p-6">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onQuestionSubmit={handleNextQuestion}
            onTimeUp={handleTimeUp}
            timeLimit={QUESTION_TIME_LIMIT}
          />
        </CardContent>
      </Card>
    </div>
  );
}
