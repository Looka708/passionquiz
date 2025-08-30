'use server';
/**
 * @fileOverview A flow for compiling and running code using the Judge0 API.
 *
 * - runCode - A function that submits code to Judge0 and returns the result.
 * - RunCodeInput - The input type for the runCode function.
 * - RunCodeOutput - The return type for the runCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const RunCodeInputSchema = z.object({
  source_code: z.string().describe('The source code to be executed.'),
  language_id: z.number().describe('The ID of the programming language.'),
  stdin: z.string().optional().describe('Standard input for the program.'),
});
export type RunCodeInput = z.infer<typeof RunCodeInputSchema>;

const RunCodeOutputSchema = z.object({
  stdout: z.string().nullable(),
  stderr: z.string().nullable(),
  compile_output: z.string().nullable(),
  message: z.string().nullable(),
  time: z.string().nullable(),
  memory: z.number().nullable(),
  status: z.object({
    id: z.number(),
    description: z.string(),
  }),
});
export type RunCodeOutput = z.infer<typeof RunCodeOutputSchema>;


export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
  return runCodeFlow(input);
}


const runCodeFlow = ai.defineFlow(
  {
    name: 'runCodeFlow',
    inputSchema: RunCodeInputSchema,
    outputSchema: RunCodeOutputSchema,
  },
  async (input) => {
    const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
    const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

    if (!JUDGE0_API_KEY) {
      throw new Error('JUDGE0_API_KEY is not set in the environment variables.');
    }

    // Step 1: Create a submission
    const submissionResponse = await fetch(`https://${JUDGE0_API_HOST}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: {
        'x-rapidapi-host': JUDGE0_API_HOST,
        'x-rapidapi-key': JUDGE0_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!submissionResponse.ok) {
        const errorBody = await submissionResponse.text();
        throw new Error(`Failed to create submission: ${submissionResponse.statusText} - ${errorBody}`);
    }

    const submission = await submissionResponse.json() as { token: string };
    const { token } = submission;

    // Step 2: Poll for the result
    let result: RunCodeOutput;
    while (true) {
      const resultResponse = await fetch(`https://${JUDGE0_API_HOST}/submissions/${token}?base64_encoded=false`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': JUDGE0_API_HOST,
          'x-rapidapi-key': JUDGE0_API_KEY
        }
      });
      
       if (!resultResponse.ok) {
        throw new Error(`Failed to get submission result: ${resultResponse.statusText}`);
      }

      result = await resultResponse.json() as RunCodeOutput;

      // Status IDs 1 (In Queue) and 2 (Processing) mean we need to keep polling
      if (result.status.id > 2) {
        break;
      }
      // Wait for a short period before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return result;
  }
);
