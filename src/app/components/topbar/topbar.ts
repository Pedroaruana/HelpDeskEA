import { Component, inject, signal, computed, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { ThemeService } from '../../services/theme.service';
import { UIService } from '../../services/ui.service';
import { PriorityLabelPipe, StatusLabelPipe } from '../../pipes/ticket-labels.pipe';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, PriorityLabelPipe, StatusLabelPipe],
  template: `
    <header class="topbar">
      <button class="hamburger" (click)="ui.toggle()" matRipple>
        <mat-icon>menu</mat-icon>
      </button>
      <div class="search-container" [class.focused]="isFocused()">
        <mat-icon class="search-icon">search</mat-icon>
        <input
          class="search-input"
          placeholder="Buscar chamados por título, ID ou solicitante..."
          [(ngModel)]="query"
          (focus)="isFocused.set(true)"
          (input)="isFocused.set(true)"
          (keydown.escape)="close()"
        />
        @if (query) {
          <button class="clear-btn" (click)="close()">
            <mat-icon>close</mat-icon>
          </button>
        }

        @if (isFocused() && query.trim()) {
          <div class="dropdown">
            @if (results().length) {
              @for (ticket of results(); track ticket.id) {
                <button class="result-item" (click)="goTo(ticket.id)" matRipple>
                  <span class="result-id">{{ ticket.id }}</span>
                  <div class="result-info">
                    <span class="result-title">{{ ticket.title }}</span>
                    <span class="result-meta">{{ ticket.requester }}</span>
                  </div>
                  <span class="badge priority-{{ ticket.priority }}">{{ ticket.priority | priorityLabel }}</span>
                  <span class="badge status-{{ ticket.status }}">{{ ticket.status | statusLabel }}</span>
                </button>
              }
            } @else {
              <div class="no-results">
                <mat-icon>search_off</mat-icon>
                <span>Nenhum chamado encontrado</span>
              </div>
            }
          </div>
        }
      </div>

      <div class="topbar-right">
        <div class="date-info">
          <mat-icon>calendar_today</mat-icon>
          <span>{{ today }}</span>
        </div>

        <button
          class="theme-toggle"
          (click)="theme.toggle()"
          [title]="theme.tooltip()"
          matRipple
        >
          <mat-icon>{{ theme.icon() }}</mat-icon>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 64px;
      background: var(--bg-topbar);
      border-bottom: 2px solid var(--border-topbar);
      display: flex;
      align-items: center;
      padding: 0 32px;
      gap: 16px;
      flex-shrink: 0;
      width: 100%;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .hamburger {
      display: none;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: none;
      background: none;
      color: var(--text-faint);
      border-radius: 10px;
      cursor: pointer;
      flex-shrink: 0;
      mat-icon { font-size: 22px; width: 22px; height: 22px; }
      &:hover { background: rgba(99,102,241,0.1); color: #818cf8; }
    }

    @media (max-width: 768px) {
      .topbar { padding: 0 16px; }
      .hamburger { display: flex; }
      .date-info { display: none; }
    }

    .search-container {
      position: relative;
      flex: 1;
      max-width: 540px;
      transition: max-width 0.3s ease;

      &.focused { max-width: 640px; }
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-faint);
      font-size: 18px;
      width: 18px;
      height: 18px;
      pointer-events: none;
      transition: color 0.15s;
    }

    .search-container.focused .search-icon { color: #6366f1; }

    .search-input {
      width: 100%;
      padding: 10px 40px 10px 44px;
      background: var(--bg-input);
      border: 1px solid var(--border-md);
      border-radius: 12px;
      color: var(--text-secondary);
      font-size: 14px;
      outline: none;
      transition: all 0.2s;

      &:focus { border-color: #6366f1; background: var(--bg-input); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      &::placeholder { color: var(--text-placeholder); }
    }

    .clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-faint);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { color: var(--text-muted); }
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-md);
      border-radius: 14px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      overflow: hidden;
      z-index: 100;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .result-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: none;
      border: none;
      border-top: 1px solid var(--border);
      cursor: pointer;
      text-align: left;
      transition: background 0.12s;

      &:first-child { border-top: none; }
      &:hover { background: var(--hover-card); }
    }

    .result-id {
      font-size: 11px;
      font-weight: 700;
      color: #6366f1;
      background: rgba(99,102,241,0.12);
      padding: 3px 7px;
      border-radius: 6px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .result-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .result-title {
      font-size: 13px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-meta {
      font-size: 11px;
      color: var(--text-faint);
      margin-top: 1px;
    }

    .badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .priority-critical { background: rgba(239,68,68,0.15); color: #f87171; }
    .priority-high { background: rgba(251,146,60,0.15); color: #fb923c; }
    .priority-medium { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .priority-low { background: rgba(100,116,139,0.15); color: #94a3b8; }
    .status-open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-in-progress { background: rgba(59,130,246,0.12); color: #60a5fa; }
    .status-resolved { background: rgba(34,197,94,0.12); color: #4ade80; }
    .status-closed { background: rgba(100,116,139,0.12); color: #94a3b8; }

    .no-results {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 16px;
      color: var(--text-dim);
      font-size: 13px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-faint);
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }

    .theme-toggle {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid var(--border-md);
      background: none;
      color: var(--text-faint);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &:hover {
        background: rgba(99,102,241,0.1);
        color: #818cf8;
        border-color: rgba(99,102,241,0.35);
      }
    }
  `]
})
export class TopbarComponent {
  private svc = inject(TicketService);
  private router = inject(Router);
  private el = inject(ElementRef);
  readonly theme = inject(ThemeService);
  readonly ui = inject(UIService);

  query = '';
  isFocused = signal(false);

  today = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  results = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) return [];
    return this.svc.tickets().filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.requester.toLowerCase().includes(q)
    ).slice(0, 6);
  });

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isFocused.set(false);
    }
  }

  goTo(id: string) {
    this.close();
    this.router.navigate(['/tickets', id]);
  }

  close() {
    this.query = '';
    this.isFocused.set(false);
  }
}
