import { Routes } from '@angular/router';
import { ProfileAccountComponent } from './account/profile-account.component';
import { GymComponent } from './gym/gym.component';
import { StudentsComponent } from './students/students.component';

export const profileRoutes: Routes = [
  { path: 'account', component: ProfileAccountComponent },
  { path: 'gym', component: GymComponent },
  { path: 'students', component: StudentsComponent },
  { path: '', redirectTo: 'account', pathMatch: 'full' }
]; 