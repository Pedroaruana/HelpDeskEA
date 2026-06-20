import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TicketService } from '../../services/ticket.service';
import { TechnicianService } from '../../services/technician.service';
import { AttachmentService } from '../../services/attachment.service';
import { TicketStatus } from '../../models/ticket.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { TimeAgoPipe } from '../../pipes/ticket-labels.pipe';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, MatIconModule, MatRippleModule, MatDialogModule, TimeAgoPipe],
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
          <button class="btn-delete" (click)="deleteTicket()" matRipple>
            <mat-icon>delete</mat-icon>
            Excluir Chamado
          </button>
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
                <div class="info-item">
                  <mat-icon>timer</mat-icon>
                  <div>
                    <span class="info-label">Tempo aberto</span>
                    <span class="info-value time-ago">{{ ticket()!.createdAt | timeAgo }}</span>
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

            <div class="card attach-card">
              <h3>Anexos ({{ attSvc.attachments().length }})</h3>
              <label class="btn-upload" [class.loading]="uploading()">
                <mat-icon>{{ uploading() ? 'hourglass_empty' : 'upload_file' }}</mat-icon>
                {{ uploading() ? 'Enviando...' : 'Anexar arquivo' }}
                <input type="file" hidden (change)="onFileChange($event)" [disabled]="uploading()" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" />
              </label>
              @if (attSvc.attachments().length > 0) {
                <div class="attach-list">
                  @for (att of attSvc.attachments(); track att.id) {
                    <div class="attach-item">
                      <mat-icon class="attach-icon">{{ fileIcon(att.mimetype) }}</mat-icon>
                      <div class="attach-info">
                        <a [href]="downloadUrl(att.url)" target="_blank" class="attach-name">{{ att.filename }}</a>
                        <span class="attach-size">{{ fileSize(att.size) }}</span>
                      </div>
                      <button class="btn-remove-att" (click)="deleteAttachment(att.id)">
                        <mat-icon>close</mat-icon>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="card assign-card">
              <h3>Técnico Responsável</h3>
              <select class="assign-select" [value]="ticket()!.assignee ?? ''" (change)="onAssign($event)">
                <option value="">Não atribuído</option>
                @for (tech of techSvc.technicians(); track tech.id) {
                  <option [value]="tech.name">{{ tech.name }}</option>
                }
              </select>
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
      font-size: 13px; color: var(--text-faint);
    }
    .back-link {
      display: flex; align-items: center; gap: 4px; color: #6366f1; text-decoration: none;
      &:hover { color: #818cf8; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .sep { font-size: 16px; width: 16px; height: 16px; color: var(--text-dim); }

    .btn-delete {
      margin-left: auto;
      display: flex; align-items: center; gap: 6px;
      padding: 8px 14px; border-radius: 9px;
      border: 1px solid rgba(239,68,68,0.25);
      background: rgba(239,68,68,0.08);
      color: #f87171; font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.5); }
    }

    .detail-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
    .main-col, .side-col { display: flex; flex-direction: column; gap: 16px; }

    .card {
      background: var(--bg-card); border-radius: 14px; border: 1px solid var(--border); padding: 24px;
      transition: background-color 0.25s ease;
    }

    .ticket-header {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 16px;
    }
    .header-left { flex: 1; }
    .ticket-id { font-size: 12px; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.12); padding: 3px 8px; border-radius: 6px; }
    h1 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 8px 0 0; }
    .badges { display: flex; gap: 8px; flex-shrink: 0; }

    .description { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin: 0 0 20px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item {
      display: flex; align-items: flex-start; gap: 10px;
      mat-icon { color: var(--text-faint); font-size: 18px; width: 18px; height: 18px; margin-top: 2px; }
      div { display: flex; flex-direction: column; }
    }
    .info-label { font-size: 11px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; }
    .info-value { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
    .info-value.time-ago { color: #818cf8; font-weight: 600; }

    h2 { font-size: 16px; font-weight: 600; color: var(--text-secondary); margin: 0 0 16px; }
    h3 { font-size: 14px; font-weight: 600; color: var(--text-muted); margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; }

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
    .comment-author { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
    .comment-time { font-size: 11px; color: var(--text-faint); }
    .comment-text { font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.5; }
    .no-comments { font-size: 13px; color: var(--text-dim); }

    .add-comment { display: flex; flex-direction: column; gap: 10px; }
    .comment-input {
      width: 100%; padding: 12px; background: var(--bg-input-deep); border: 1px solid var(--border-md);
      border-radius: 10px; color: var(--text-secondary); font-size: 13px; outline: none; resize: none;
      transition: border-color 0.2s, background-color 0.25s;
      &:focus { border-color: #6366f1; }
      &::placeholder { color: var(--text-placeholder); }
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
      border-radius: 9px; border: 1px solid var(--status-btn-bd);
      background: var(--status-btn-bg); color: var(--text-subtle);
      font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
      mat-icon { font-size: 17px; width: 17px; height: 17px; }

      &.status-open.active, &.status-open:hover { background: rgba(251,191,36,0.12); color: #fbbf24; border-color: rgba(251,191,36,0.2); }
      &.status-in-progress.active, &.status-in-progress:hover { background: rgba(59,130,246,0.12); color: #60a5fa; border-color: rgba(59,130,246,0.2); }
      &.status-resolved.active, &.status-resolved:hover { background: rgba(34,197,94,0.12); color: #4ade80; border-color: rgba(34,197,94,0.2); }
      &.status-closed.active, &.status-closed:hover { background: rgba(100,116,139,0.12); color: #94a3b8; border-color: rgba(100,116,139,0.2); }
    }

    .btn-upload {
      display: flex; align-items: center; gap: 8px; padding: 9px 14px;
      background: var(--bg-base); border: 1px dashed var(--border-md);
      border-radius: 8px; color: var(--text-muted); font-size: 13px; font-weight: 500;
      cursor: pointer; transition: all 0.2s; width: 100%; margin-bottom: 12px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { border-color: #6366f1; color: #818cf8; }
      &.loading { opacity: 0.6; cursor: not-allowed; }
    }

    .attach-list { display: flex; flex-direction: column; gap: 8px; }

    .attach-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 10px; background: var(--bg-base); border-radius: 8px;
      border: 1px solid var(--border);
    }

    .attach-icon { font-size: 18px; width: 18px; height: 18px; color: #6366f1; flex-shrink: 0; }

    .attach-info { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
    .attach-name {
      font-size: 12px; color: #818cf8; text-decoration: none; font-weight: 500;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      &:hover { text-decoration: underline; }
    }
    .attach-size { font-size: 11px; color: var(--text-faint); }

    .btn-remove-att {
      background: none; border: none; color: var(--text-dim); cursor: pointer;
      display: flex; align-items: center; padding: 2px; border-radius: 4px;
      transition: color 0.15s; flex-shrink: 0;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
      &:hover { color: #f87171; }
    }

    .assign-select {
      width: 100%; padding: 10px 12px; background: var(--bg-input-deep);
      border: 1px solid var(--border-md); border-radius: 8px;
      color: var(--text-secondary); font-size: 13px; outline: none; cursor: pointer;
      transition: border-color 0.2s;
      &:focus { border-color: #6366f1; }
    }

    .timeline { display: flex; flex-direction: column; gap: 0; }
    .timeline-item { display: flex; gap: 12px; position: relative; padding-bottom: 16px;
      &:last-child { padding-bottom: 0; }
      &:not(:last-child)::before {
        content: ''; position: absolute; left: 7px; top: 16px; bottom: 0;
        width: 2px; background: var(--timeline-line);
      }
    }
    .tl-dot {
      width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
      &.open { background: #fbbf24; box-shadow: 0 0 8px rgba(251,191,36,0.4); }
      &.in-progress { background: #60a5fa; box-shadow: 0 0 8px rgba(59,130,246,0.4); }
      &.resolved { background: #4ade80; box-shadow: 0 0 8px rgba(34,197,94,0.4); }
    }
    .tl-content { display: flex; flex-direction: column; }
    .tl-label { font-size: 13px; color: var(--text-secondary); }
    .tl-time { font-size: 11px; color: var(--text-faint); }

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
      height: 60vh; gap: 12px; color: var(--text-dim);
      mat-icon { font-size: 56px; width: 56px; height: 56px; }
      h2 { color: var(--text-faint); margin: 0; }
    }
  `]
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(TicketService);
  readonly techSvc = inject(TechnicianService);
  readonly attSvc = inject(AttachmentService);
  private dialog = inject(MatDialog);
  private subscriptions = new Subscription();

  ticketId = signal<string>('');
  newComment = '';

  ticket = computed(() => this.svc.getById(this.ticketId()));

  statusOptions: { value: TicketStatus; label: string; icon: string }[] = [
    { value: 'open', label: 'Aberto', icon: 'radio_button_checked' },
    { value: 'in-progress', label: 'Em Andamento', icon: 'autorenew' },
    { value: 'resolved', label: 'Resolvido', icon: 'check_circle' },
    { value: 'closed', label: 'Fechado', icon: 'cancel' },
  ];

  uploading = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.ticketId.set(id);
    this.techSvc.loadAll().subscribe();
    this.attSvc.loadByTicket(id).subscribe();
  }

  updateStatus(status: TicketStatus) {
    this.svc.updateStatus(this.ticketId(), status).subscribe();
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.attSvc.upload(this.ticketId(), file).subscribe({
      next: () => this.uploading.set(false),
      error: () => this.uploading.set(false),
    });
  }

  deleteAttachment(id: number) {
    this.attSvc.delete(id).subscribe();
  }

  downloadUrl(url: string): string {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }

  fileIcon(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'picture_as_pdf';
    return 'attach_file';
  }

  fileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  onAssign(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.svc.assignTechnician(this.ticketId(), value || null).subscribe();
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.svc.addComment(this.ticketId(), this.newComment.trim(), 'Pedro Técnico');
    this.newComment = '';
  }

  deleteTicket() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Chamado',
        message: `Tem certeza que deseja excluir o chamado ${this.ticketId()}? Esta ação não pode ser desfeita.`,
        confirmLabel: 'Sim, excluir',
        cancelLabel: 'Cancelar'
      },
      panelClass: 'custom-dialog',
      backdropClass: 'custom-backdrop'
    });
    this.subscriptions.add(
      ref.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.svc.deleteTicket(this.ticketId()).subscribe(() => this.router.navigate(['/tickets']));
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initials(name: string): string {
    if (!name?.trim()) return '??';
    return name.trim().split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase();
  }
  categoryLabel(c: string) { return { hardware: 'Hardware', software: 'Software', network: 'Rede', access: 'Acesso', other: 'Outros' }[c] ?? c; }
  priorityLabel(p: string) { return { critical: 'Crítico', high: 'Alto', medium: 'Médio', low: 'Baixo' }[p] ?? p; }
  statusLabel(s: string) { return { open: 'Aberto', 'in-progress': 'Em Andamento', resolved: 'Resolvido', closed: 'Fechado' }[s] ?? s; }
}
