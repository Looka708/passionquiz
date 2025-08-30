import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold font-headline text-primary tracking-tight">
          Welcome to Passion Quiz
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Sharpen your C programming skills with our collection of quizzes. Choose your challenge and start coding!
        </p>
      </section>

      <div className="space-y-12">
        {difficulties.map((difficulty) => {
          const filteredQuizzes = quizzes.filter((quiz) => quiz.difficulty === difficulty);
          if (filteredQuizzes.length === 0) return null;

          return (
            <section key={difficulty}>
              <h2 className="text-3xl font-bold font-headline mb-6 border-l-4 border-primary pl-4">{difficulty}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{quiz.title}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                      <Button asChild className="w-full">
                        <Link href={`/quiz/${quiz.id}`}>
                          Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
