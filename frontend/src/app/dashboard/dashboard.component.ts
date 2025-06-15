import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

interface ClassScheduleItem {
  day: string;
  time: string;
  className: string;
  gymName: string;
  startTime: string; // For sorting purposes
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-container">
      <div class="dashboard-content">
        <!-- Left side - Class Schedule -->
        <div class="class-schedule-panel">
          <h2>My Class Schedule</h2>
          <div *ngIf="isStudent && classSchedule.length === 0" class="no-classes">
            <p>No classes scheduled. Join some gyms to see your class schedule!</p>
          </div>
          <div *ngIf="isStudent && classSchedule.length > 0" class="class-list">
            <div *ngFor="let class of classSchedule" class="class-item">
              <div class="class-time">
                <span class="day">{{ class.day }}</span>
                <span class="time">{{ class.time }}</span>
              </div>
              <div class="class-details">
                <div class="class-name">{{ class.className }}</div>
                <div class="gym-name">{{ class.gymName }}</div>
              </div>
            </div>
          </div>
          <div *ngIf="!isStudent" class="gym-owner-message">
            <p>Class schedules are available for students only.</p>
          </div>
        </div>
        
        <!-- Right side - Dashboard content -->
        <div class="main-content">
          <h1>Dashboard</h1>
          <div *ngIf="isStudent" class="student-stats">
            <div class="stat-card">
              <h3>Joined Gyms</h3>
              <p class="stat-number">{{ joinedGymsCount }}</p>
            </div>
            <div class="stat-card">
              <h3>Weekly Classes</h3>
              <p class="stat-number">{{ classSchedule.length }}</p>
            </div>
          </div>
          <div *ngIf="!isStudent" class="gym-owner-stats">
            <p>Welcome to your gym management dashboard!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.dashboard-container {
      margin-top: 64px;
      padding: 20px;
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }
    .dashboard-content {
      display: flex;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .class-schedule-panel {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      height: fit-content;
    }
    .class-schedule-panel h2 {
      color: #2a2d34;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }
    .no-classes, .gym-owner-message {
      text-align: center;
      color: #666;
      padding: 40px 20px;
    }
    .class-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .class-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #007bff;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .class-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .class-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
      margin-right: 16px;
    }
    .day {
      font-size: 0.8rem;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
    }
    .time {
      font-size: 1.1rem;
      font-weight: 600;
      color: #007bff;
    }
    .class-details {
      flex: 1;
    }
    .class-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2a2d34;
      margin-bottom: 4px;
    }
    .gym-name {
      font-size: 0.9rem;
      color: #666;
    }
    .main-content {
      flex: 1;
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .main-content h1 {
      font-size: 2.5rem;
      color: #2a2d34;
      margin-bottom: 30px;
    }
    .student-stats, .gym-owner-stats {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .stat-card {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      min-width: 150px;
      text-align: center;
    }
    .stat-card h3 {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 8px;
      text-transform: uppercase;
      font-weight: 500;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #007bff;
      margin: 0;
    }
    `
  ]
})
export class DashboardComponent implements OnInit {
  isStudent = false;
  userId: number | null = null;
  classSchedule: ClassScheduleItem[] = [];
  joinedGymsCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.http.get<any>(`http://localhost:5086/api/users/me?username=${username}`).subscribe({
        next: (data) => {
          this.userId = data.id;
          this.isStudent = data.type === 'student';
          if (this.isStudent) {
            this.loadStudentClassSchedule();
          }
        },
        error: (err) => {
          console.error('Failed to load user info:', err);
        }
      });
    }
  }

  loadStudentClassSchedule() {
    if (this.userId === null) return;

    // Load all gyms to find which ones the student has joined
    this.http.get<any[]>(`http://localhost:5086/api/gyms`).subscribe({
      next: (gyms) => {
        const joinedGyms = gyms.filter(gym => 
          gym.students && gym.students.includes(this.userId)
        );
        
        this.joinedGymsCount = joinedGyms.length;
        this.extractClassSchedule(joinedGyms);
      },
      error: (err) => {
        console.error('Failed to load gyms:', err);
      }
    });
  }

  extractClassSchedule(gyms: any[]) {
    const classes: ClassScheduleItem[] = [];
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    gyms.forEach(gym => {
      try {
        const schedule = JSON.parse(gym.schedule);
        schedule.forEach((daySchedule: any) => {
          if (daySchedule.slots && Array.isArray(daySchedule.slots)) {
            daySchedule.slots.forEach((slot: any) => {
              if (slot.start && slot.end && slot.class) {
                classes.push({
                  day: daySchedule.day,
                  time: `${this.convertTo12Hour(slot.start)} - ${this.convertTo12Hour(slot.end)}`,
                  className: slot.class,
                  gymName: gym.name,
                  startTime: slot.start
                });
              }
            });
          }
        });
      } catch (error) {
        console.error('Error parsing schedule for gym:', gym.name, error);
      }
    });

    // Sort classes chronologically (by day, then by start time)
    this.classSchedule = classes.sort((a, b) => {
      const dayA = dayOrder.indexOf(a.day);
      const dayB = dayOrder.indexOf(b.day);
      
      if (dayA !== dayB) {
        return dayA - dayB;
      }
      
      // If same day, sort by start time
      return a.startTime.localeCompare(b.startTime);
    });
  }

  convertTo12Hour(time24: string): string {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    
    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  }
} 