import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ExerciseListComponent } from './features/exercises/exercise-list/exercise-list.component';
import { ExerciseFormComponent } from './features/exercises/exercise-form/exercise-form.component';
import { ExerciseDetailComponent } from './features/exercises/exercise-detail/exercise-detail.component';
import { PlanCreateComponent } from './features/plans/plan-create/plan-create.component';
import { PlanDetailComponent } from './features/plans/plan-detail/plan-detail.component';
import { SessionComponent } from './features/session/session.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exercises', component: ExerciseListComponent },
  { path: 'exercises/create', component: ExerciseFormComponent },
  { path: 'exercises/view/:id', component: ExerciseDetailComponent },
  { path: 'exercises/edit/:id', component: ExerciseFormComponent },
  { path: 'plans/create', component: PlanCreateComponent },
  { path: 'plans/:id', component: PlanDetailComponent },
  { path: 'session/:id', component: SessionComponent },

  { path: '**', redirectTo: '/dashboard' }
];
