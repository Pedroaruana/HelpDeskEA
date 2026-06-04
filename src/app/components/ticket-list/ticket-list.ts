import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { PriorityLabelPipe, StatusLabelPipe, CategoryLabelPipe } from '../../pipes/ticket-labels.pipe';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatRippleModule, PriorityLabelPipe, StatusLabelPipe, CategoryLabelPipe],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Chamados</h1>
          <p class="subtitle">{{ filtered().length }} chamado(s) encontrado(s)</p>
        </div>
        <a routerLink="/new-ticket" class="btn-primary" matRipple>
          <mat-icon>add</mat-icon>
          Novo Chamado
        </a>
      </header>

      <div class="filters-bar">
        <div class="search-wrap">
          <mat-icon class="search-icon">search</mat-icon>
          <input class="search-input" placeholder="Buscar chamados..."
            [value]="search()" (input)="onSearch($event)" />
        </div>
        <div class="filter-chips">
          @for (s of statusOptions; track s.value) {
            <button class="chip" [class.active]="statusFilter() === s.value" (click)="statusFilter.set(s.value)">
              {{ s.label }}
            </button>
          }
        </div>
        <select class="select-filter" [value]="priorityFilter()" (change)="onPriorityChange($event)">
          <option value="">Todas prioridades</option>
          <option value="critical">Crítico</option>
          <option value="high">Alto</option>
          <option value="medium">Médio</option>
          <option value="low">Baixo</option>
        </select>
        <select class="select-filter" [value]="categoryFilter()" (change)="onCategoryChange($event)">
          <option value="">Todas categorias</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="network">Rede</option>
          <option value="access">Acesso</option>
          <option value="other">Outros</option>
        </select>
      </div>

      <div class="ticket-table">
        <div class="table-header">
          <span>ID</span>
          <span>Título</span>
          <span>Solicitante</span>
          <span>Categoria</span>
          <span>Prioridade</span>
          <span>Status</span>
          <span>Data</span>
          <span></span>
        </div>

        @for (ticket of filtered(); track ticket.id) {
          <a [routerLink]="['/tickets', ticket.id]" class="table-row" matRipple>
            <span class="col-id">{{ ticket.id }}</span>
            <span class="col-title">
              <span class="title-text">{{ ticket.title }}</span>
              @if (ticket.comments.length) {
                <span class="comment-count"><mat-icon>chat_bubble</mat-icon>{{ ticket.comments.length }}</span>
              }
            </span>
            <span class="col-requester">{{ ticket.requester }}</span>
            <span class="col-cat">
              <mat-icon class="cat-icon {{ ticket.category }}">{{ categoryIcon(ticket.category) }}</mat-icon>
              {{ ticket.category | categoryLabel }}
            </span>
            <span class="col-priority">
              <span class="badge priority-{{ ticket.priority }}">{{ ticket.priority | priorityLabel }}</span>
            </span>
            <span class="col-status">
              <span class="badge status-{{ ticket.status }}">{{ ticket.status | statusLabel }}</span>
            </span>
            <span class="col-date">{{ ticket.createdAt | date:'dd/MM HH:mm' }}</span>
            <span class="col-arrow"><mat-icon>chevron_right</mat-icon></span>
          </a>
        }

        @if (filtered().length === 0) {
          <div class="empty-state">
            <mat-icon>inbox</mat-icon>
            <p>Nenhum chamado encontrado</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }

    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
      h1 { font-size: 28px; font-weight: 700; color: #f1f5f9; margin: 0; }
      .subtitle { color: #64748b; margin: 4px 0 0; font-size: 14px; }
    }

    .btn-primary {
      display: flex; align-items: center; gap: 8px; padding: 10px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;
      box-shadow: 0 4px 15px rgba(99,102,241,0.4); transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.6); transform: translateY(-1px); }
    }

    .filters-bar {
      display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
    }

    .search-wrap {
      position: relative; flex: 1; min-width: 200px;
      .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #475569; font-size: 18px; width: 18px; height: 18px; }
    }

    .search-input {
      width: 100%; padding: 10px 14px 10px 40px;
      background: #1e293b; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; color: #e2e8f0; font-size: 14px; outline: none;
      &:focus { border-color: #6366f1; }
      &::placeholder { color: #475569; }
    }

    .filter-chips { display: flex; gap: 6px; }

    .chip {
      padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
      background: #1e293b; color: #64748b; font-size: 13px; cursor: pointer; transition: all 0.15s;
      &:hover { color: #94a3b8; }
      &.active { background: rgba(99,102,241,0.2); color: #818cf8; border-color: rgba(99,102,241,0.4); }
    }

    .select-filter {
      padding: 8px 12px; background: #1e293b; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px; color: #94a3b8; font-size: 13px; outline: none; cursor: pointer;
      option { background: #1e293b; }
      &:focus { border-color: #6366f1; }
    }

    .ticket-table {
      background: #1e293b; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
    }

    .table-header {
      display: grid; grid-template-columns: 80px 1fr 130px 110px 100px 130px 100px 32px;
      padding: 12px 20px; background: rgba(0,0,0,0.2);
      font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; gap: 12px;
    }

    .table-row {
      display: grid; grid-template-columns: 80px 1fr 130px 110px 100px 130px 100px 32px;
      padding: 14px 20px; border-top: 1px solid rgba(255,255,255,0.04);
      text-decoration: none; align-items: center; gap: 12px;
      transition: background 0.15s; cursor: pointer;
      &:hover { background: rgba(255,255,255,0.02); }
    }

    .col-id { font-size: 12px; font-weight: 700; color: #6366f1; }

    .col-title {
      display: flex; align-items: center; gap: 8px;
      .title-text { font-size: 13px; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .comment-count { display: flex; align-items: center; gap: 2px; font-size: 11px; color: #475569; flex-shrink: 0;
        mat-icon { font-size: 13px; width: 13px; height: 13px; }
      }
    }

    .col-requester { font-size: 12px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .col-cat {
      display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b;
      .cat-icon { font-size: 15px; width: 15px; height: 15px; }
      .cat-icon.hardware { color: #fb923c; } .cat-icon.software { color: #818cf8; }
      .cat-icon.network { color: #60a5fa; } .cat-icon.access { color: #4ade80; } .cat-icon.other { color: #94a3b8; }
    }

    .badge {
      font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 6px; white-space: nowrap;
    }

    .priority-critical { background: rgba(239,68,68,0.15); color: #f87171; }
    .priority-high { background: rgba(251,146,60,0.15); color: #fb923c; }
    .priority-medium { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .priority-low { background: rgba(100,116,139,0.15); color: #94a3b8; }

    .status-open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-in-progress { background: rgba(59,130,246,0.12); color: #60a5fa; }
    .status-resolved { background: rgba(34,197,94,0.12); color: #4ade80; }
    .status-closed { background: rgba(100,116,139,0.12); color: #94a3b8; }

    .col-date { font-size: 12px; color: #475569; }
    .col-arrow { color: #334155; display: flex; align-items: center; }

    .empty-state {
      display: flex; flex-direction: column; align-items: center; padding: 48px;
      color: #334155; gap: 8px;
      mat-icon { font-size: 40px; width: 40px; height: 40px; }
      p { font-size: 14px; }
    }
  `]
})
export class TicketListComponent {
  private svc = inject(TicketService);

  search = signal('');
  priorityFilter = signal('');
  categoryFilter = signal('');
  statusFilter = signal('');

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'open', label: 'Abertos' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvidos' },
    { value: 'closed', label: 'Fechados' },
  ];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.svc.tickets().filter(t => {
      if (this.statusFilter() && t.status !== this.statusFilter()) return false;
      if (this.priorityFilter() && t.priority !== this.priorityFilter()) return false;
      if (this.categoryFilter() && t.category !== this.categoryFilter()) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.requester.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onPriorityChange(event: Event): void {
    this.priorityFilter.set((event.target as HTMLSelectElement).value);
  }

  onCategoryChange(event: Event): void {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
  }

  categoryIcon(c: string): string {
    const icons: Record<string, string> = { hardware: 'memory', software: 'code', network: 'wifi', access: 'lock', other: 'more_horiz' };
    return icons[c] ?? 'help';
  }
}
