export interface PlanExercise {
  exerciseId: number;
  repetitions: number;
}

export interface Plan {
  id?: number;
  type: 'instant' | 'scheduled';
  date: string;
  time: string;
  status: 'pending' | 'active' | 'completed';
  exercises: PlanExercise[];
  completedAt?: string;
}
