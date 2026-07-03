import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TicketService } from '../../services/ticket.service';
import { TicketPriority, TicketCategory } from '../../models/ticket.model';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [RouterLink, FormsModule, MatIconModule, MatRippleModule],
  template: `
    <div class="page">
      <div class="breadcrumb">
        <a routerLink="/tickets" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          Chamados
        </a>
        <mat-icon class="sep">chevron_right</mat-icon>
        <span>Novo Chamado</span>
      </div>

      <div class="form-container">
        <div class="form-header">
          <div class="header-icon"><mat-icon>add_circle</mat-icon></div>
          <div>
            <h1>Abrir Novo Chamado</h1>
            <p>Preencha as informações abaixo para registrar o chamado</p>
          </div>
        </div>

        <form class="form-card" (ngSubmit)="submit()">
          <div class="form-group">
            <label>Título do Chamado <span class="required">*</span></label>
            <input class="form-input" [(ngModel)]="form.title" name="title"
              placeholder="Descreva brevemente o problema..." required maxlength="100" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Solicitante <span class="required">*</span></label>
              <input class="form-input" [(ngModel)]="form.requester" name="requester"
                placeholder="Nome do solicitante..." required maxlength="60" />
            </div>
            <div class="form-group">
              <label>Responsável</label>
              <input class="form-input" [(ngModel)]="form.assignee" name="assignee"
                placeholder="Técnico responsável..." />
            </div>
          </div>

          <div class="form-group">
            <label>Descrição detalhada <span class="required">*</span></label>
            <textarea class="form-input" [(ngModel)]="form.description" name="description"
              placeholder="Descreva o problema com detalhes..." rows="4" required maxlength="1000"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Categoria <span class="required">*</span></label>
              <div class="option-grid">
                @for (cat of categories; track cat.value) {
                  <button type="button" class="option-btn"
                    [class.selected]="form.category === cat.value"
                    (click)="form.category = cat.value" matRipple>
                    <mat-icon class="{{ cat.value }}">{{ cat.icon }}</mat-icon>
                    {{ cat.label }}
                  </button>
                }
              </div>
            </div>

            <div class="form-group">
              <label>Prioridade <span class="required">*</span></label>
              <div class="priority-grid">
                @for (p of priorities; track p.value) {
                  <button type="button" class="priority-btn priority-{{ p.value }}"
                    [class.selected]="form.priority === p.value"
                    (click)="form.priority = p.value" matRipple>
                    <mat-icon>{{ p.icon }}</mat-icon>
                    {{ p.label }}
                  </button>
                }
              </div>
            </div>
          </div>

          @if (error()) {
            <div class="alert-error">
              <mat-icon>error_outline</mat-icon>
              {{ error() }}
            </div>
          }

          <div class="form-actions">
            <a routerLink="/tickets" class="btn-cancel" matRipple>Cancelar</a>
            <button type="submit" class="btn-submit" [disabled]="!isValid() || submitting()" matRipple>
              <mat-icon>send</mat-icon>
              Abrir Chamado
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }

    .breadcrumb {
      display: flex; align-items: center; gap: 8px; margin-bottom: 32px;
      font-size: 13px; color: var(--text-faint);
    }
    .back-link {
      display: flex; align-items: center; gap: 4px; color: #6366f1; text-decoration: none;
      &:hover { color: #818cf8; }
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .sep { font-size: 16px; width: 16px; height: 16px; color: var(--text-dim); }

    .form-container { max-width: 800px; margin: 0 auto; }

    .form-header {
      display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
      .header-icon {
        width: 52px; height: 52px; border-radius: 14px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        display: flex; align-items: center; justify-content: center;
        mat-icon { font-size: 28px; width: 28px; height: 28px; color: white; }
      }
      h1 { font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 0; }
      p { color: var(--text-subtle); margin: 4px 0 0; font-size: 13px; }
    }

    .form-card {
      background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); padding: 28px;
      display: flex; flex-direction: column; gap: 20px;
      transition: background-color 0.25s ease;
    }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    .form-group { display: flex; flex-direction: column; gap: 8px; }

    label { font-size: 13px; font-weight: 500; color: var(--text-muted); }
    .required { color: #f87171; }

    .form-input {
      padding: 11px 14px; background: var(--bg-input-deep);
      border: 1px solid var(--border-md); border-radius: 10px;
      color: var(--text-secondary); font-size: 14px; outline: none; width: 100%; resize: vertical;
      transition: border-color 0.2s, background-color 0.25s;
      &:focus { border-color: #6366f1; }
      &::placeholder { color: var(--text-placeholder); }
    }

    .option-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .option-btn {
      display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px;
      background: var(--bg-input-deep); border: 1px solid var(--border-md); border-radius: 10px;
      color: var(--text-subtle); font-size: 12px; cursor: pointer; transition: all 0.15s;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      .hardware { color: #fb923c; } .software { color: #818cf8; }
      .network { color: #60a5fa; } .access { color: #4ade80; } .other { color: #94a3b8; }
      &.selected { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: #c7d2fe; }
      &:hover:not(.selected) { border-color: var(--border-md); color: var(--text-muted); }
    }

    .priority-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .priority-btn {
      display: flex; align-items: center; gap: 8px; padding: 11px 14px;
      background: var(--bg-input-deep); border: 1px solid var(--border-md); border-radius: 10px;
      font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }

      &.priority-critical { color: var(--text-subtle);
        &.selected, &:hover { background: rgba(239,68,68,0.12); color: #f87171; border-color: rgba(239,68,68,0.3); } }
      &.priority-high { color: var(--text-subtle);
        &.selected, &:hover { background: rgba(251,146,60,0.12); color: #fb923c; border-color: rgba(251,146,60,0.3); } }
      &.priority-medium { color: var(--text-subtle);
        &.selected, &:hover { background: rgba(251,191,36,0.12); color: #fbbf24; border-color: rgba(251,191,36,0.3); } }
      &.priority-low { color: var(--text-subtle);
        &.selected, &:hover { background: rgba(100,116,139,0.12); color: #94a3b8; border-color: rgba(100,116,139,0.3); } }
    }

    .alert-error {
      display: flex; align-items: center; gap: 8px;
      background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
      border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #f87171; margin-top: 16px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    }

    .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }

    .btn-cancel {
      padding: 11px 22px; border-radius: 10px; background: var(--cancel-btn-bg);
      border: 1px solid var(--cancel-btn-bd); color: var(--text-subtle); text-decoration: none;
      font-size: 14px; font-weight: 500; transition: color 0.15s;
      &:hover { color: var(--text-muted); }
    }

    .btn-submit {
      display: flex; align-items: center; gap: 8px; padding: 11px 24px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
      box-shadow: 0 4px 15px rgba(99,102,241,0.4); transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
      &:not(:disabled):hover { box-shadow: 0 6px 20px rgba(99,102,241,0.6); transform: translateY(-1px); }
    }
  `]
})
export class NewTicketComponent {
  private svc = inject(TicketService);
  private router = inject(Router);

  form = {
    title: '',
    description: '',
    requester: '',
    assignee: '',
    priority: 'medium' as TicketPriority,
    category: 'hardware' as TicketCategory,
  };

  categories = [
    { value: 'hardware' as TicketCategory, label: 'Hardware', icon: 'memory' },
    { value: 'software' as TicketCategory, label: 'Software', icon: 'code' },
    { value: 'network' as TicketCategory, label: 'Rede', icon: 'wifi' },
    { value: 'access' as TicketCategory, label: 'Acesso', icon: 'lock' },
    { value: 'other' as TicketCategory, label: 'Outros', icon: 'more_horiz' },
  ];

  priorities = [
    { value: 'critical' as TicketPriority, label: 'Crítico', icon: 'warning' },
    { value: 'high' as TicketPriority, label: 'Alto', icon: 'arrow_upward' },
    { value: 'medium' as TicketPriority, label: 'Médio', icon: 'remove' },
    { value: 'low' as TicketPriority, label: 'Baixo', icon: 'arrow_downward' },
  ];

  error = signal('');
  submitting = signal(false);

  isValid() { return this.form.title.trim() && this.form.description.trim() && this.form.requester.trim(); }

  submit() {
    if (!this.isValid()) return;
    this.error.set('');
    this.submitting.set(true);
    this.svc.createTicket({
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      requester: this.form.requester.trim(),
      assignee: this.form.assignee.trim() || undefined,
      priority: this.form.priority,
      category: this.form.category,
      status: 'open',
    }).subscribe({
      next: ticket => this.router.navigate(['/tickets', ticket.id]),
      error: err => {
        this.submitting.set(false);
        this.error.set(err.error?.error || 'Erro ao criar chamado. Tente novamente.');
      },
    });
  }
}
