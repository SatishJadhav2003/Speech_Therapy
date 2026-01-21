import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../models/exercise.model';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-detail.component.html',
  styleUrl: './exercise-detail.component.css'
})
export class ExerciseDetailComponent implements OnInit {
  exercise: Exercise | null = null;
  loading = true;
  exerciseId: string | null = null;

  constructor(
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.exerciseId = id;
      this.loadExercise();
    }
  }

  loadExercise(): void {
    if (this.exerciseId) {
      this.loading = true;
      this.exerciseService.getExercise(this.exerciseId).subscribe({
        next: (data) => {
          this.exercise = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading exercise:', err);
          this.loading = false;
          this.router.navigate(['/exercises']);
        }
      });
    }
  }

  editExercise(): void {
    if (this.exerciseId) {
      this.router.navigate(['/exercises/edit', this.exerciseId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/exercises']);
  }
}
