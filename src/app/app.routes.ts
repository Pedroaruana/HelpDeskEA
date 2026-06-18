import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent) },
  { path: 'tickets', loadComponent: () => import('./components/ticket-list/ticket-list').then(m => m.TicketListComponent) },
  { path: 'kanban', loadComponent: () => import('./components/kanban/kanban').then(m => m.KanbanComponent) },
  { path: 'tickets/:id', loadComponent: () => import('./components/ticket-detail/ticket-detail').then(m => m.TicketDetailComponent) },
  { path: 'new-ticket', loadComponent: () => import('./components/new-ticket/new-ticket').then(m => m.NewTicketComponent) },
  { path: 'technicians', loadComponent: () => import('./components/technicians/technicians').then(m => m.TechniciansComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent) },
];
