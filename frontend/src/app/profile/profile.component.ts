import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="profile-layout">
      <aside class="sidebar">
        <nav>
          <a routerLink="account" routerLinkActive="active">Profile</a>
          <a routerLink="gym" routerLinkActive="active">Gym</a>
          <a routerLink="students" routerLinkActive="active" *ngIf="isGymOwner">Students</a>
        </nav>
      </aside>
      <main class="profile-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `.profile-layout {
      display: flex;
      height: 100vh;
      margin-top: 64px;
    }
    .sidebar {
      width: 100;
      background:rgb(82, 84, 90);
      border-right: 1px solid #222;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 16px 0 0 0;
      position: relative;
    }
    .sidebar nav {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .sidebar a {
      padding: 12px 24px;
      color: #fff;
      text-decoration: none;
      font-size: 1.1rem;
      border-left: 4px solid transparent;
      transition: background 0.2s, border-color 0.2s;
    }
    .sidebar a.active, .sidebar a:hover {
      background: #3a3d44;
      border-left: 4px solid #b48a3c;
    }
    .profile-main {
      flex: 1;
      padding: 32px;
      background: #fff;
      min-width: 0;
      overflow-y: auto;
    }
    @media (max-width: 800px) {
      .profile-layout {
        flex-direction: column;
      }
      .sidebar {
        width: 100vw;
        border-right: none;
        border-bottom: 1px solid #222;
        flex-direction: row;
        align-items: center;
        padding: 0;
      }
      .sidebar nav {
        flex-direction: row;
        width: auto;
      }
      .sidebar a {
        padding: 12px 16px;
        font-size: 1rem;
        border-left: none;
        border-bottom: 4px solid transparent;
      }
      .sidebar a.active, .sidebar a:hover {
        background: #3a3d44;
        border-bottom: 4px solid #b48a3c;
      }
    }
    `
  ]
})
export class ProfileComponent implements OnInit {
  isGymOwner = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.http.get<any>(`http://localhost:5086/api/users/me?username=${username}`).subscribe({
        next: (data) => {
          this.isGymOwner = data.type === 'gym';
        },
        error: (err) => {
          console.error('Failed to fetch user data:', err);
        }
      });
    }
  }
} 