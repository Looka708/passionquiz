export type Question = {
  id: number;
  text: string;
  type: 'mcq' | 'code';
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
};

export const quizzes: Quiz[] = [
  {
    id: 'c-basics-1',
    title: 'C Language Basics',
    description: 'Test your knowledge of fundamental C concepts.',
    difficulty: 'Easy',
    questions: [
      {
        id: 1,
        text: 'Which of the following is a keyword in C?',
        type: 'mcq',
        options: ['integer', 'float', 'return', 'function'],
        correctAnswer: 'return',
        explanation: "'return' is a keyword in C used to terminate a function and return a value. The others are data types or concepts, but not keywords themselves.",
      },
      {
        id: 2,
        text: 'What is the correct way to declare an integer variable named "score"?',
        type: 'mcq',
        options: ['int score;', 'integer score;', 'score int;', 'declare score as int;'],
        correctAnswer: 'int score;',
        explanation: 'In C, variables are declared with the syntax: `data_type variable_name;`. So, `int score;` is the correct way.',
      },
      {
        id: 3,
        text: 'What is the output of the following code?',
        type: 'code',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
        correctAnswer: 'Hello, World!',
        explanation: 'The `printf` function is used to print output to the console. This code will print the string "Hello, World!".',
      },
    ],
  },
  {
    id: 'c-pointers-1',
    title: 'Pointers in C',
    description: 'Dive into the world of pointers and memory management.',
    difficulty: 'Medium',
    questions: [
      {
        id: 1,
        text: 'Which operator is used to get the memory address of a variable?',
        type: 'mcq',
        options: ['*', '&', '->', '.'],
        correctAnswer: '&',
        explanation: 'The `&` (ampersand) operator is the "address-of" operator. It returns the memory address of a variable.',
      },
      {
        id: 2,
        text: 'What will be the output of this code?',
        type: 'code',
        codeSnippet: '#include <stdio.h>\n\nint main() {\n    int var = 10;\n    int *p;\n    p = &var;\n    printf("%d", *p);\n    return 0;\n}',
        correctAnswer: '10',
        explanation: 'The pointer `p` holds the address of `var`. The `*p` dereferences the pointer, giving the value stored at that address, which is 10.',
      },
       {
        id: 3,
        text: 'A pointer that is not assigned to any variable is called a...?',
        type: 'mcq',
        options: ['Null Pointer', 'Void Pointer', 'Wild Pointer', 'Dangling Pointer'],
        correctAnswer: 'Wild Pointer',
        explanation: 'A wild pointer is a pointer that has not been initialized. Attempting to use it can lead to unpredictable behavior.',
      },
    ],
  },
  {
    id: 'c-advanced-1',
    title: 'Advanced C Topics',
    description: 'Challenge yourself with advanced C programming questions.',
    difficulty: 'Hard',
    questions: [
      {
        id: 1,
        text: 'What is the purpose of the `volatile` keyword?',
        type: 'mcq',
        options: [
          'To prevent the compiler from optimizing the variable.',
          'To declare a variable that cannot be modified.',
          'To create a variable that is visible to all functions.',
          'To allocate memory from the heap.',
        ],
        correctAnswer: 'To prevent the compiler from optimizing the variable.',
        explanation: 'The `volatile` keyword tells the compiler that a variable\'s value may change at any time without any action being taken by the code the compiler finds nearby. This is important for variables used in interrupt service routines or shared between threads.',
      },
      {
        id: 2,
        text: 'What does the `realloc` function do if it fails to allocate memory?',
        type: 'code',
        codeSnippet: '#include <stdlib.h>\n\n// What does realloc return on failure?',
        correctAnswer: 'NULL',
        explanation: 'If `realloc` fails to resize the memory block, it returns a NULL pointer, and the original memory block is left unchanged.',
      },
    ],
  },
];

export const getQuizById = (id: string): Quiz | undefined => {
  return quizzes.find((quiz) => quiz.id === id);
};
