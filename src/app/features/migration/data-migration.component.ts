import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, writeBatch, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-data-migration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Data Migration</h2>
      <button 
        (click)="migrate()" 
        [disabled]="migrating"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
        {{ migrating ? 'Migrating...' : 'Migrate Data to Firestore' }}
      </button>
      <div *ngIf="message" class="mt-4 p-2 bg-gray-100 rounded">
        {{ message }}
      </div>
    </div>
  `
})
export class DataMigrationComponent {
  private firestore = inject(Firestore);
  migrating = false;
  message = '';

  private dbData = {
  "exercises": [
    {
      "id": "1",
      "name": "Lip Stretch",
      "description": "Stretch lips outward as wide as possible",
      "why": "Improves articulation and lip muscle control"
    },
    {
      "id": "2",
      "name": "Tongue Up-Down",
      "description": "Move tongue up to roof of mouth, then down",
      "why": "Strengthens tongue muscles for better speech clarity"
    },
    {
      "id": "3",
      "name": "Say 'Ahhh'",
      "description": "Open mouth wide and say 'Ahhh' for 5 seconds",
      "why": "Improves vocal cord control and breath support"
    }
  ],
  "plans": [
    {
      "id": "1",
      "type": "instant",
      "date": "2026-01-20",
      "time": "10:30",
      "status": "completed",
      "exercises": [
        {
          "exerciseId": 1,
          "repetitions": 5
        },
        {
          "exerciseId": 2,
          "repetitions": 8
        }
      ],
      "completedAt": "2026-01-20T15:26:45.731Z"
    },
    {
      "id": "268",
      "type": "instant",
      "date": "2026-01-20",
      "time": "20:45",
      "status": "completed",
      "exercises": [
        {
          "exerciseId": 1,
          "repetitions": 5
        }
      ],
      "completedAt": "2026-01-20T15:20:58.269Z"
    },
    {
      "id": "6",
      "type": "instant",
      "date": "2026-01-20",
      "time": "20:56",
      "status": "completed",
      "exercises": [
        {
          "exerciseId": "1",
          "repetitions": 7
        }
      ],
      "completedAt": "2026-01-20T15:27:46.246Z"
    },
    {
      "id": "28",
      "type": "instant",
      "date": "2026-01-20",
      "time": "20:58",
      "status": "completed",
      "exercises": [
        {
          "exerciseId": "1",
          "repetitions": 5
        },
        {
          "exerciseId": "2",
          "repetitions": 5
        }
      ],
      "completedAt": "2026-01-20T15:28:50.398Z"
    },
    {
      "id": "75",
      "type": "instant",
      "date": "2026-01-20",
      "time": "20:59",
      "status": "completed",
      "exercises": [
        {
          "exerciseId": "3",
          "repetitions": 5
        }
      ],
      "completedAt": "2026-01-20T15:43:21.780Z"
    },
    {
      "id": "00",
      "type": "instant",
      "date": "2026-01-20",
      "time": "21:07",
      "status": "pending",
      "exercises": [
        {
          "exerciseId": "3",
          "repetitions": 5
        }
      ]
    }
  ]
};

  async migrate() {
    this.migrating = true;
    this.message = 'Starting migration...';
    
    try {
      const batch = writeBatch(this.firestore);

      // Exercises
      for (const ex of this.dbData.exercises) {
        const ref = doc(this.firestore, 'exercises', ex.id);
        batch.set(ref, ex);
      }

      // Plans
      for (const plan of this.dbData.plans) {
        const ref = doc(this.firestore, 'plans', plan.id);
        batch.set(ref, plan);
      }

      await batch.commit();
      this.message = 'Migration successful! Data uploaded to Firestore.';
    } catch (error) {
      console.error(error);
      this.message = 'Migration failed: ' + error;
    } finally {
      this.migrating = false;
    }
  }
}
