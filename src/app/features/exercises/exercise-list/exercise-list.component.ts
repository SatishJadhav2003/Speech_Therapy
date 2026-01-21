import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../models/exercise.model';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.css'
})
export class ExerciseListComponent implements OnInit {
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  searchQuery: string = '';
  loading = true;
  deleteConfirm: string | number | null = null;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.loading = true;
    this.exerciseService.getExercises().subscribe({
      next: (data: Exercise[]) => {
        this.exercises = data;
        this.filteredExercises = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading exercises:', err);
        this.loading = false;
      }
    });
  }

  filterExercises(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredExercises = this.exercises;
      return;
    }
    
    this.filteredExercises = this.exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(query) ||
      (exercise.description && exercise.description.toLowerCase().includes(query)) ||
      (exercise.why && exercise.why.toLowerCase().includes(query))
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredExercises = this.exercises;
  }

  addExercise(): void {
    this.router.navigate(['/exercises/create']);
  }

  editExercise(id: string | number): void {
    this.router.navigate(['/exercises/edit', id]);
  }

  viewExercise(id: string | number): void {
    this.router.navigate(['/exercises/view', id]);
  }

  confirmDelete(id: string | number): void {
    this.deleteConfirm = id;
  }

  cancelDelete(): void {
    this.deleteConfirm = null;
  }

  deleteExercise(id: string | number): void {
    this.exerciseService.deleteExercise(id as any).subscribe({
      next: () => {
        this.exercises = this.exercises.filter(ex => ex.id !== id);
        this.filteredExercises = this.filteredExercises.filter(ex => ex.id !== id);
        this.deleteConfirm = null;
      },
      error: (err: any) => {
        console.error('Error deleting exercise:', err);
      }
    });
  }
}
