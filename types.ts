
export interface Question {
  question: string;
  options: string[];
  number: number;
}

export interface QuizData {
  questions: Question[];
  answers: string[];
}

export interface FlashcardData {
  front: string;
  back: string;
}

export type Command = 'summary' | 'quiz' | 'flashcards';

export type OutputType = Command | 'suggestion' | 'error' | 'welcome';
