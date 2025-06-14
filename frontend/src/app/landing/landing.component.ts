import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="landing-container"></div>
  `,
  styles: [
    `.landing-container {
      height: 100vh;
      width: 100vw;
      background: #222; /* fallback color */
      background-image: url('/assets/exchange.png');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain; /* maintain aspect ratio, no distortion */
      position: relative;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    body, html {
      margin: 0;
      padding: 0;
    }
    `
  ]
})
export class LandingComponent implements OnInit {
  ngOnInit() {}
} 