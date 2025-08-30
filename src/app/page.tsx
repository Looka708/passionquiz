import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline text-primary tracking-tight">
          Welcome to Passion Quiz
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Sharpen your C programming skills with our collection of quizzes. Choose your challenge and start coding!
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <CardHeader className="flex-row items-center gap-4">
               <div className="bg-accent p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  ></path>
                </svg>
              </div>
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription className="mt-1">{quiz.description}</CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button asChild className="w-full">
                <Link href={`/quiz/${quiz.id}`}>
                  Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
