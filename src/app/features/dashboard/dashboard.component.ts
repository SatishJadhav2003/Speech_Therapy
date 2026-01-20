import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { ExerciseService } from '../../services/exercise.service';
import { Plan } from '../../models/plan.model';
import { Exercise } from '../../models/exercise.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentPlan: Plan | null = null;
  pendingPlans: Plan[] = [];
  upcomingPlans: Plan[] = [];
  exercises: Exercise[] = [];
  loading = true;

  constructor(
    private planService: PlanService,
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    combineLatest({
      plans: this.planService.getPlans(),
      exercises: this.exerciseService.getExercises()
    }).subscribe({
      next: (data) => {
        this.exercises = data.exercises;
        this.processPlans(data.plans);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }

  processPlans(plans: Plan[]): void {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    this.currentPlan = null;
    this.pendingPlans = [];
    this.upcomingPlans = [];

    plans.forEach(plan => {
      if (plan.status === 'completed') return;

      const planDate = new Date(`${plan.date}T${plan.time}`);
      
      if (plan.status === 'active') {
        this.currentPlan = plan;
      } else if (plan.date === todayStr || planDate <= now) {
        this.pendingPlans.push(plan);
      } else {
        this.upcomingPlans.push(plan);
      }
    });

    // Sort by date and time
    this.pendingPlans.sort((a, b) => 
      new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );
    this.upcomingPlans.sort((a, b) => 
      new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );
  }

  getExerciseCount(plan: Plan): number {
    return plan.exercises.length;
  }

  getTotalRepetitions(plan: Plan): number {
    return plan.exercises.reduce((sum, ex) => sum + ex.repetitions, 0);
  }

  startPlan(plan: Plan): void {
    if (plan.id) {
      this.router.navigate(['/session', plan.id]);
    }
  }

  viewPlan(plan: Plan): void {
    if (plan.id) {
      this.router.navigate(['/plans', plan.id]);
    }
  }

  createNewPlan(): void {
    this.router.navigate(['/plans/create']);
  }

  formatDateTime(date: string, time: string): string {
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
