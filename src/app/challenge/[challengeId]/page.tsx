import { getChallengeById } from '@/lib/quizzes';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type ChallengePageProps = {
  params: {
    challengeId: string;
  };
};

export default function ChallengePage({ params }: ChallengePageProps) {
  const challenge = getChallengeById(params.challengeId);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{challenge.title}</CardTitle>
          <CardDescription>{challenge.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Challenge page for: {challenge.title}</p>
          <p className="mt-4 text-muted-foreground">Compiler and code editor coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
