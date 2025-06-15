import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="feed-container">
      <h1>Feed</h1>
    </div>
  `,
  styles: [
    `.feed-container {
      margin-top: 64px;
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 64px);
    }
    h1 {
      font-size: 3rem;
      color: #333;
      text-align: center;
    }
    `
  ]
})
export class FeedComponent {
} 