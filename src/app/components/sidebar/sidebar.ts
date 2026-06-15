import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TicketService } from '../../services/ticket.service';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatBadgeModule],
  template: `
    <aside class="sidebar" [class.open]="ui.sidebarOpen()">
      <div class="sidebar-logo">
        <mat-icon class="logo-icon">support_agent</mat-icon>
        <div class="logo-text">
          <span class="logo-title">HelpDesk</span>
          <span class="logo-sub">EA Solutions</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="ui.close()">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/tickets" routerLinkActive="active" class="nav-item" (click)="ui.close()">
          <mat-icon [matBadge]="openCount() || null" matBadgeColor="warn" matBadgeSize="small">
            confirmation_number
          </mat-icon>
          <span>Chamados</span>
        </a>
        <a routerLink="/kanban" routerLinkActive="active" class="nav-item" (click)="ui.close()">
          <mat-icon>view_kanban</mat-icon>
          <span>Kanban</span>
        </a>
        <a routerLink="/new-ticket" routerLinkActive="active" class="nav-item" (click)="ui.close()">
          <mat-icon>add_circle</mat-icon>
          <span>Novo Chamado</span>
        </a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-item" (click)="ui.close()">
          <mat-icon>account_circle</mat-icon>
          <span>Meu Perfil</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a routerLink="/profile" class="user-info" title="Ver meu perfil">
          <div class="avatar">PT</div>
          <div class="user-details">
            <span class="user-name">Pedro Técnico</span>
            <span class="user-role">Suporte T.I</span>
          </div>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100vh;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      border-right: 1px solid rgba(255,255,255,0.06);
      z-index: 200;
      transition: transform 0.3s ease;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        box-shadow: 4px 0 24px rgba(0,0,0,0.4);
      }
      .sidebar.open {
        transform: translateX(0);
      }
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #6366f1;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1;
    }

    .logo-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }

      &:hover {
        background: rgba(99, 102, 241, 0.12);
        color: #c7d2fe;
      }

      &.active {
        background: rgba(99, 102, 241, 0.2);
        color: #818cf8;
        box-shadow: inset 3px 0 0 #6366f1;
      }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      border-radius: 10px;
      padding: 4px;
      margin: -4px;
      transition: background 0.2s;
      &:hover { background: rgba(99,102,241,0.1); }
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }

    .user-role {
      font-size: 11px;
      color: #64748b;
    }
  `]
})
export class SidebarComponent {
  private svc = inject(TicketService);
  readonly ui = inject(UIService);
  openCount = computed(() => this.svc.stats().open);
}
