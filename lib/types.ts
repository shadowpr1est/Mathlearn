export type Difficulty = "easy" | "medium" | "hard";

export type TopicId =
  | "basics"
  | "incomplete"
  | "discriminant"
  | "vieta"
  | "reduction"
  | "derivatives"
  | "integrals"
  | "limits";

export type RootType = "two" | "one" | "none";

export interface ProblemAnswer {
  type: RootType;
  x1?: number;
  x2?: number;
}

export interface Problem {
  id: string;
  topicId: TopicId;
  difficulty: Difficulty;
  equationLatex: string;
  a: number;
  b: number;
  c: number;
  answer: ProblemAnswer;
  method: "factoring" | "discriminant" | "vieta" | "incomplete";
}

export type AnswerMode = "two" | "one" | "none";

export interface UserAnswer {
  mode: AnswerMode;
  x1: string;
  x2: string;
}

export interface ValidationResult {
  correct: boolean;
  message: string;
}

export interface TaskProgress {
  attempts: number;
  correct: number;
  solved: boolean;
}

export interface Progress {
  tasks: Record<string, TaskProgress>;
  totalAttempts: number;
  totalCorrect: number;
}

export interface TheorySection {
  id: string;
  topicId: TopicId;
  title: string;
  content: TheoryBlock[];
}

export type TheoryBlock =
  | { type: "text"; text: string }
  | { type: "formula"; latex: string; display?: boolean }
  | { type: "list"; items: string[] };

export interface ExampleStep {
  text: string;
  latex?: string;
}

export interface Example {
  id: string;
  topicId: TopicId;
  title: string;
  equationLatex: string;
  method: string;
  steps: ExampleStep[];
  answerLatex: string;
}

export interface HintStep {
  text: string;
  latex?: string;
}
