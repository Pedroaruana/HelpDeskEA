import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { PriorityLabelPipe, StatusLabelPipe } from '../../pipes/ticket-labels.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, MatIconModule, MatRippleModule, PriorityLabelPipe, StatusLabelPipe],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">Visão geral dos chamados de suporte</p>
        </div>
        <a routerLink="/new-ticket" class="btn-primary" matRipple>
          <mat-icon>add</mat-icon>
          Novo Chamado
        </a>
      </header>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon"><mat-icon>folder_open</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().total }}</span>
            <span class="stat-label">Total de Chamados</span>
          </div>
        </div>
        <div class="stat-card open">
          <div class="stat-icon"><mat-icon>radio_button_checked</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().open }}</span>
            <span class="stat-label">Abertos</span>
          </div>
        </div>
        <div class="stat-card progress">
          <div class="stat-icon"><mat-icon>autorenew</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().inProgress }}</span>
            <span class="stat-label">Em Andamento</span>
          </div>
        </div>
        <div class="stat-card resolved">
          <div class="stat-icon"><mat-icon>check_circle</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().resolved }}</span>
            <span class="stat-label">Resolvidos</span>
          </div>
        </div>
        <div class="stat-card critical">
          <div class="stat-icon"><mat-icon>warning</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().critical }}</span>
            <span class="stat-label">Críticos Abertos</span>
          </div>
        </div>
        <div class="stat-card avg">
          <div class="stat-icon"><mat-icon>schedule</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().avgResolutionHours }}h</span>
            <span class="stat-label">Tempo Médio Resolução</span>
          </div>
        </div>
      </div>

      <div class="bottom-grid">
        <div class="card">
          <div class="card-header">
            <h2>Chamados Recentes</h2>
            <a routerLink="/tickets" class="link-all">Ver todos</a>
          </div>
          <div class="ticket-list">
            @for (ticket of recentTickets(); track ticket.id) {
              <a [routerLink]="['/tickets', ticket.id]" class="ticket-row" matRipple>
                <div class="ticket-left">
                  <span class="ticket-id">{{ ticket.id }}</span>
                  <div>
                    <p class="ticket-title">{{ ticket.title }}</p>
                    <p class="ticket-meta">{{ ticket.requester }} · {{ ticket.createdAt | date:'dd/MM HH:mm' }}</p>
                  </div>
                </div>
                <div class="ticket-right">
                  <span class="badge priority-{{ ticket.priority }}">{{ ticket.priority | priorityLabel }}</span>
                  <span class="badge status-{{ ticket.status }}">{{ ticket.status | statusLabel }}</span>
                </div>
              </a>
            }
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Distribuição por Categoria</h2>
          </div>
          <div class="category-list">
            @for (cat of categoryStats(); track cat.name) {
              <div class="category-row">
                <div class="cat-info">
                  <mat-icon class="cat-icon {{ cat.key }}">{{ cat.icon }}</mat-icon>
                  <span class="cat-name">{{ cat.name }}</span>
                </div>
                <div class="cat-bar-wrap">
                  <div class="cat-bar" [style.width.%]="cat.pct"></div>
                </div>
                <span class="cat-count">{{ cat.count }}</span>
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
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;

      h1 { font-size: 28px; font-weight: 700; color: #f1f5f9; margin: 0; }
      .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border-radius: 10px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(99,102,241,0.4);
      transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.6); transform: translateY(-1px); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #1e293b;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid rgba(255,255,255,0.06);
      transition: transform 0.2s;
      &:hover { transform: translateY(-2px); }
    }

    .stat-icon {
      width: 52px; height: 52px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 26px; width: 26px; height: 26px; }
    }

    .total .stat-icon { background: rgba(99,102,241,0.15); mat-icon { color: #818cf8; } }
    .open .stat-icon { background: rgba(251,191,36,0.15); mat-icon { color: #fbbf24; } }
    .progress .stat-icon { background: rgba(59,130,246,0.15); mat-icon { color: #60a5fa; } }
    .resolved .stat-icon { background: rgba(34,197,94,0.15); mat-icon { color: #4ade80; } }
    .critical .stat-icon { background: rgba(239,68,68,0.15); mat-icon { color: #f87171; } }
    .avg .stat-icon { background: rgba(168,85,247,0.15); mat-icon { color: #c084fc; } }

    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 30px; font-weight: 700; color: #f1f5f9; line-height: 1; }
    .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }

    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
    }

    .card {
      background: #1e293b;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 12px;
      h2 { font-size: 16px; font-weight: 600; color: #e2e8f0; margin: 0; }
      .link-all { font-size: 13px; color: #6366f1; text-decoration: none; &:hover { color: #818cf8; } }
    }

    .ticket-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid rgba(255,255,255,0.04);
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s;
      &:hover { background: rgba(255,255,255,0.03); }
    }

    .ticket-left { display: flex; align-items: center; gap: 12px; }
    .ticket-id { font-size: 11px; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.12); padding: 3px 7px; border-radius: 6px; white-space: nowrap; }
    .ticket-title { font-size: 13px; color: #e2e8f0; margin: 0 0 2px; }
    .ticket-meta { font-size: 11px; color: #475569; margin: 0; }
    .ticket-right { display: flex; gap: 6px; flex-shrink: 0; }

    .badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .priority-critical { background: rgba(239,68,68,0.15); color: #f87171; }
    .priority-high { background: rgba(251,146,60,0.15); color: #fb923c; }
    .priority-medium { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .priority-low { background: rgba(100,116,139,0.15); color: #94a3b8; }

    .status-open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-in-progress { background: rgba(59,130,246,0.12); color: #60a5fa; }
    .status-resolved { background: rgba(34,197,94,0.12); color: #4ade80; }
    .status-closed { background: rgba(100,116,139,0.12); color: #94a3b8; }

    .category-list { padding: 8px 20px 16px; display: flex; flex-direction: column; gap: 14px; }

    .category-row { display: flex; align-items: center; gap: 12px; }

    .cat-info { display: flex; align-items: center; gap: 8px; width: 130px; flex-shrink: 0; }
    .cat-icon { font-size: 18px; width: 18px; height: 18px; }
    .cat-icon.hardware { color: #fb923c; }
    .cat-icon.software { color: #818cf8; }
    .cat-icon.network { color: #60a5fa; }
    .cat-icon.access { color: #4ade80; }
    .cat-icon.other { color: #94a3b8; }
    .cat-name { font-size: 13px; color: #94a3b8; }

    .cat-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
    .cat-bar { height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 99px; transition: width 0.6s ease; }

    .cat-count { font-size: 13px; font-weight: 600; color: #e2e8f0; width: 20px; text-align: right; flex-shrink: 0; }
  `]
})
export class DashboardComponent {
  private svc = inject(TicketService);
  stats = this.svc.stats;

  recentTickets = computed(() =>
    [...this.svc.tickets()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)
  );

  categoryStats = computed(() => {
    const tickets = this.svc.tickets();
    const cats = [
      { key: 'hardware', name: 'Hardware', icon: 'memory' },
      { key: 'software', name: 'Software', icon: 'code' },
      { key: 'network', name: 'Rede', icon: 'wifi' },
      { key: 'access', name: 'Acesso', icon: 'lock' },
      { key: 'other', name: 'Outros', icon: 'more_horiz' },
    ];
    const max = Math.max(...cats.map(c => tickets.filter(t => t.category === c.key).length), 1);
    return cats.map(c => {
      const count = tickets.filter(t => t.category === c.key).length;
      return { ...c, count, pct: Math.round((count / max) * 100) };
    });
  });

}
