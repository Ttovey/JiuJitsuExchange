import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WaiverModalComponent } from '../../components/waiver-modal/waiver-modal.component';
import { environment } from '../../../environments/environment';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, WaiverModalComponent],
  template: `
    <div class="gym-container">
      <h2>{{ isGymOwner ? 'My Gyms' : 'Available Gyms' }}</h2>
      <div *ngIf="message" class="message">{{ message }}</div>
      
      <!-- Gym Owner Interface -->
      <div *ngIf="isGymOwner">
        <div *ngIf="gyms.length === 0" class="no-gyms">
          <p>You don't have any gyms yet.</p>
        </div>
        <div *ngIf="gyms.length > 0" class="gym-list">
          <div *ngFor="let gym of gyms" class="gym-item">
            <div *ngIf="editingGym?.id !== gym.id" (click)="editGym(gym)">
              <h3>{{ gym.name }}</h3>
              <p><strong>Address:</strong> {{ gym.address }}</p>
              <p><strong>Description:</strong> {{ gym.description }}</p>
            </div>
            <div *ngIf="editingGym?.id === gym.id" class="edit-form">
              <h3>Edit Gym</h3>
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
                <div class="button-row">
                  <button type="submit" [disabled]="!gymForm.valid">Update Gym</button>
                </div>
                <div class="button-row">
                  <button type="button" (click)="confirmDelete()" class="delete-button">Delete Gym</button>
                </div>
                <div class="button-row">
                  <button (click)="cancelEdit()" class="cancel-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <button (click)="onShowCreateForm()" *ngIf="!showCreateForm" class="create-button">Create New Gym</button>
        <div *ngIf="showCreateForm" class="create-gym-form">
          <h3>Create Gym</h3>
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
          <button (click)="cancelEdit()" class="cancel-button">Cancel</button>
        </div>
      </div>
      
      <!-- Student Interface -->
      <div *ngIf="!isGymOwner">
        <div *ngIf="availableGyms.length === 0" class="no-gyms">
          <p>No gyms available to join.</p>
        </div>
        <div *ngIf="availableGyms.length > 0" class="gym-list">
          <div *ngFor="let gym of availableGyms" class="gym-item">
            <div *ngIf="selectedGym?.id !== gym.id" (click)="selectGym(gym)" class="gym-summary">
              <h3>{{ gym.name }}</h3>
              <p><strong>Address:</strong> {{ gym.address }}</p>
              <p><strong>Description:</strong> {{ gym.description }}</p>
              <button *ngIf="!isGymJoined(gym.id)" (click)="joinGym(gym); $event.stopPropagation()" class="join-button">Join Gym</button>
              <button *ngIf="isGymJoined(gym.id)" (click)="leaveGym(gym); $event.stopPropagation()" class="leave-button">Leave Gym</button>
            </div>
            <div *ngIf="selectedGym?.id === gym.id" class="gym-details">
              <div (click)="selectGym(gym)" class="gym-summary">
                <h3>{{ gym.name }}</h3>
                <p><strong>Address:</strong> {{ gym.address }}</p>
                <p><strong>Description:</strong> {{ gym.description }}</p>
                <button *ngIf="!isGymJoined(gym.id)" (click)="joinGym(gym); $event.stopPropagation()" class="join-button">Join Gym</button>
                <button *ngIf="isGymJoined(gym.id)" (click)="leaveGym(gym); $event.stopPropagation()" class="leave-button">Leave Gym</button>
              </div>
              <div class="schedule-display">
                <h4>Schedule</h4>
                <div *ngFor="let daySchedule of getScheduleForDisplay(gym.schedule)" class="day-schedule">
                  <div class="day-header">{{ daySchedule.day }}</div>
                  <div *ngIf="daySchedule.slots && daySchedule.slots.length > 0" class="slots-display">
                    <div *ngFor="let slot of daySchedule.slots" class="slot-display">
                      <span class="time-display" *ngIf="slot.start && slot.end">{{ slot.start }} - {{ slot.end }}</span>
                      <span class="class-display" *ngIf="slot.class">{{ slot.class }}</span>
                    </div>
                  </div>
                  <div *ngIf="!daySchedule.slots || daySchedule.slots.length === 0" class="no-classes">
                    No classes scheduled
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="showDeleteModal" class="modal">
        <div class="modal-content">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this gym?</p>
          <div class="button-row">
            <button (click)="deleteGym()" class="delete-button">Delete</button>
          </div>
          <div class="button-row">
            <button (click)="showDeleteModal = false" class="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
      
      <!-- Waiver Modal -->
      <app-waiver-modal
        [isVisible]="showWaiverModal"
        [gymId]="selectedGymForWaiver?.id || 0"
        [gymName]="selectedGymForWaiver?.name || ''"
        [userId]="ownerUserId || 0"
        [waiverText]="waiverText"
        (waiverSigned)="onWaiverSigned()"
        (modalClosed)="onWaiverModalClosed()">
      </app-waiver-modal>
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
    .gym-list { margin-top: 20px; }
    .gym-item { background: #fff; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); cursor: pointer; }
    .gym-summary { cursor: pointer; }
    .gym-details { cursor: default; }
    .schedule-display { margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; }
    .schedule-display h4 { color: #2a2d34; margin-bottom: 12px; }
    .day-schedule { margin-bottom: 16px; background: #f9f9f9; border-radius: 6px; padding: 12px; }
    .day-schedule .day-header { font-weight: 600; margin-bottom: 8px; color: #2a2d34; }
    .slots-display { display: flex; flex-direction: column; gap: 6px; }
    .slot-display { display: flex; gap: 12px; align-items: center; padding: 6px 0; }
    .time-display { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem; font-weight: 500; }
    .class-display { background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem; font-weight: 500; }
    .no-classes { color: #666; font-style: italic; }
    .no-gyms { text-align: center; margin-top: 20px; }
    .create-button { background: #007bff; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-size: 1rem; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
    .create-button:hover { background: #0056b3; }
    .join-button { background: #28a745; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 0.9rem; cursor: pointer; margin-top: 12px; transition: background 0.2s; }
    .join-button:hover { background: #218838; }
    .leave-button { background: #dc3545; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 0.9rem; cursor: pointer; margin-top: 12px; transition: background 0.2s; }
    .leave-button:hover { background: #c82333; }
    .cancel-button { background: #d32f2f; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-size: 1rem; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
    .cancel-button:hover { background: #a31515; }
    .edit-form { margin-top: 16px; }
    .button-row { margin-top: 8px; display: flex; justify-content: flex-start; gap: 8px; }
    .delete-button { background: #d32f2f; color: #fff; border: none; border-radius: 6px; padding: 10px 24px; font-size: 1rem; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
    .delete-button:hover { background: #a31515; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
    .modal-content { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    `
  ]
})
export class GymComponent implements OnInit {
  days = DAYS;
  gymForm: FormGroup;
  message = '';
  ownerUserId: number | null = null;
  gyms: any[] = [];
  showCreateForm = false;
  editingGym: any = null;
  showDeleteModal = false;
  isGymOwner = false;
  availableGyms: any[] = [];
  selectedGym: any = null;
  joinedGyms: Set<number> = new Set();
  showWaiverModal = false;
  selectedGymForWaiver: any = null;
  currentUsername = '';
  currentUserEmail = '';
  waiverText = `Release and Waiver of Liability and Indemnity Agreement (Read Carefully Before Signing)

In consideration of being permitted to participate in any way in the martial arts program indicated below and/or being permitted to enter for any purpose any restricted area (here in defined as any area where in admittance to the general public is prohibited), the parent(s) and/or legal guardian(s) of the minor participant named below agree:

1. The parent(s) and/or legal guardian(s) will instruct the minor participant that prior to participating in the below martial arts activity or event, he or she should inspect the facilities and equipment to be used, and if he or she believes anything is unsafe, the participant should immediately advise the officials of such condition and refuse to participate. I understand and agreed that, if at any time, I feel anything to be UNSAFE, I will immediately take all precautions to avoid the unsafe area and REFUSE TO PARTICIPATE further.

2. I/WE fully understand and acknowledge that: (a) There are risks and dangers associated with participation in martial arts events and activities which could result in bodily injury, partial and/or total disability, paralysis and death. (b) The social and economic losses and/or damages, which could result from these risks and dangers described above, could be severe. (c) These risks and dangers may be caused by the action, inaction or negligence of the participant or the action, inaction or negligence of others, including, but not limited to, the Releasees named below. (d) There may be other risks not known to us or are not reasonably foreseeable at his time.

3. I/WE accept and assume such risks and responsibility for the losses and/or damages following such injury, disability, paralysis or death, however caused and whether caused in whole or in part by the negligence of the Releasees named below.

4. I/WE HEREBY RELEASE, WAIVE, DISCHARGE AND COVENANT NOT TO SUE The Jiu-Jitsu Exchange LLC facility used by the participant, including its owners, managers, promoters, lessees of premises used to conduct the Jiu-Jitsu event or program, premises and event inspectors, underwriters, consultants and others who give recommendations, directions, or instructions to engage in risk evaluation or loss control activities regarding The Jiu-Jitsu Exchange LLC facility or events held at such facility and each of them, their directors, officers, agents, employees, all for the purposes herein referred to as "Releasee"...FROM ALL LIABILITY TO THE UNDERSIGNED, my/our personal representatives, assigns, executors, heirs and next to kin FOR ANY AND ALL CLAIMS, DEMANDS, LOSSES OR DAMAGES AND ANY CLAIMS OR DEMANDS THEREFORE ON ACCOUNT OF ANY INJURY, INCLUDING BUT NOT LIMITED TO THE DEATH OF THE PARTICIPANT OR DAMAGE TO PROPERTY, ARISING OUT OF OR RELATING TO THE EVENT(S) CAUSED OR ALLEGED TO BE CAUSED IN WHOLE OR IN PART BY THE NEGLIGENCE OF THE RELEASEE OR OTHERWISE.

5. I/WE HEREBY acknowledge that THE ACTIVITIES OF THE EVENT(S) ARE VERY DANGEROUS and involve the risk of serious injury and/or death and/or property damage. Each of THE UNDERSIGNED also expressly acknowledges that INJURIES RECEIVED MAY BE COMPOUNDED OR INCREASED BY NEGLIGENT RESCUE OPERATIONS OR PROCEDURES OF THE RELEASEES.

6. EACH OF THE UNDERSIGNED further expressly agrees that the foregoing release, waiver, and indemnity agreement is intended to be as broad and inclusive as is permitted by the law of the Province or State in which the event is conducted and that if any portion is held invalid, it is agreed that the balance shall, notwithstanding continue in full legal force and effect.

7. On behalf of the participant and individually, the undersigned partner(s) and/or legal guardian(s) for the minor participant executes this Waiver and Release. If, despite this release, the participant makes a claim against any of the Releasees, the parent(s) and/or legal guardian(s) will reimburse the Releasee for any money which they have paid to the participant, or on his behalf, and hold them harmless.

I HAVE READ THIS RELEASE AND WAIVER OF LIABILITY, ASSUMPTION OF RISK AND INDEMNITY AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND HAVE SIGNED IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT, ASSURANCE, OR GUARANTEE BEING MADE TO ME AND INTEND MY SIGNATURE TO BE COMPLETE AND UNCONDITIONAL RELEASE OF ALL LIABILITY TO THE GREATEST EXTENT ALLOWED BY LAW.`;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
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
      this.currentUsername = username;
      this.http.get<any>(`${environment.apiUrl}/api/users/me?username=${username}`).subscribe({
        next: (data) => {
          this.ownerUserId = data.id;
          this.currentUserEmail = data.email;
          this.isGymOwner = data.type === 'gym';
          if (this.isGymOwner) {
            this.loadGyms();
          } else {
            this.loadAvailableGyms();
          }
        }
      });
    }
  }

  loadGyms() {
    if (this.ownerUserId !== null) {
      this.http.get<any[]>(`${environment.apiUrl}/api/gyms?ownerUserId=${this.ownerUserId}`).subscribe({
        next: (data) => {
          this.gyms = data;
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to load gyms.';
        }
      });
    }
  }

  loadAvailableGyms() {
    this.http.get<any[]>(`${environment.apiUrl}/api/gyms`).subscribe({
      next: (data) => {
        this.availableGyms = data;
        // Check which gyms the user has already joined
        if (this.ownerUserId !== null) {
          this.availableGyms.forEach(gym => {
            if (gym.students && gym.students.includes(this.ownerUserId)) {
              this.joinedGyms.add(gym.id);
            }
          });
        }
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to load available gyms.';
      }
    });
  }

  joinGym(gym: any) {
    if (this.ownerUserId !== null) {
      // Check if waiver is already signed
      this.api.checkWaiverSigned(this.ownerUserId, gym.id).subscribe({
        next: (response) => {
          if (response.signed) {
            // Waiver already signed, proceed with joining
            this.proceedWithJoining(gym);
          } else {
            // Show waiver modal
            this.selectedGymForWaiver = gym;
            this.showWaiverModal = true;
          }
        },
        error: (err: any) => {
          console.error('Failed to check waiver status:', err);
          // If check fails, show waiver modal to be safe
          this.selectedGymForWaiver = gym;
          this.showWaiverModal = true;
        }
      });
    }
  }

  proceedWithJoining(gym: any) {
    if (this.ownerUserId !== null) {
      this.api.joinGym(gym.id, this.ownerUserId).subscribe({
        next: () => {
          this.message = `Joined ${gym.name} successfully!`;
          setTimeout(() => { this.message = ''; }, 3000);
          this.joinedGyms.add(gym.id);
        },
        error: (err: any) => {
          this.message = err.error?.message || 'Failed to join gym.';
        }
      });
    }
  }

  leaveGym(gym: any) {
    if (this.ownerUserId !== null) {
      this.api.leaveGym(gym.id, this.ownerUserId).subscribe({
        next: () => {
          this.message = `Left ${gym.name} successfully!`;
          setTimeout(() => { this.message = ''; }, 3000);
          this.joinedGyms.delete(gym.id);
        },
        error: (err: any) => {
          this.message = err.error?.message || 'Failed to leave gym.';
        }
      });
    }
  }

  selectGym(gym: any) {
    if (this.selectedGym?.id === gym.id) {
      this.selectedGym = null; // Close if clicking the same gym
    } else {
      this.selectedGym = gym;
    }
  }

  getScheduleForDisplay(scheduleJson: string) {
    try {
      return JSON.parse(scheduleJson);
    } catch {
      return [];
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

  toTimeString(val: string): string {
    if (!val) return '';
    // Handles "09:00:00" or "9:00" or "09:00" -> "09:00"
    const parts = val.split(':');
    if (parts.length >= 2) {
      return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
    }
    return val;
  }

  editGym(gym: any) {
    this.editingGym = gym;
    this.gymForm.patchValue({
      name: gym.name,
      address: gym.address,
      description: gym.description
    });
    const schedule = JSON.parse(gym.schedule);

    // Always clear all days' slots
    this.days.forEach((day, i) => {
      const slotsArray = this.getSlots(i);
      slotsArray.clear();
      const daySchedule = schedule.find((s: any) => s.day === day);
      if (daySchedule && Array.isArray(daySchedule.slots)) {
        daySchedule.slots.forEach((slot: any) => {
          slotsArray.push(this.fb.group({
            start: [this.toTimeString(slot.start)],
            end: [this.toTimeString(slot.end)],
            class: [slot.class]
          }));
        });
      }
    });
  }

  cancelEdit() {
    this.showCreateForm = false;
    this.editingGym = null;
    this.gymForm.reset();
  }

  confirmDelete() {
    this.showDeleteModal = true;
  }

  deleteGym() {
    if (this.editingGym && this.ownerUserId !== null) {
      this.api.deleteGym(this.editingGym.id, this.ownerUserId).subscribe({
        next: () => {
          this.message = 'Gym deleted successfully!';
          this.showDeleteModal = false;
          this.editingGym = null;
          this.loadGyms();
          setTimeout(() => { this.message = ''; }, 3000);
        },
        error: (err: any) => {
          this.message = err.error?.message || 'Failed to delete gym.';
        }
      });
    }
  }

  onSubmit() {
    if (this.gymForm.valid && this.ownerUserId !== null) {
      const { name, address, description, schedule } = this.gymForm.value;
      const structuredSchedule = this.days.map((day, i) => ({
        day,
        slots: schedule[i].filter((slot: any) => slot.start || slot.end || slot.class)
      }));
      if (this.editingGym) {
        this.api.updateGym(this.editingGym.id, { name, address, description, schedule: JSON.stringify(structuredSchedule), ownerUserId: this.ownerUserId }).subscribe({
          next: () => {
            this.message = 'Gym updated successfully!';
            this.gymForm.reset();
            this.editingGym = null;
            this.loadGyms();
            setTimeout(() => { this.message = ''; }, 3000);
          },
          error: (err) => {
            this.message = err.error?.message || 'Failed to update gym.';
          }
        });
      } else {
        this.api.createGym({ name, address, description, schedule: JSON.stringify(structuredSchedule), ownerUserId: this.ownerUserId }).subscribe({
          next: () => {
            this.message = 'Gym created successfully!';
            this.gymForm.reset();
            this.showCreateForm = false;
            this.loadGyms();
            setTimeout(() => { this.message = ''; }, 3000);
          },
          error: (err) => {
            this.message = err.error?.message || 'Failed to create gym.';
          }
        });
      }
    }
  }

  resetGymForm() {
    this.gymForm.reset({
      name: '',
      address: '',
      description: ''
    });
    const scheduleArray = this.gymForm.get('schedule') as FormArray;
    scheduleArray.clear();
    this.days.forEach(() => {
      scheduleArray.push(this.fb.array([]));
    });
  }

  onShowCreateForm() {
    this.resetGymForm();
    this.showCreateForm = true;
    this.editingGym = null;
  }

  isGymJoined(gymId: number): boolean {
    return this.joinedGyms.has(gymId);
  }

  onWaiverSigned() {
    if (this.selectedGymForWaiver) {
      this.proceedWithJoining(this.selectedGymForWaiver);
    }
  }

  onWaiverModalClosed() {
    this.showWaiverModal = false;
    this.selectedGymForWaiver = null;
  }
}
