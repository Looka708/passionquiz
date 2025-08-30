import { getQuizById, type Quiz, type Question } from '@/lib/quizzes';
import { notFound } from 'next/navigation';
import { QuizClient } from '@/components/quiz/QuizClient';

type QuizPageProps = {
  params: {
    quizId: string;
  };
  searchParams: {
    questions?: string;
  };
};

// Function to shuffle an array and take a subset
const getShuffledQuestions = (questions: Question[], count: number): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


export default function QuizPage({ params, searchParams }: QuizPageProps) {
  const quizData = getQuizById(params.quizId);

  if (!quizData) {
    notFound();
  }

  const questionCount = searchParams.questions ? parseInt(searchParams.questions, 10) : quizData.questions.length;
  const selectedQuestions = getShuffledQuestions(quizData.questions, questionCount);

  const quiz: Quiz = {
    ...quizData,
    questions: selectedQuestions,
  };


  return <QuizClient quiz={quiz} />;
}
