import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'tickets', canActivate: [authGuard], loadComponent: () => import('./components/ticket-list/ticket-list').then(m => m.TicketListComponent) },
  { path: 'tickets/:id', canActivate: [authGuard], loadComponent: () => import('./components/ticket-detail/ticket-detail').then(m => m.TicketDetailComponent) },
  { path: 'new-ticket', canActivate: [authGuard], loadComponent: () => import('./components/new-ticket/new-ticket').then(m => m.NewTicketComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent) },
];
