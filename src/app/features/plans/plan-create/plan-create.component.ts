import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { PlanService } from '../../../services/plan.service';
import { Exercise } from '../../../models/exercise.model';
import { Plan, PlanExercise } from '../../../models/plan.model';

interface ExerciseSelection {
  exercise: Exercise;
  selected: boolean;
  repetitions: number;
}

@Component({
  selector: 'app-plan-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-create.component.html',
  styleUrl: './plan-create.component.css'
})
export class PlanCreateComponent implements OnInit {
  exercises: ExerciseSelection[] = [];
  filteredExercises: ExerciseSelection[] = [];
  searchQuery: string = '';
  planType: 'instant' | 'scheduled' = 'instant';
  selectedDate: string = '';
  selectedTime: string = '';
  loading = false;
  errors: any = {};

  constructor(
    private exerciseService: ExerciseService,
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDateTime();
    this.loadExercises();
  }

  initializeDateTime(): void {
    const now = new Date();
    this.selectedDate = now.toISOString().split('T')[0];
    this.selectedTime = now.toTimeString().slice(0, 5);
  }

  loadExercises(): void {
    this.exerciseService.getExercises().subscribe({
      next: (data: Exercise[]) => {
        this.exercises = data.map(ex => ({
          exercise: ex,
          selected: false,
          repetitions: 5
        }));
        this.filteredExercises = [...this.exercises];
      },
      error: (err: any) => {
        console.error('Error loading exercises:', err);
      }
    });
  }

  filterExercises(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredExercises = [...this.exercises];
      return;
    }

    this.filteredExercises = this.exercises.filter(ex => 
      ex.exercise.name.toLowerCase().includes(query) ||
      (ex.exercise.description && ex.exercise.description.toLowerCase().includes(query)) ||
      (ex.exercise.why && ex.exercise.why.toLowerCase().includes(query))
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterExercises();
  }

  selectAllFiltered(): void {
    this.filteredExercises.forEach(ex => {
      ex.selected = true;
    });
  }

  deselectAll(): void {
    this.exercises.forEach(ex => {
      ex.selected = false;
    });
  }

  onPlanTypeChange(): void {
    if (this.planType === 'instant') {
      this.initializeDateTime();
    }
  }

  getSelectedExercises(): ExerciseSelection[] {
    return this.exercises.filter(ex => ex.selected);
  }

  getSelectedCount(): number {
    return this.getSelectedExercises().length;
  }

  hasMatchingExercises(): boolean {
    return this.filteredExercises.length > 0;
  }

  getTotalRepetitions(): number {
    return this.getSelectedExercises().reduce((sum, ex) => sum + ex.repetitions, 0);
  }

  validate(): boolean {
    this.errors = {};

    const selectedExercises = this.getSelectedExercises();
    if (selectedExercises.length === 0) {
      this.errors.exercises = 'Please select at least one exercise';
      return false;
    }

    if (this.planType === 'scheduled') {
      if (!this.selectedDate) {
        this.errors.date = 'Please select a date';
        return false;
      }
      if (!this.selectedTime) {
        this.errors.time = 'Please select a time';
        return false;
      }
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validate()) {
      return;
    }

    this.loading = true;

    const selectedExercises = this.getSelectedExercises();
    const planExercises: PlanExercise[] = selectedExercises.map(ex => ({
      exerciseId: ex.exercise.id as any, // Handle both string and number IDs
      repetitions: ex.repetitions
    }));

    const plan: Plan = {
      type: this.planType,
      date: this.selectedDate,
      time: this.selectedTime,
      status: 'pending',
      exercises: planExercises
    };

    this.planService.createPlan(plan).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Error creating plan:', err);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  addExercise(): void {
    this.router.navigate(['/exercises/create']);
  }
}
