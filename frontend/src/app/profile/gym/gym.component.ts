import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="gym-container"><h2>Gym Page</h2></div>`,
  styles: [`.gym-container { padding: 32px; } h2 { color: #2a2d34; }`]
})
export class GymComponent {} 