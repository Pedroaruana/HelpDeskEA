import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { PriorityLabelPipe, StatusLabelPipe } from '../../pipes/ticket-labels.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule, MatRippleModule, PriorityLabelPipe, StatusLabelPipe],
  template: `
    <div class="page">
      <header class="page-header">
        <h1>Meu Perfil</h1>
        <p class="subtitle">Estatísticas e atividade recente</p>
      </header>

      <div class="profile-layout">
        <div class="left-col">
          <div class="card identity-card">
            <div class="avatar-wrap">
              <div class="avatar">PT</div>
              <div class="online-dot"></div>
            </div>
            <h2>Pedro Técnico</h2>
            <span class="role-badge">
              <mat-icon>support_agent</mat-icon>
              Suporte T.I
            </span>
            <div class="divider"></div>
            <div class="meta-list">
              <div class="meta-item">
                <mat-icon>business</mat-icon>
                <span>EA Solutions</span>
              </div>
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>Desde maio de 2025</span>
              </div>
            </div>
          </div>

          <div class="card stats-card">
            <h3>Resumo</h3>
            <div class="stat-row">
              <span class="stat-label">Chamados atribuídos</span>
              <span class="stat-val">{{ assigned().length }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Resolvidos / Fechados</span>
              <span class="stat-val resolved">{{ resolvedCount() }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Em andamento</span>
              <span class="stat-val progress">{{ inProgressCount() }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Taxa de resolução</span>
              <span class="stat-val">{{ resolutionRate() }}%</span>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="card activity-card">
            <div class="card-header">
              <h3>Chamados Atribuídos</h3>
              <a routerLink="/tickets" class="link-all">Ver todos</a>
            </div>

            @if (assigned().length) {
              <div class="ticket-list">
                @for (t of assigned(); track t.id) {
                  <a [routerLink]="['/tickets', t.id]" class="ticket-row" matRipple>
                    <span class="ticket-id">{{ t.id }}</span>
                    <div class="ticket-info">
                      <span class="ticket-title">{{ t.title }}</span>
                      <span class="ticket-meta">{{ t.requester }} · {{ t.createdAt | date:'dd/MM HH:mm' }}</span>
                    </div>
                    <div class="badges">
                      <span class="badge priority-{{ t.priority }}">{{ t.priority | priorityLabel }}</span>
                      <span class="badge status-{{ t.status }}">{{ t.status | statusLabel }}</span>
                    </div>
                  </a>
                }
              </div>
            } @else {
              <div class="empty">
                <mat-icon>inbox</mat-icon>
                <p>Nenhum chamado atribuído</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }

    .page-header {
      margin-bottom: 28px;
      h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
      .subtitle { color: var(--text-subtle); margin: 4px 0 0; font-size: 14px; }
    }

    .profile-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 20px;
      align-items: start;
    }

    .left-col, .right-col { display: flex; flex-direction: column; gap: 16px; }

    .card {
      background: var(--bg-card);
      border-radius: 14px;
      border: 1px solid var(--border);
      padding: 24px;
      transition: background-color 0.25s ease;
    }

    /* Identity */
    .identity-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
    }

    .avatar-wrap {
      position: relative;
      display: inline-block;
    }

    .avatar {
      width: 72px; height: 72px; border-radius: 18px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; color: white;
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }

    .online-dot {
      position: absolute; bottom: 3px; right: 3px;
      width: 14px; height: 14px; border-radius: 50%;
      background: #4ade80;
      border: 2px solid var(--bg-card);
    }

    h2 { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; }

    .role-badge {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #818cf8; font-weight: 500;
      background: rgba(99,102,241,0.12); padding: 5px 12px;
      border-radius: 99px;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }

    .divider { width: 100%; height: 1px; background: var(--border); }

    .meta-list { width: 100%; display: flex; flex-direction: column; gap: 10px; }
    .meta-item {
      display: flex; align-items: center; gap: 10px;
      font-size: 13px; color: var(--text-muted);
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--text-faint); }
    }

    /* Stats */
    .stats-card h3 {
      font-size: 13px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.05em;
      margin: 0 0 16px;
    }

    .stat-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      &:last-child { border-bottom: none; }
    }

    .stat-label { font-size: 13px; color: var(--text-muted); }
    .stat-val { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .stat-val.resolved { color: #4ade80; }
    .stat-val.progress { color: #60a5fa; }

    /* Activity */
    .activity-card { padding: 0; overflow: hidden; }

    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 20px 12px;
      h3 { font-size: 16px; font-weight: 600; color: var(--text-secondary); margin: 0; }
      .link-all { font-size: 13px; color: #6366f1; text-decoration: none;
        &:hover { color: #818cf8; }
      }
    }

    .ticket-list { display: flex; flex-direction: column; }

    .ticket-row {
      display: flex; align-items: center; gap: 12px;
      padding: 13px 20px;
      border-top: 1px solid var(--border);
      text-decoration: none;
      transition: background 0.15s;
      &:hover { background: var(--hover-card); }
    }

    .ticket-id {
      font-size: 11px; font-weight: 700; color: #6366f1;
      background: rgba(99,102,241,0.12); padding: 3px 7px;
      border-radius: 6px; white-space: nowrap; flex-shrink: 0;
    }

    .ticket-info { flex: 1; min-width: 0; }
    .ticket-title { font-size: 13px; color: var(--text-secondary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ticket-meta { font-size: 11px; color: var(--text-faint); margin-top: 2px; display: block; }

    .badges { display: flex; gap: 6px; flex-shrink: 0; }

    .badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
    .priority-critical { background: rgba(239,68,68,0.15); color: #f87171; }
    .priority-high { background: rgba(251,146,60,0.15); color: #fb923c; }
    .priority-medium { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .priority-low { background: rgba(100,116,139,0.15); color: #94a3b8; }
    .status-open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-in-progress { background: rgba(59,130,246,0.12); color: #60a5fa; }
    .status-resolved { background: rgba(34,197,94,0.12); color: #4ade80; }
    .status-closed { background: rgba(100,116,139,0.12); color: #94a3b8; }

    .empty {
      display: flex; flex-direction: column; align-items: center; padding: 40px;
      color: var(--text-dim); gap: 8px;
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
      p { font-size: 13px; margin: 0; }
    }
  `]
})
export class ProfileComponent {
  private svc = inject(TicketService);

  assigned = computed(() =>
    this.svc.tickets().filter(t => t.assignee === 'Pedro Técnico')
  );

  resolvedCount = computed(() =>
    this.assigned().filter(t => t.status === 'resolved' || t.status === 'closed').length
  );

  inProgressCount = computed(() =>
    this.assigned().filter(t => t.status === 'in-progress').length
  );

  resolutionRate = computed(() => {
    const total = this.assigned().length;
    if (!total) return 0;
    return Math.round((this.resolvedCount() / total) * 100);
  });
}
