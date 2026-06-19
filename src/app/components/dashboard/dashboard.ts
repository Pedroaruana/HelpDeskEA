import { Component, inject, computed, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
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

      @if (loading()) {
        <div class="stats-grid">
          @for (i of skeletons; track i) {
            <div class="stat-card skeleton-card">
              <div class="sk sk-icon"></div>
              <div class="sk-info">
                <div class="sk sk-value"></div>
                <div class="sk sk-label"></div>
              </div>
            </div>
          }
        </div>
        <div class="bottom-grid">
          <div class="card">
            <div class="card-header"><div class="sk sk-title"></div></div>
            @for (i of skeletonRows; track i) {
              <div class="sk-ticket-row">
                <div class="sk sk-id"></div>
                <div class="sk-ticket-info">
                  <div class="sk sk-line-lg"></div>
                  <div class="sk sk-line-sm"></div>
                </div>
              </div>
            }
          </div>
          <div class="card">
            <div class="card-header"><div class="sk sk-title"></div></div>
            <div class="category-list">
              @for (i of skeletonRows; track i) {
                <div class="sk-cat-row">
                  <div class="sk sk-cat-label"></div>
                  <div class="sk sk-bar"></div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {

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

      <div class="charts-grid">
        <div class="card chart-card">
          <div class="card-header">
            <h2>Chamados por Semana</h2>
          </div>
          <div class="chart-wrap">
            <canvas #weeklyChart></canvas>
          </div>
        </div>
        <div class="card chart-card">
          <div class="card-header">
            <h2>Distribuição por Status</h2>
          </div>
          <div class="chart-wrap donut-wrap">
            <canvas #statusChart></canvas>
          </div>
        </div>
      </div>

      }
    </div>
  `,
  styles: [`
    .page { padding: 32px; }

    @media (max-width: 768px) {
      .page { padding: 16px; }
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;

      h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
      .subtitle { color: var(--text-subtle); margin: 4px 0 0; font-size: 14px; }
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

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid var(--border);
      transition: transform 0.2s, background-color 0.25s ease;
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
    .stat-value { font-size: 30px; font-weight: 700; color: var(--text-primary); line-height: 1; }
    .stat-label { font-size: 12px; color: var(--text-subtle); margin-top: 4px; }

    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
    }

    @media (max-width: 768px) {
      .bottom-grid { grid-template-columns: 1fr; }
    }

    .card {
      background: var(--bg-card);
      border-radius: 14px;
      border: 1px solid var(--border);
      overflow: hidden;
      transition: background-color 0.25s ease;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 12px;
      h2 { font-size: 16px; font-weight: 600; color: var(--text-secondary); margin: 0; }
      .link-all { font-size: 13px; color: #6366f1; text-decoration: none; &:hover { color: #818cf8; } }
    }

    .ticket-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s;
      &:hover { background: var(--hover-card); }
    }

    .ticket-left { display: flex; align-items: center; gap: 12px; }
    .ticket-id { font-size: 11px; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.12); padding: 3px 7px; border-radius: 6px; white-space: nowrap; }
    .ticket-title { font-size: 13px; color: var(--text-secondary); margin: 0 0 2px; }
    .ticket-meta { font-size: 11px; color: var(--text-faint); margin: 0; }
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
    .cat-name { font-size: 13px; color: var(--text-muted); }

    .cat-bar-wrap { flex: 1; height: 6px; background: var(--cat-bar-bg); border-radius: 99px; overflow: hidden; }
    .cat-bar { height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 99px; transition: width 0.6s ease; }

    .cat-count { font-size: 13px; font-weight: 600; color: var(--text-secondary); width: 20px; text-align: right; flex-shrink: 0; }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .charts-grid { grid-template-columns: 1fr; }
    }

    .chart-card { padding-bottom: 20px; }

    .chart-wrap {
      padding: 0 20px 8px;
      height: 220px;
      display: flex;
      align-items: center;
    }

    .donut-wrap {
      justify-content: center;
      height: 220px;
    }

    .chart-wrap canvas { width: 100% !important; }

    @keyframes shimmer {
      0% { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }

    .sk {
      background: linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 8px;
    }

    .skeleton-card {
      pointer-events: none;
    }

    .sk-icon { width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0; }
    .sk-info { display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .sk-value { height: 28px; width: 48px; border-radius: 6px; }
    .sk-label { height: 12px; width: 90px; border-radius: 6px; }
    .sk-title { height: 16px; width: 140px; border-radius: 6px; }

    .sk-ticket-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-top: 1px solid var(--border);
    }
    .sk-id { width: 48px; height: 22px; border-radius: 6px; flex-shrink: 0; }
    .sk-ticket-info { display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .sk-line-lg { height: 13px; width: 65%; border-radius: 6px; }
    .sk-line-sm { height: 11px; width: 40%; border-radius: 6px; }

    .sk-cat-row { display: flex; align-items: center; gap: 12px; padding: 0 4px; }
    .sk-cat-label { width: 100px; height: 13px; border-radius: 6px; flex-shrink: 0; }
    .sk-bar { flex: 1; height: 6px; border-radius: 99px; }
  `]
})
export class DashboardComponent implements AfterViewInit {
  private svc = inject(TicketService);
  stats = this.svc.stats;
  loading = this.svc.loading;
  skeletons = [1,2,3,4,5,6];
  skeletonRows = [1,2,3,4,5];

  @ViewChild('weeklyChart') weeklyRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusRef!: ElementRef<HTMLCanvasElement>;

  private weeklyChart: Chart | null = null;
  private statusChart: Chart | null = null;

  recentTickets = computed(() =>
    [...this.svc.tickets()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)
  );

  categoryStats = computed(() => {
    const catMeta: Record<string, { name: string; icon: string }> = {
      hardware: { name: 'Hardware', icon: 'memory' },
      software: { name: 'Software', icon: 'code' },
      network:  { name: 'Rede',     icon: 'wifi' },
      access:   { name: 'Acesso',   icon: 'lock' },
      other:    { name: 'Outros',   icon: 'more_horiz' },
    };
    const byCategory = this.svc.stats().byCategory;
    const max = Math.max(...byCategory.map(c => c.count), 1);
    return byCategory.map(c => ({
      key: c.category,
      name: catMeta[c.category]?.name ?? c.category,
      icon: catMeta[c.category]?.icon ?? 'help',
      count: c.count,
      pct: Math.round((c.count / max) * 100),
    }));
  });

  constructor() {
    effect(() => {
      const stats = this.svc.stats();
      if (stats.byWeek.length > 0) {
        setTimeout(() => this.buildCharts(), 0);
      }
    });
  }

  ngAfterViewInit() {
    if (this.svc.stats().byWeek.length > 0) {
      setTimeout(() => this.buildCharts(), 0);
    }
  }

  private buildCharts() {
    if (!this.weeklyRef || !this.statusRef) return;
    this.buildWeeklyChart();
    this.buildStatusChart();
  }

  private buildWeeklyChart() {
    const byWeek = this.svc.stats().byWeek;
    const weeks = byWeek.map(w => w.label);
    const counts = byWeek.map(w => w.count);

    if (this.weeklyChart) this.weeklyChart.destroy();
    this.weeklyChart = new Chart(this.weeklyRef.nativeElement, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [{
          label: 'Chamados abertos',
          data: counts,
          backgroundColor: 'rgba(99,102,241,0.7)',
          borderColor: '#6366f1',
          borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 1 }, beginAtZero: true }
        }
      }
    });
  }

  private buildStatusChart() {
    const s = this.stats();
    const inProgress = s.inProgress;
    const open = s.open;
    const resolved = s.resolved;

    if (this.statusChart) this.statusChart.destroy();
    this.statusChart = new Chart(this.statusRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Abertos', 'Em Andamento', 'Resolvidos'],
        datasets: [{
          data: [open, inProgress, resolved],
          backgroundColor: ['rgba(251,191,36,0.85)', 'rgba(59,130,246,0.85)', 'rgba(34,197,94,0.85)'],
          borderColor: ['#fbbf24', '#60a5fa', '#4ade80'],
          borderWidth: 2,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { size: 12 }, padding: 16, boxWidth: 12, borderRadius: 4 }
          }
        },
        cutout: '65%',
      }
    });
  }
}
