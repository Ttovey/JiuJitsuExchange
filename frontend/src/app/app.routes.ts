import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { profileRoutes } from './profile/profile.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedComponent } from './feed/feed.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, children: profileRoutes },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'feed', component: FeedComponent }
];
