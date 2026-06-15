import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { PriorityLabelPipe, TimeAgoPipe } from '../../pipes/ticket-labels.pipe';

interface Column {
  key: string;
  label: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatRippleModule, PriorityLabelPipe, TimeAgoPipe],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Kanban</h1>
          <p class="subtitle">{{ total() }} chamado(s) no board</p>
        </div>
        <a routerLink="/tickets" class="btn-list" matRipple>
          <mat-icon>view_list</mat-icon>
          Ver como lista
        </a>
      </header>

      <div class="board">
        @for (col of columns; track col.key) {
          <div class="column">
            <div class="col-header" [style.border-color]="col.color">
              <mat-icon [style.color]="col.color">{{ col.icon }}</mat-icon>
              <span class="col-label">{{ col.label }}</span>
              <span class="col-count" [style.background]="col.color + '22'" [style.color]="col.color">
                {{ byStatus(col.key).length }}
              </span>
            </div>

            <div class="cards">
              @for (ticket of byStatus(col.key); track ticket.id) {
                <a [routerLink]="['/tickets', ticket.id]" class="card" matRipple>
                  <div class="card-top">
                    <span class="card-id">{{ ticket.id }}</span>
                    <span class="badge priority-{{ ticket.priority }}">{{ ticket.priority | priorityLabel }}</span>
                  </div>
                  <p class="card-title">{{ ticket.title }}</p>
                  <div class="card-bottom">
                    <span class="card-requester">
                      <mat-icon>person</mat-icon>
                      {{ ticket.requester }}
                    </span>
                    <span class="card-time">{{ ticket.createdAt | timeAgo }}</span>
                  </div>
                </a>
              }

              @if (byStatus(col.key).length === 0) {
                <div class="empty-col">
                  <mat-icon>inbox</mat-icon>
                  <span>Sem chamados</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; height: calc(100vh - 64px); display: flex; flex-direction: column; }

    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-shrink: 0;
      h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
      .subtitle { color: var(--text-subtle); margin: 4px 0 0; font-size: 14px; }
    }

    .btn-list {
      display: flex; align-items: center; gap: 8px; padding: 10px 18px;
      background: var(--bg-card); border: 1px solid var(--border-md);
      color: var(--text-muted); border-radius: 10px; text-decoration: none;
      font-size: 14px; font-weight: 600; transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { border-color: #6366f1; color: #818cf8; background: rgba(99,102,241,0.08); }
    }

    .board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      flex: 1;
      overflow: hidden;
    }

    .column {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border-radius: 14px;
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .col-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      border-bottom: 2px solid;
      flex-shrink: 0;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      .col-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); flex: 1; }
      .col-count {
        font-size: 12px; font-weight: 700;
        padding: 2px 8px; border-radius: 99px;
      }
    }

    .cards {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card {
      display: block;
      background: var(--bg-base);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;

      &:hover {
        border-color: #6366f1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .card-id {
      font-size: 11px; font-weight: 700; color: #6366f1;
      background: rgba(99,102,241,0.12); padding: 2px 7px; border-radius: 6px;
    }

    .card-title {
      font-size: 13px; color: var(--text-secondary);
      margin: 0 0 10px; line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-bottom {
      display: flex; align-items: center; justify-content: space-between;
    }

    .card-requester {
      display: flex; align-items: center; gap: 4px;
      font-size: 11px; color: var(--text-faint);
      mat-icon { font-size: 13px; width: 13px; height: 13px; }
    }

    .card-time {
      font-size: 11px; color: var(--text-faint);
    }

    .badge {
      font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 6px;
    }

    .priority-critical { background: rgba(239,68,68,0.15); color: #f87171; }
    .priority-high { background: rgba(251,146,60,0.15); color: #fb923c; }
    .priority-medium { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .priority-low { background: rgba(100,116,139,0.15); color: #94a3b8; }

    .empty-col {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; padding: 32px 16px; color: var(--text-dim);
      mat-icon { font-size: 28px; width: 28px; height: 28px; opacity: 0.4; }
      span { font-size: 12px; opacity: 0.6; }
    }

    @media (max-width: 768px) {
      .page { padding: 16px; height: auto; }
      .board { grid-template-columns: 1fr; overflow: visible; }
      .column { max-height: 400px; }
    }
  `]
})
export class KanbanComponent {
  private svc = inject(TicketService);

  columns: Column[] = [
    { key: 'open',        label: 'Aberto',        color: '#fbbf24', icon: 'radio_button_checked' },
    { key: 'in-progress', label: 'Em Andamento',  color: '#60a5fa', icon: 'autorenew' },
    { key: 'resolved',    label: 'Resolvido',      color: '#4ade80', icon: 'check_circle' },
    { key: 'closed',      label: 'Fechado',        color: '#94a3b8', icon: 'archive' },
  ];

  total = computed(() => this.svc.tickets().length);

  byStatus(status: string): Ticket[] {
    return this.svc.tickets().filter(t => t.status === status);
  }
}
