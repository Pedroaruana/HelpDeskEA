import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatRippleModule],
  template: `
    @if (ticket()) {
      <div class="page">
        <div class="breadcrumb">
          <a routerLink="/tickets" class="back-link">
            <mat-icon>arrow_back</mat-icon>
            Chamados
          </a>
          <mat-icon class="sep">chevron_right</mat-icon>
          <span>{{ ticket()!.id }}</span>
        </div>

        <div class="detail-layout">
          <div class="main-col">
            <div class="card ticket-card">
              <div class="ticket-header">
                <div class="header-left">
                  <span class="ticket-id">{{ ticket()!.id }}</span>
                  <h1>{{ ticket()!.title }}</h1>
                </div>
                <div class="badges">
                  <span class="badge priority-{{ ticket()!.priority }}">{{ priorityLabel(ticket()!.priority) }}</span>
                  <span class="badge status-{{ ticket()!.status }}">{{ statusLabel(ticket()!.status) }}</span>
                </div>
              </div>

              <p class="description">{{ ticket()!.description }}</p>

              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div>
                    <span class="info-label">Solicitante</span>
                    <span class="info-value">{{ ticket()!.requester }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>engineering</mat-icon>
                  <div>
                    <span class="info-label">Responsável</span>
                    <span class="info-value">{{ ticket()!.assignee ?? 'Não atribuído' }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>category</mat-icon>
                  <div>
                    <span class="info-label">Categoria</span>
                    <span class="info-value">{{ categoryLabel(ticket()!.category) }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <mat-icon>schedule</mat-icon>
                  <div>
                    <span class="info-label">Aberto em</span>
                    <span class="info-value">{{ ticket()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                </div>
                @if (ticket()!.resolvedAt) {
                  <div class="info-item">
                    <mat-icon>check_circle</mat-icon>
                    <div>
                      <span class="info-label">Resolvido em</span>
                      <span class="info-value">{{ ticket()!.resolvedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="card comments-card">
              <h2>Comentários ({{ ticket()!.comments.length }})</h2>
              <div class="comments-list">
                @for (c of ticket()!.comments; track c.id) {
                  <div class="comment">
                    <div class="comment-avatar">{{ initials(c.author) }}</div>
                    <div class="comment-body">
                      <div class="comment-meta">
                        <span class="comment-author">{{ c.author }}</span>
                        <span class="comment-time">{{ c.createdAt | date:'dd/MM HH:mm' }}</span>
                      </div>
                      <p class="comment-text">{{ c.text }}</p>
                    </div>
                  </div>
                }
                @if (!ticket()!.comments.length) {
                  <p class="no-comments">Nenhum comentário ainda.</p>
                }
              </div>
              <div class="add-comment">
                <textarea class="comment-input" [(ngModel)]="newComment" placeholder="Adicionar comentário..." rows="3"></textarea>
                <button class="btn-primary" (click)="addComment()" [disabled]="!newComment.trim()" matRipple>
                  <mat-icon>send</mat-icon>
                  Enviar
                </button>
              </div>
            </div>
          </div>

          <div class="side-col">
            <div class="card actions-card">
              <h3>Alterar Status</h3>
              <div class="status-actions">
                @for (opt of statusOptions; track opt.value) {
                  <button
                    class="status-btn status-{{ opt.value }}"
                    [class.active]="ticket()!.status === opt.value"
                    (click)="updateStatus(opt.value)"
                    matRipple
                  >
                    <mat-icon>{{ opt.icon }}</mat-icon>
                    {{ opt.label }}
                  </button>
                }
              </div>
            </div>

            <div class="card timeline-card">
              <h3>Linha do Tempo</h3>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="tl-dot open"></div>
                  <div class="tl-content">
                    <span class="tl-label">Chamado aberto</span>
                    <span class="tl-time">{{ ticket()!.createdAt | date:'dd/MM HH:mm' }}</span>
                  </div>
                </div>
                @if (ticket()!.status === 'in-progress' || ticket()!.status === 'resolved' || ticket()!.status === 'closed') {
                  <div class="timeline-item">
                    <div class="tl-dot in-progress"></div>
                    <div class="tl-content">
                      <span class="tl-label">Em andamento</span>
                      <span class="tl-time">{{ ticket()!.updatedAt | date:'dd/MM HH:mm' }}</span>
                    </div>
                  </div>
                }
                @if (ticket()!.resolvedAt) {
                  <div class="timeline-item">
                    <div class="tl-dot resolved"></div>
                    <div class="tl-content">
                      <span class="tl-label">Resolvido</span>
                      <span class="tl-time">{{ ticket()!.resolvedAt | date:'dd/MM HH:mm' }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <mat-icon>search_off</mat-icon>
        <h2>Chamado não encontrado</h2>
        <a routerLink="/tickets" class="btn-primary">Voltar</a>
      </div>
    }
  `,
  styles: [`
    .page { padding: 32px; }

    .breadcrumb {
      display: flex; align-items: center; gap: 8px; margin-bottom: 24px;
      font-size: 13px; color: #475569;
    }
    .back-link {
      display: flex; align-items: center; gap: 4px; color: #6366f1; text-decoration: none;
      &:hover { color: #818cf8; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .sep { font-size: 16px; width: 16px; height: 16px; color: #334155; }

    .detail-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
    .main-col, .side-col { display: flex; flex-direction: column; gap: 16px; }

    .card {
      background: #1e293b; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); padding: 24px;
    }

    .ticket-header {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 16px;
    }
    .header-left { flex: 1; }
    .ticket-id { font-size: 12px; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.12); padding: 3px 8px; border-radius: 6px; }
    h1 { font-size: 20px; font-weight: 700; color: #f1f5f9; margin: 8px 0 0; }
    .badges { display: flex; gap: 8px; flex-shrink: 0; }

    .description { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item {
      display: flex; align-items: flex-start; gap: 10px;
      mat-icon { color: #475569; font-size: 18px; width: 18px; height: 18px; margin-top: 2px; }
      div { display: flex; flex-direction: column; }
    }
    .info-label { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-value { font-size: 13px; color: #e2e8f0; margin-top: 2px; }

    h2 { font-size: 16px; font-weight: 600; color: #e2e8f0; margin: 0 0 16px; }
    h3 { font-size: 14px; font-weight: 600; color: #94a3b8; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; }

    .comments-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
    .comment { display: flex; gap: 12px; }
    .comment-avatar {
      width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: white;
    }
    .comment-body { flex: 1; }
    .comment-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .comment-author { font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .comment-time { font-size: 11px; color: #475569; }
    .comment-text { font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.5; }
    .no-comments { font-size: 13px; color: #334155; }

    .add-comment { display: flex; flex-direction: column; gap: 10px; }
    .comment-input {
      width: 100%; padding: 12px; background: #0f172a; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; color: #e2e8f0; font-size: 13px; outline: none; resize: none;
      &:focus { border-color: #6366f1; }
      &::placeholder { color: #334155; }
    }
    .btn-primary {
      align-self: flex-end; display: flex; align-items: center; gap: 6px;
      padding: 9px 18px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
      &:not(:disabled):hover { opacity: 0.9; }
    }

    .status-actions { display: flex; flex-direction: column; gap: 8px; }
    .status-btn {
      display: flex; align-items: center; gap: 10px; padding: 11px 14px;
      border-radius: 9px; border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.02); color: #64748b;
      font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
      mat-icon { font-size: 17px; width: 17px; height: 17px; }

      &.status-open.active, &.status-open:hover { background: rgba(251,191,36,0.12); color: #fbbf24; border-color: rgba(251,191,36,0.2); }
      &.status-in-progress.active, &.status-in-progress:hover { background: rgba(59,130,246,0.12); color: #60a5fa; border-color: rgba(59,130,246,0.2); }
      &.status-resolved.active, &.status-resolved:hover { background: rgba(34,197,94,0.12); color: #4ade80; border-color: rgba(34,197,94,0.2); }
      &.status-closed.active, &.status-closed:hover { background: rgba(100,116,139,0.12); color: #94a3b8; border-color: rgba(100,116,139,0.2); }
    }

    .timeline { display: flex; flex-direction: column; gap: 0; }
    .timeline-item { display: flex; gap: 12px; position: relative; padding-bottom: 16px;
      &:last-child { padding-bottom: 0; }
      &:not(:last-child)::before {
        content: ''; position: absolute; left: 7px; top: 16px; bottom: 0;
        width: 2px; background: rgba(255,255,255,0.06);
      }
    }
    .tl-dot {
      width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
      &.open { background: #fbbf24; box-shadow: 0 0 8px rgba(251,191,36,0.4); }
      &.in-progress { background: #60a5fa; box-shadow: 0 0 8px rgba(59,130,246,0.4); }
      &.resolved { background: #4ade80; box-shadow: 0 0 8px rgba(34,197,94,0.4); }
    }
    .tl-content { display: flex; flex-direction: column; }
    .tl-label { font-size: 13px; color: #e2e8f0; }
    .tl-time { font-size: 11px; color: #475569; }

    .badge { font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 6px; }
    .priority-critical { background: rgba(239,68,68,0.15); color: #f87171; }
    .priority-high { background: rgba(251,146,60,0.15); color: #fb923c; }
    .priority-medium { background: rgba(251,191,36,0.15); color: #fbbf24; }
    .priority-low { background: rgba(100,116,139,0.15); color: #94a3b8; }
    .status-open { background: rgba(251,191,36,0.12); color: #fbbf24; }
    .status-in-progress { background: rgba(59,130,246,0.12); color: #60a5fa; }
    .status-resolved { background: rgba(34,197,94,0.12); color: #4ade80; }
    .status-closed { background: rgba(100,116,139,0.12); color: #94a3b8; }

    .not-found {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: 60vh; gap: 12px; color: #334155;
      mat-icon { font-size: 56px; width: 56px; height: 56px; }
      h2 { color: #475569; margin: 0; }
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(TicketService);

  ticketId = signal<string>('');
  newComment = '';

  ticket = computed(() => this.svc.getById(this.ticketId()));

  statusOptions: { value: TicketStatus; label: string; icon: string }[] = [
    { value: 'open', label: 'Aberto', icon: 'radio_button_checked' },
    { value: 'in-progress', label: 'Em Andamento', icon: 'autorenew' },
    { value: 'resolved', label: 'Resolvido', icon: 'check_circle' },
    { value: 'closed', label: 'Fechado', icon: 'cancel' },
  ];

  ngOnInit() {
    this.ticketId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  updateStatus(status: TicketStatus) {
    this.svc.updateStatus(this.ticketId(), status);
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.svc.addComment(this.ticketId(), this.newComment.trim(), 'Pedro Técnico');
    this.newComment = '';
  }

  initials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }
  categoryLabel(c: string) { return { hardware: 'Hardware', software: 'Software', network: 'Rede', access: 'Acesso', other: 'Outros' }[c] ?? c; }
  priorityLabel(p: string) { return { critical: 'Crítico', high: 'Alto', medium: 'Médio', low: 'Baixo' }[p] ?? p; }
  statusLabel(s: string) { return { open: 'Aberto', 'in-progress': 'Em Andamento', resolved: 'Resolvido', closed: 'Fechado' }[s] ?? s; }
}
