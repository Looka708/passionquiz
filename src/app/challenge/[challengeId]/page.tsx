import { getChallengeById } from '@/lib/quizzes';
import { notFound } from 'next/navigation';
import { CodeEditor } from '@/components/code/CodeEditor';

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
       <CodeEditor challenge={challenge} />
    </div>
  );
}
