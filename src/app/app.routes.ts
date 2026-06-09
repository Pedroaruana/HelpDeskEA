import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'tickets', loadComponent: () => import('./components/ticket-list/ticket-list').then(m => m.TicketListComponent) },
  { path: 'tickets/:id', loadComponent: () => import('./components/ticket-detail/ticket-detail').then(m => m.TicketDetailComponent) },
  { path: 'new-ticket', loadComponent: () => import('./components/new-ticket/new-ticket').then(m => m.NewTicketComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent) },
];
