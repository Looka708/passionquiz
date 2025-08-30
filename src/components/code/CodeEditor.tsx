
"use client";

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { runCode, type RunCodeOutput } from '@/ai/flows/judge0-flow';
import type { CodeChallenge } from '@/lib/quizzes';
import { Play, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CodeEditor({ challenge }: { challenge: CodeChallenge }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState<RunCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await runCode({ source_code: code, language_id: 52 }); // 52 is the language ID for C (GCC 9.2.0)
      setOutput(result);
      
      if (result.status.id === 6) { // Compilation Error
         toast({
          title: "Compilation Error",
          description: "Please check the output section for details.",
          variant: "destructive",
        });
      } else if (result.status.id > 3) { // Other errors (Runtime, TLE, etc.)
         toast({
          title: "Execution Error",
          description: "Your code failed to run correctly. Please check your logic and fix your code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to run code. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOutputTitle = (statusId: number) => {
    if (statusId <= 2) return "Compiling...";
    if (statusId === 3) return "Output";
    if (statusId === 6) return "Compilation Error";
    return "Error";
  }

  const getOutputStyles = (statusId: number) => {
     if (statusId > 3) return "text-red-500";
     return "text-green-500";
  }


  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{challenge.title}</CardTitle>
          <CardDescription>{challenge.description}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="p-0">
           <Editor
            height="400px"
            language="c"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </CardContent>
        <CardFooter className="p-2 justify-end">
           <Button onClick={handleRunCode} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Run Code
          </Button>
        </CardFooter>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <CardTitle className={getOutputStyles(output.status.id)}>
              {getOutputTitle(output.status.id)}
            </CardTitle>
            <CardDescription>
              Status: {output.status.description} | Time: {output.time}s | Memory: {output.memory} KB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-white p-4 rounded-md font-code text-sm overflow-x-auto">
              <code>
                {output.compile_output || output.stdout || output.stderr || "No output."}
              </code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
