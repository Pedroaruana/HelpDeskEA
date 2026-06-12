import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopbarComponent } from './components/topbar/topbar';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget';
import { TicketService } from './services/ticket.service';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, TopbarComponent, MatIconModule, ChatWidgetComponent],
  template: `
    <div class="app-shell">
        <app-sidebar />
        <div class="content-wrap">
          <app-topbar />

        @if (criticalCount() > 0 && !dismissed()) {
          <div class="critical-banner">
            <div class="banner-left">
              <mat-icon>warning</mat-icon>
              <span>
                <strong>{{ criticalCount() }} chamado{{ criticalCount() > 1 ? 's' : '' }} crítico{{ criticalCount() > 1 ? 's' : '' }}</strong>
                em aberto aguardando atendimento
              </span>
            </div>
            <div class="banner-right">
              <a routerLink="/tickets" class="banner-link" (click)="dismissed.set(true)">Ver chamados</a>
              <button class="banner-close" (click)="dismissed.set(true)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        }

          <main class="main-content">
            <router-outlet />
          </main>
        </div>
      </div>
      <app-chat-widget />
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--bg-base);
      transition: background-color 0.25s ease;
    }
    .content-wrap {
      margin-left: 240px;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .critical-banner {
      background: linear-gradient(90deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06));
      border-bottom: 1px solid rgba(239,68,68,0.25);
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fca5a5;
      font-size: 13px;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #f87171;
        flex-shrink: 0;
      }

      strong { color: #f87171; }
    }

    .banner-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .banner-link {
      font-size: 12px;
      font-weight: 600;
      color: #f87171;
      text-decoration: none;
      padding: 4px 10px;
      border: 1px solid rgba(239,68,68,0.3);
      border-radius: 6px;
      transition: all 0.15s;
      &:hover { background: rgba(239,68,68,0.15); }
    }

    .banner-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 2px;
      transition: color 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { color: #94a3b8; }
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class App {
  private svc = inject(TicketService);
  readonly theme = inject(ThemeService);
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  dismissed = signal(false);

  criticalCount = computed(() =>
    this.svc.tickets().filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length
  );

  constructor() {
    this.http.get(`${environment.apiUrl.replace('/api', '')}/health`).subscribe();

    if (this.auth.isTokenValid()) {
      this.svc.loadAll();
    } else {
      this.auth.clearSession();
      this.auth.login('pedro@helpdeskea.com', '123456').subscribe({
        next: res => {
          this.auth.setSession(res.token, res.user);
          this.svc.loadAll();
        },
        error: () => this.svc.loadAll()
      });
    }
  }
}
