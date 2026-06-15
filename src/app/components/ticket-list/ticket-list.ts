import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { PriorityLabelPipe, StatusLabelPipe, CategoryLabelPipe, TimeAgoPipe } from '../../pipes/ticket-labels.pipe';

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const STATUS_ORDER: Record<string, number> = { open: 0, 'in-progress': 1, resolved: 2, closed: 3 };

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatRippleModule, PriorityLabelPipe, StatusLabelPipe, CategoryLabelPipe, TimeAgoPipe],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Chamados</h1>
          <p class="subtitle">{{ filtered().length }} chamado(s) encontrado(s)</p>
        </div>
        <div class="header-actions">
          <button class="btn-csv" (click)="exportCSV()" matRipple>
            <mat-icon>download</mat-icon>
            Exportar CSV
          </button>
          <a routerLink="/kanban" class="btn-kanban" matRipple title="Visualização Kanban">
            <mat-icon>view_kanban</mat-icon>
            Kanban
          </a>
          <a routerLink="/new-ticket" class="btn-primary" matRipple>
            <mat-icon>add</mat-icon>
            Novo Chamado
          </a>
        </div>
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
        @if (hasFilters()) {
          <button class="btn-clear" (click)="clearFilters()">
            <mat-icon>close</mat-icon>
            Limpar filtros
          </button>
        }
      </div>

      <div class="ticket-table">
        <div class="table-header">
          <button class="sort-btn" [class.active]="sortCol() === 'id'" (click)="setSort('id')">
            ID <mat-icon>{{ sortIcon('id') }}</mat-icon>
          </button>
          <button class="sort-btn" [class.active]="sortCol() === 'title'" (click)="setSort('title')">
            Título <mat-icon>{{ sortIcon('title') }}</mat-icon>
          </button>
          <button class="sort-btn" [class.active]="sortCol() === 'requester'" (click)="setSort('requester')">
            Solicitante <mat-icon>{{ sortIcon('requester') }}</mat-icon>
          </button>
          <span>Categoria</span>
          <button class="sort-btn" [class.active]="sortCol() === 'priority'" (click)="setSort('priority')">
            Prioridade <mat-icon>{{ sortIcon('priority') }}</mat-icon>
          </button>
          <button class="sort-btn" [class.active]="sortCol() === 'status'" (click)="setSort('status')">
            Status <mat-icon>{{ sortIcon('status') }}</mat-icon>
          </button>
          <button class="sort-btn" [class.active]="sortCol() === 'createdAt'" (click)="setSort('createdAt')">
            Data <mat-icon>{{ sortIcon('createdAt') }}</mat-icon>
          </button>
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
            <span class="col-date">
              <span class="date-ago">{{ ticket.createdAt | timeAgo }}</span>
              <span class="date-fmt">{{ ticket.createdAt | date:'dd/MM HH:mm' }}</span>
            </span>
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
      h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
      .subtitle { color: var(--text-subtle); margin: 4px 0 0; font-size: 14px; }
    }

    .header-actions { display: flex; align-items: center; gap: 10px; }

    .btn-csv {
      display: flex; align-items: center; gap: 8px; padding: 10px 18px;
      background: var(--bg-card); border: 1px solid var(--border-md);
      color: var(--text-muted); border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { border-color: #6366f1; color: #818cf8; background: rgba(99,102,241,0.08); }
    }

    .btn-kanban {
      display: flex; align-items: center; gap: 8px; padding: 10px 18px;
      background: var(--bg-card); border: 1px solid var(--border-md);
      color: var(--text-muted); border-radius: 10px; text-decoration: none;
      font-size: 14px; font-weight: 600; transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { border-color: #6366f1; color: #818cf8; background: rgba(99,102,241,0.08); }
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
      .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-faint); font-size: 18px; width: 18px; height: 18px; }
    }

    .search-input {
      width: 100%; padding: 10px 14px 10px 40px;
      background: var(--bg-input); border: 1px solid var(--border-md);
      border-radius: 10px; color: var(--text-secondary); font-size: 14px; outline: none;
      transition: border-color 0.2s, background-color 0.25s;
      &:focus { border-color: #6366f1; }
      &::placeholder { color: var(--text-faint); }
    }

    .filter-chips { display: flex; gap: 6px; }

    .chip {
      padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border-md);
      background: var(--chip-bg); color: var(--text-subtle); font-size: 13px; cursor: pointer;
      transition: all 0.15s;
      &:hover { color: var(--text-muted); }
      &.active { background: rgba(99,102,241,0.2); color: #818cf8; border-color: rgba(99,102,241,0.4); }
    }

    .select-filter {
      padding: 8px 12px; background: var(--bg-input); border: 1px solid var(--border-md);
      border-radius: 8px; color: var(--text-muted); font-size: 13px; outline: none; cursor: pointer;
      transition: background-color 0.25s;
      option { background: var(--bg-card); }
      &:focus { border-color: #6366f1; }
    }

    .ticket-table {
      background: var(--bg-card); border-radius: 14px; border: 1px solid var(--border); overflow: hidden;
      transition: background-color 0.25s ease;
    }

    .table-header {
      display: grid; grid-template-columns: 80px 1fr 130px 110px 100px 130px 100px 32px;
      padding: 4px 20px; background: var(--table-header-bg);
      font-size: 11px; font-weight: 600; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.05em; gap: 12px;
      align-items: center;

      span { padding: 8px 0; }
    }

    .sort-btn {
      display: flex; align-items: center; gap: 3px;
      background: none; border: none; cursor: pointer;
      font-size: 11px; font-weight: 600; color: var(--text-faint);
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 8px 6px; border-radius: 6px;
      transition: all 0.15s; white-space: nowrap;

      mat-icon { font-size: 14px; width: 14px; height: 14px; opacity: 0.4; transition: opacity 0.15s; }

      &:hover { color: var(--text-muted); background: var(--hover-row);
        mat-icon { opacity: 0.7; }
      }
      &.active { color: #818cf8;
        mat-icon { opacity: 1; color: #818cf8; }
      }
    }

    .table-row {
      display: grid; grid-template-columns: 80px 1fr 130px 110px 100px 130px 100px 32px;
      padding: 14px 20px; border-top: 1px solid var(--border);
      text-decoration: none; align-items: center; gap: 12px;
      transition: background 0.15s; cursor: pointer;
      &:hover { background: var(--hover-row); }
    }

    .col-id { font-size: 12px; font-weight: 700; color: #6366f1; }

    .col-title {
      display: flex; align-items: center; gap: 8px;
      .title-text { font-size: 13px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .comment-count { display: flex; align-items: center; gap: 2px; font-size: 11px; color: var(--text-faint); flex-shrink: 0;
        mat-icon { font-size: 13px; width: 13px; height: 13px; }
      }
    }

    .col-requester { font-size: 12px; color: var(--text-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .col-cat {
      display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-subtle);
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

    .col-date {
      display: flex; flex-direction: column; gap: 2px;
      .date-ago { font-size: 12px; color: var(--text-muted); font-weight: 500; }
      .date-fmt { font-size: 11px; color: var(--text-faint); }
    }
    .btn-clear {
      display: flex; align-items: center; gap: 6px; padding: 8px 14px;
      border-radius: 8px; border: 1px solid rgba(239,68,68,0.25);
      background: rgba(239,68,68,0.08); color: #f87171;
      font-size: 13px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
      &:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); }
    }

    .col-arrow { color: var(--text-dim); display: flex; align-items: center; }

    .empty-state {
      display: flex; flex-direction: column; align-items: center; padding: 48px;
      color: var(--text-dim); gap: 8px;
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
  sortCol = signal<string>('createdAt');
  sortDir = signal<'asc' | 'desc'>('desc');

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'open', label: 'Abertos' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvidos' },
    { value: 'closed', label: 'Fechados' },
  ];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    const col = this.sortCol();
    const dir = this.sortDir();

    const result = this.svc.tickets().filter(t => {
      if (this.statusFilter() && t.status !== this.statusFilter()) return false;
      if (this.priorityFilter() && t.priority !== this.priorityFilter()) return false;
      if (this.categoryFilter() && t.category !== this.categoryFilter()) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.requester.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      let cmp = 0;
      if (col === 'id') {
        cmp = a.id.localeCompare(b.id);
      } else if (col === 'title') {
        cmp = a.title.localeCompare(b.title, 'pt-BR');
      } else if (col === 'requester') {
        cmp = a.requester.localeCompare(b.requester, 'pt-BR');
      } else if (col === 'priority') {
        cmp = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
      } else if (col === 'status') {
        cmp = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
      } else if (col === 'createdAt') {
        cmp = a.createdAt.getTime() - b.createdAt.getTime();
      }
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  setSort(col: string): void {
    if (this.sortCol() === col) {
      this.sortDir.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortCol.set(col);
      this.sortDir.set('asc');
    }
  }

  sortIcon(col: string): string {
    if (this.sortCol() !== col) return 'unfold_more';
    return this.sortDir() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  hasFilters = computed(() =>
    !!this.search() || !!this.statusFilter() || !!this.priorityFilter() || !!this.categoryFilter()
  );

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.priorityFilter.set('');
    this.categoryFilter.set('');
  }

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

  exportCSV(): void {
    const headers = ['ID', 'Título', 'Solicitante', 'Categoria', 'Prioridade', 'Status', 'Data de Abertura'];
    const rows = this.filtered().map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.requester.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.createdAt.toLocaleDateString('pt-BR'),
    ]);

    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chamados_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
