import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from '../../../services/plan.service';
import { ExerciseService } from '../../../services/exercise.service';
import { Plan } from '../../../models/plan.model';
import { Exercise } from '../../../models/exercise.model';
import { combineLatest } from 'rxjs';

interface PlanExerciseDetail {
  exercise: Exercise;
  repetitions: number;
}

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css'
})
export class PlanDetailComponent implements OnInit {
  plan: Plan | null = null;
  planExercises: PlanExerciseDetail[] = [];
  loading = true;
  planId: string | null = null;

  constructor(
    private planService: PlanService,
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planId = id;
      this.loadPlan();
    }
  }

  loadPlan(): void {
    if (!this.planId) return;

    combineLatest({
      plan: this.planService.getPlan(this.planId),
      exercises: this.exerciseService.getExercises()
    }).subscribe({
      next: (data) => {
        this.plan = data.plan;
        
        // Map plan exercises with full exercise details
        this.planExercises = this.plan!.exercises.map(pe => {
          // Handle both string and number IDs by converting to string for comparison
          const exercise = data.exercises.find(ex => 
            String(ex.id) === String(pe.exerciseId)
          );
          
          if (!exercise) {
            console.error('Exercise not found for ID:', pe.exerciseId);
          }
          
          return {
            exercise: exercise!,
            repetitions: pe.repetitions
          };
        });

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading plan:', err);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  startPlan(): void {
    if (this.planId) {
      this.router.navigate(['/session', this.planId]);
    }
  }

  deletePlan(): void {
    if (this.planId && confirm('Are you sure you want to delete this plan?')) {
      this.planService.deletePlan(this.planId).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error deleting plan:', err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatDateTime(date: string, time: string): string {
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getTotalRepetitions(): number {
    return this.planExercises.reduce((sum, pe) => sum + pe.repetitions, 0);
  }

  formatCompletedDate(completedAt: string): string {
    return new Date(completedAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
