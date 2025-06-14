import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <img src="assets/logo.png" alt="Logo" class="navbar-logo" />
        <a routerLink="/" class="navbar-title navbar-link">Exchange App</a>
      </div>
      <div class="navbar-right">
        <ng-container *ngIf="currentUser; else loginBlock">
          <span class="navbar-welcome">Welcome, {{ currentUser }}!</span>
          <button class="hamburger" (click)="toggleMenu()" aria-label="Menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
          <div class="dropdown-menu" *ngIf="menuOpen">
            <a (click)="goToProfile()">Profile</a>
            <a (click)="logout()">Logout</a>
          </div>
        </ng-container>
        <ng-template #loginBlock>
          <a routerLink="/login" class="login-link">Login</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [
    `.navbar {
      width: 100vw;
      height: 64px;
      background: url('/assets/wood.jpg') repeat center center;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .navbar-left {
      display: flex;
      align-items: center;
    }
    .navbar-logo {
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }
    .navbar-title {
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-decoration: none;
      color:rgb(17, 17, 18);
      cursor: pointer;
    }
    .navbar-link:hover {
      text-decoration: underline;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
    }
    .navbar-welcome {
      font-size: 1.1rem;
      margin-right: 12px;
      color:rgb(17, 17, 18);
    }
    .login-link {
      color: #fff;
      background:rgb(17, 17, 18);
      padding: 8px 20px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }
    .login-link:hover {
      background: #0056b3;
    }
    .hamburger {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      padding: 0;
      margin-left: 8px;
    }
    .bar {
      width: 24px;
      height: 3px;
      background: #111;
      margin: 3px 0;
      border-radius: 2px;
      display: block;
    }
    .dropdown-menu {
      position: absolute;
      top: 48px;
      right: 0;
      background: rgb(82, 84, 90);
      color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      min-width: 120px;
      display: flex;
      flex-direction: column;
      z-index: 2000;
    }
    .dropdown-menu a {
      padding: 12px 20px;
      text-decoration: none;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      transition: background 0.2s;
    }
    .dropdown-menu a:last-child {
      border-bottom: none;
    }
    .dropdown-menu a:hover {
      background: #3a3d44;
    }
    @media (max-width: 600px) {
      .navbar {
        padding: 0 8px;
      }
      .navbar-title {
        font-size: 1.1rem;
        color:rgb(17, 17, 18);
      }
      .navbar-logo {
        width: 32px;
        height: 32px;
      }
    }
    `
  ]
})
export class NavbarComponent {
  currentUser: string | null = null;
  menuOpen = false;

  constructor(private router: Router) {
    this.currentUser = localStorage.getItem('currentUser');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-right')) {
      this.menuOpen = false;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
    window.location.reload();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.menuOpen = false;
  }
}
