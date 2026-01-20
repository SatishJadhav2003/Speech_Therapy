import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Plan } from '../models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private firestore = inject(Firestore);
  private collectionName = 'plans';

  getPlans(): Observable<Plan[]> {
    const colRef = collection(this.firestore, this.collectionName);
    return collectionData(colRef, { idField: 'id' }) as Observable<Plan[]>;
  }

  getPlan(id: string): Observable<Plan> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Plan>;
  }

  createPlan(plan: Plan): Observable<string> {
    const colRef = collection(this.firestore, this.collectionName);
    const { id, ...data } = plan as any;
    return from(addDoc(colRef, data).then(ref => ref.id));
  }

  updatePlan(id: string, plan: Partial<Plan>): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(updateDoc(docRef, { ...plan }));
  }

  deletePlan(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return from(deleteDoc(docRef));
  }

  completePlan(id: string): Observable<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    const completedAt = new Date().toISOString();
    return from(updateDoc(docRef, {
      status: 'completed',
      completedAt: completedAt
    }));
  }
}
