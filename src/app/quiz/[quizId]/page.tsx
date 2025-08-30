import { getQuizById } from '@/lib/quizzes';
import { notFound } from 'next/navigation';
import { QuizClient } from '@/components/quiz/QuizClient';

type QuizPageProps = {
  params: {
    quizId: string;
  };
};

export default function QuizPage({ params }: QuizPageProps) {
  const quiz = getQuizById(params.quizId);

  if (!quiz) {
    notFound();
  }

  return <QuizClient quiz={quiz} />;
}
