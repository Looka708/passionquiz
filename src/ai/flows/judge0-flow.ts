
'use server';
/**
 * @fileOverview A flow for compiling and running code using the Judge0 API.
 *
 * - runCode - A function that submits code to Judge0 and returns the result.
 * - RunCodeInput - The input type for the runCode function.
 * - RunCodeOutput - The return type for the runCode function.
 */

import { z } from 'zod';
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
  const JUDGE0_API_HOST = 'https://ce.judge0.com';

  const encodedBody = {
    ...input,
    source_code: Buffer.from(input.source_code).toString('base64'),
    stdin: input.stdin ? Buffer.from(input.stdin).toString('base64') : undefined,
  }

  // Step 1: Create a submission
  let submissionResponse;
  try {
    submissionResponse = await fetch(`${JUDGE0_API_HOST}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
      },
      body: JSON.stringify(encodedBody)
    });
  } catch (err) {
      console.error("Fetch failed:", err);
      throw new Error("Failed to connect to the compilation service.");
  }


  if (!submissionResponse.ok) {
      const errorBody = await submissionResponse.text();
      // Use a more generic error for the user
      if (submissionResponse.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again later.`);
      }
      throw new Error(`Failed to create submission: ${submissionResponse.statusText} - ${errorBody}`);
  }

  const submission = await submissionResponse.json() as { token: string };
  const { token } = submission;

  // Step 2: Poll for the result
  let result: RunCodeOutput;
  while (true) {
    let resultResponse;
    try {
        resultResponse = await fetch(`${JUDGE0_API_HOST}/submissions/${token}?base64_encoded=true`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
    } catch (err) {
        console.error("Fetch failed:", err);
        throw new Error("Failed to connect to the compilation service while polling for result.");
    }
    
     if (!resultResponse.ok) {
      const errorBody = await resultResponse.text();
      throw new Error(`Failed to get submission result: ${resultResponse.statusText} - ${errorBody}`);
    }

    result = await resultResponse.json() as RunCodeOutput;

    // Status IDs 1 (In Queue) and 2 (Processing) mean we need to keep polling
    if (result.status.id > 2) {
      break;
    }
    // Wait for a short period before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Decode the output fields
  const decodedResult: RunCodeOutput = {
    ...result,
    stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : null,
    stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : null,
    compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : null,
    message: result.message ? Buffer.from(result.message, 'base64').toString('utf-8') : null,
  };


  return decodedResult;
}
