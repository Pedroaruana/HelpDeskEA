import { Component, inject, signal, computed, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { PriorityLabelPipe, StatusLabelPipe } from '../../pipes/ticket-labels.pipe';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, PriorityLabelPipe, StatusLabelPipe],
  template: `
    <header class="topbar">
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
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 64px;
      background: #162032;
      border-bottom: 2px solid rgba(99,102,241,0.3);
      display: flex;
      align-items: center;
      padding: 0 32px;
      gap: 16px;
      flex-shrink: 0;
      width: 100%;
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
      color: #475569;
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
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: #e2e8f0;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;

      &:focus { border-color: #6366f1; background: #1e293b; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      &::placeholder { color: #334155; }
    }

    .clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { color: #94a3b8; }
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.08);
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
      border-top: 1px solid rgba(255,255,255,0.04);
      cursor: pointer;
      text-align: left;
      transition: background 0.12s;

      &:first-child { border-top: none; }
      &:hover { background: rgba(255,255,255,0.03); }
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
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-meta {
      font-size: 11px;
      color: #475569;
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
      color: #334155;
      font-size: 13px;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: auto;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #475569;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }
  `]
})
export class TopbarComponent {
  private svc = inject(TicketService);
  private router = inject(Router);
  private el = inject(ElementRef);

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
