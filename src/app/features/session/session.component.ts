import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { ExerciseService } from '../../services/exercise.service';
import { Plan } from '../../models/plan.model';
import { SessionExercise } from '../../models/session.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent implements OnInit, OnDestroy {
  planId: string | null = null;
  plan: Plan | null = null;
  sessionExercises: SessionExercise[] = [];
  currentExerciseIndex = 0;
  sessionStarted = false;
  sessionCompleted = false;
  loading = true;
  
  // Timer feature
  timerEnabled = false;
  timerDuration = 15; // seconds
  timerRemaining = 15;
  timerActive = false;
  timerInterval: any = null;
  
  // Voice feature
  speechSynthesis: SpeechSynthesis | null = null;
  voiceEnabled = true; // Can be toggled by user

  constructor(
    private planService: PlanService,
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize speech synthesis if available
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planId = id;
      this.loadSession();
    }
  }

  loadSession(): void {
    if (!this.planId) return;

    combineLatest({
      plan: this.planService.getPlan(this.planId),
      exercises: this.exerciseService.getExercises()
    }).subscribe({
      next: (data) => {
        this.plan = data.plan;
        
        // Build session exercises
        this.sessionExercises = this.plan!.exercises.map(pe => {
          // Handle both string and number IDs by converting to string for comparison
          const exercise = data.exercises.find(ex => 
            String(ex.id) === String(pe.exerciseId)
          );
          
          if (!exercise) {
            console.error('Exercise not found for ID:', pe.exerciseId);
          }
          
          return {
            exercise: exercise!,
            repetitions: pe.repetitions,
            completed: 0,
            isComplete: false
          };
        });

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading session:', err);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  startSession(): void {
    this.sessionStarted = true;
    if (this.plan && this.planId) {
      // Update plan status to active
      this.planService.updatePlan(this.planId, {
        ...this.plan,
        status: 'active'
      }).subscribe();
    }
  }

  get currentExercise(): SessionExercise | null {
    return this.sessionExercises[this.currentExerciseIndex] || null;
  }

  toggleTimer(): void {
    if (!this.timerEnabled) {
      // Timer was just disabled
      this.stopTimer();
    }
    // Timer enabled state is already updated by ngModel
  }

  startTimer(): void {
    if (!this.timerEnabled || this.timerActive) return;
    
    this.timerActive = true;
    this.timerRemaining = this.timerDuration;
    
    // Speak the starting number
    this.speak(this.timerRemaining.toString());
    
    this.timerInterval = setInterval(() => {
      this.timerRemaining--;
      
      // Speak the countdown number
      if (this.timerRemaining > 0) {
        this.speak(this.timerRemaining.toString());
      } else if (this.timerRemaining === 0) {
        // Speak "Release" when timer finishes
        this.speak('Release');
        
        // Wait a moment for "Release" to be spoken before stopping timer
        setTimeout(() => {
          this.stopTimer();
          // Increment counter after timer completes
          const current = this.currentExercise;
          if (current && current.completed < current.repetitions) {
            current.completed++;
            
            if (current.completed >= current.repetitions) {
              current.isComplete = true;
              
              // Auto-advance after a short delay
              setTimeout(() => {
                this.nextExercise();
              }, 800);
            }
          }
        }, 500); // Give time for "Release" to be spoken
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerActive = false;
    this.timerRemaining = this.timerDuration;
    
    // Cancel any ongoing speech
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  speak(text: string): void {
    if (!this.voiceEnabled || !this.speechSynthesis) return;
    
    // Cancel any ongoing speech first
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Optional: Select a specific voice (you can customize this)
    const voices = this.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Try to find a female English voice
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') ||
         voice.name.includes('Samantha') ||
         voice.name.includes('Zira') ||
         voice.name.includes('Victoria'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        // Fallback to any English voice
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
    }
    
    this.speechSynthesis.speak(utterance);
  }

  toggleVoice(): void {
    this.voiceEnabled = !this.voiceEnabled;
    
    // Cancel any ongoing speech when voice is disabled
    if (!this.voiceEnabled && this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  incrementCounter(): void {
    const current = this.currentExercise;
    if (!current) return;

    if (this.timerEnabled) {
      // If timer is enabled, start the timer (don't increment yet)
      if (!this.timerActive) {
        this.startTimer();
      }
    } else {
      // Direct tap counting (original behavior)
      if (current.completed < current.repetitions) {
        current.completed++;
        
        if (current.completed >= current.repetitions) {
          current.isComplete = true;
          
          // Auto-advance after a short delay
          setTimeout(() => {
            this.nextExercise();
          }, 800);
        }
      }
    }
  }

  nextExercise(): void {
    this.stopTimer(); // Stop timer when moving to next exercise
    if (this.currentExerciseIndex < this.sessionExercises.length - 1) {
      this.currentExerciseIndex++;
    } else {
      this.completeSession();
    }
  }

  previousExercise(): void {
    this.stopTimer(); // Stop timer when moving to previous exercise
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }

  completeSession(): void {
    if (this.planId) {
      this.planService.completePlan(this.planId).subscribe({
        next: () => {
          this.sessionCompleted = true;
        },
        error: (err) => {
          console.error('Error completing session:', err);
        }
      });
    }
  }

  exitSession(): void {
    this.stopTimer(); // Clean up timer on exit
    this.router.navigate(['/dashboard']);
  }

  getProgress(): number {
    if (this.sessionExercises.length === 0) return 0;
    const completedExercises = this.sessionExercises.filter(ex => ex.isComplete).length;
    return (completedExercises / this.sessionExercises.length) * 100;
  }

  getProgressRounded(): number {
    return Math.round(this.getProgress());
  }

  getTotalRepetitions(): number {
    return this.sessionExercises.reduce((sum, ex) => sum + ex.repetitions, 0);
  }

  ngOnDestroy(): void {
    this.stopTimer(); // Clean up on component destroy
    
    // Cancel any ongoing speech
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }
}
