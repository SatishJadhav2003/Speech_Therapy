import { Exercise } from './exercise.model';

export interface SessionExercise {
  exercise: Exercise;
  repetitions: number;
  completed: number;
  isComplete: boolean;
}

export interface SessionData {
  planId: number;
  exercises: SessionExercise[];
  currentExerciseIndex: number;
  startedAt: string;
}
