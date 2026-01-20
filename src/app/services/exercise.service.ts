import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private firestore = inject(Firestore);
  private collectionName = 'exercises';

  getExercises(): Observable<Exercise[]> {
    const colRef = collection(this.firestore, this.collectionName);
    return collectionData(colRef, { idField: 'id' }) as Observable<Exercise[]>;
  }

  getExercise(id: string): Observable<Exercise> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Exercise>;
  }

  createExercise(exercise: Exercise): Observable<string> {
    const colRef = collection(this.firestore, this.collectionName);
    // Remove id if present to let Firestore generate it, or use it if you want specific IDs
    const { id, ...data } = exercise as any;
    return from(addDoc(colRef, data).then(ref => ref.id));
  }

  updateExercise(id: string, exercise: Partial<Exercise>): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(docRef, { ...exercise }));
  }

  deleteExercise(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(docRef));
  }
}
