import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="students-container"><h2>Students Page</h2></div>`,
  styles: [`.students-container { padding: 32px; } h2 { color: #2a2d34; }`]
})
export class StudentsComponent {} 