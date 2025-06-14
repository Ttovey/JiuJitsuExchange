import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="gym-container">
      <h2>Create Gym</h2>
      <form [formGroup]="gymForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <label>Gym Name</label>
          <input formControlName="name" required />
        </div>
        <div class="form-row">
          <label>Address</label>
          <input formControlName="address" required />
        </div>
        <div class="form-row">
          <label>Description</label>
          <textarea formControlName="description"></textarea>
        </div>
        <h3>Schedule</h3>
        <div class="schedule-section" *ngFor="let day of days; let i = index">
          <div class="day-header">{{ day }}</div>
          <div formArrayName="schedule">
            <div [formGroupName]="i">
              <div *ngFor="let slot of getSlots(i).controls; let j = index" [formGroupName]="j" class="slot-row">
                <input type="time" formControlName="start" />
                <input type="time" formControlName="end" />
                <input formControlName="class" placeholder="Class name" />
                <button type="button" (click)="removeSlot(i, j)">Remove</button>
              </div>
              <button type="button" (click)="addSlot(i)">Add Slot</button>
            </div>
          </div>
        </div>
        <button type="submit" [disabled]="!gymForm.valid">Create Gym</button>
      </form>
      <div *ngIf="message" class="message">{{ message }}</div>
    </div>
  `,
  styles: [
    `.gym-container { max-width: 700px; margin: 0 auto; background: #f8f8f8; padding: 32px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    h2, h3 { color: #2a2d34; }
    .form-row { display: flex; flex-direction: column; margin-bottom: 16px; }
    label { margin-bottom: 4px; color: #444; }
    input, textarea { padding: 8px; border-radius: 6px; border: 1px solid #bbb; font-size: 1rem; }
    textarea { min-height: 60px; }
    .schedule-section { margin-bottom: 24px; background: #f0f0f0; border-radius: 8px; padding: 12px; }
    .day-header { font-weight: 600; margin-bottom: 8px; color: #2a2d34; }
    .slot-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .slot-row input { width: 120px; }
    .slot-row input[formControlName='class'] { width: 180px; }
    .slot-row button { background: #d32f2f; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
    .slot-row button:hover { background: #a31515; }
    .schedule-section button[type='button'] { background: #007bff; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; margin-top: 4px; cursor: pointer; }
    .schedule-section button[type='button']:hover { background: #0056b3; }
    button[type='submit'] { background: #007bff; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-size: 1rem; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
    button[type='submit']:hover { background: #0056b3; }
    .message { margin-top: 16px; color: #007bff; }
    `
  ]
})
export class GymComponent implements OnInit {
  days = DAYS;
  gymForm: FormGroup;
  message = '';
  ownerUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.gymForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      schedule: this.fb.array(this.days.map(() => this.fb.array([])))
    });
  }

  ngOnInit() {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.http.get<any>(`http://localhost:5086/api/users/me?username=${username}`).subscribe({
        next: (data) => {
          this.ownerUserId = data.id;
        }
      });
    }
  }

  getSlots(dayIndex: number): FormArray {
    return (this.gymForm.get('schedule') as FormArray).at(dayIndex) as FormArray;
  }

  addSlot(dayIndex: number) {
    this.getSlots(dayIndex).push(this.fb.group({
      start: [''],
      end: [''],
      class: ['']
    }));
    this.cdr.detectChanges();
  }

  removeSlot(dayIndex: number, slotIndex: number) {
    this.getSlots(dayIndex).removeAt(slotIndex);
    this.cdr.detectChanges();
  }

  onSubmit() {
    console.log(this.ownerUserId);
    if (this.gymForm.valid && this.ownerUserId !== null) {
      const { name, address, description, schedule } = this.gymForm.value;
      const structuredSchedule = this.days.map((day, i) => ({
        day,
        slots: schedule[i]
      }));
      this.api.createGym({ name, address, description, schedule: JSON.stringify(structuredSchedule), ownerUserId: this.ownerUserId }).subscribe({
        next: () => {
          this.message = 'Gym created successfully!';
          this.gymForm.reset();
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to create gym.';
        }
      });
    }
  }
}
