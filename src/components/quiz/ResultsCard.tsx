"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, RotateCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ResultsCardProps = {
  score: number;
  totalQuestions: number;
  quizId: string;
};

export function ResultsCard({ score, totalQuestions, quizId }: ResultsCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const data = [
    { name: 'Correct', value: score, fill: 'hsl(var(--primary))' },
    { name: 'Incorrect', value: totalQuestions - score, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">Here's how you did.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-5xl font-bold">
            <span className="text-primary">{score}</span> / {totalQuestions}
          </div>
          <p className="text-2xl text-muted-foreground">{percentage}%</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                <Bar dataKey="value" barSize={40} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild variant="outline" size="lg">
            <Link href={`/quiz/${quizId}`}>
              <RotateCw className="mr-2 h-4 w-4" /> Try Again
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
