import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../models/exercise.model';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.css'
})
export class ExerciseFormComponent implements OnInit {
  exercise: Exercise = {
    name: '',
    description: '',
    why: ''
  };
  isEditMode = false;
  exerciseId: number | null = null;
  loading = false;
  errors: any = {};

  constructor(
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.exerciseId = parseInt(id);
      this.loadExercise();
    }
  }

  loadExercise(): void {
    if (this.exerciseId) {
      this.exerciseService.getExercise(String(this.exerciseId)).subscribe({
        next: (data) => {
          this.exercise = data;
        },
        error: (err: any) => {
          console.error('Error loading exercise:', err);
          this.router.navigate(['/exercises']);
        }
      });
    }
  }

  validate(): boolean {
    this.errors = {};
    
    if (!this.exercise.name || this.exercise.name.trim() === '') {
      this.errors.name = 'Exercise name is required';
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validate()) {
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.exerciseId) {
      this.exerciseService.updateExercise(String(this.exerciseId), this.exercise).subscribe({
        next: () => {
          this.router.navigate(['/exercises']);
        },
        error: (err: any) => {
          console.error('Error saving exercise:', err);
          this.loading = false;
        }
      });
    } else {
      this.exerciseService.createExercise(this.exercise).subscribe({
        next: () => {
          this.router.navigate(['/exercises']);
        },
        error: (err: any) => {
          console.error('Error saving exercise:', err);
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/exercises']);
  }
}
