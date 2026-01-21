import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PlanService } from './plan.service';
import { Plan } from '../models/plan.model';

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
  dayLabel: string; // e.g., 'Mon'
}

export interface InsightsStats {
  totalSessions: number;
  totalExercises: number;
  currentStreak: number;
  dailyActivity: DailyActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class InsightsService {
  private planService = inject(PlanService);

  getStats(): Observable<InsightsStats> {
    return this.planService.getPlans().pipe(
      map(plans => this.calculateStats(plans))
    );
  }

  private calculateStats(plans: Plan[]): InsightsStats {
    const completedPlans = plans.filter(p => p.status === 'completed');

    // 1. Total Sessions
    const totalSessions = completedPlans.length;

    // 2. Total Exercises
    const totalExercises = completedPlans.reduce((sum, plan) => {
      // Assuming plan.exercises is array of { exerciseId, repetitions }
      // If we just want count of exercises: plan.exercises.length
      // If we want total repetitions: plan.exercises.reduce((s, e) => s + e.repetitions, 0)
      // Let's go with total repetitions for a "Practice Count" metric, or just number of exercises completed?
      // User asked for "practice count & session count". "Practice count" likely means total repetitions done.
      const planReps = plan.exercises?.reduce((s, e) => s + (e.repetitions || 0), 0) || 0;
      return sum + planReps;
    }, 0);

    // 3. Daily Activity (Last 7 days)
    const dailyActivity = this.getLast7DaysActivity(completedPlans);

    // 4. Current Streak
    const currentStreak = this.calculateStreak(completedPlans);

    return {
      totalSessions,
      totalExercises,
      currentStreak,
      dailyActivity
    };
  }

  private getLast7DaysActivity(plans: Plan[]): DailyActivity[] {
    const activity: DailyActivity[] = [];
    const today = new Date(); // Local now
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const targetDateStr = this.toLocalISODate(d);

      const count = plans.filter(p => this.toLocalISODate(p.completedAt) === targetDateStr).length;

      activity.push({ date: targetDateStr, count, dayLabel });
    }
    return activity;
  }

  private calculateStreak(plans: Plan[]): number {
    const activeDates = new Set(
      plans
        .filter(p => p.completedAt)
        .map(p => this.toLocalISODate(p.completedAt))
    );

    if (activeDates.size === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentCheck = new Date(today);
    
    // Check if streak is alive (today or yesterday has activity)
    const todayStr = this.toLocalISODate(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.toLocalISODate(yesterday);

    if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
      return 0;
    }

    // Determine start point (today if active, else yesterday)
    // Actually, if active today, we count backwards from today.
    // If not active today but active yesterday, count backwards from yesterday.
    if (!activeDates.has(todayStr)) {
      currentCheck = yesterday;
    }

    // Count backwards
    while (true) {
      const dateStr = this.toLocalISODate(currentCheck);
      if (activeDates.has(dateStr)) {
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Helper to get YYYY-MM-DD in local time
  private toLocalISODate(dateVal: string | Date | undefined): string {
    if (!dateVal) return '';
    const date = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
    
    // Safety check for invalid dates
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
