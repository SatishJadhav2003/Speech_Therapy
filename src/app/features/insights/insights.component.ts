import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightsService, InsightsStats } from '../../services/insights.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './insights.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class InsightsComponent {
  private insightsService = inject(InsightsService);
  stats$ = this.insightsService.getStats();

  getMaxCount(activity: any[]): number {
    return Math.max(...activity.map(a => a.count));
  }

  isHovered = false;
}
