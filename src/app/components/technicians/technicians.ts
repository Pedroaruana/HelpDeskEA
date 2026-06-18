import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TechnicianService } from '../../services/technician.service';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Técnicos</h1>
          <p class="subtitle">{{ svc.technicians().length }} técnico(s) cadastrado(s)</p>
        </div>
        <button class="btn-new" (click)="showForm.set(!showForm())" matRipple>
          <mat-icon>{{ showForm() ? 'close' : 'person_add' }}</mat-icon>
          {{ showForm() ? 'Cancelar' : 'Novo Técnico' }}
        </button>
      </header>

      @if (showForm()) {
        <div class="form-card">
          <h2>Cadastrar Técnico</h2>
          <div class="form-row">
            <div class="field">
              <label>Nome</label>
              <input [(ngModel)]="name" placeholder="Nome completo" />
            </div>
            <div class="field">
              <label>Email</label>
              <input [(ngModel)]="email" type="email" placeholder="email@empresa.com" />
            </div>
            <div class="field">
              <label>Senha provisória</label>
              <input [(ngModel)]="password" type="password" placeholder="Mínimo 6 caracteres" />
            </div>
          </div>
          @if (error()) {
            <p class="error-msg">{{ error() }}</p>
          }
          <button class="btn-save" (click)="save()" [disabled]="saving()" matRipple>
            <mat-icon>{{ saving() ? 'hourglass_empty' : 'save' }}</mat-icon>
            {{ saving() ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      }

      <div class="tech-grid">
        @for (tech of svc.technicians(); track tech.id) {
          <div class="tech-card">
            <div class="tech-avatar">{{ initials(tech.name) }}</div>
            <div class="tech-info">
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-email">{{ tech.email }}</span>
            </div>
            <span class="tech-badge">Técnico</span>
          </div>
        }
        @if (svc.technicians().length === 0) {
          <div class="empty-state">
            <mat-icon>group</mat-icon>
            <p>Nenhum técnico cadastrado ainda</p>
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

    .btn-new {
      display: flex; align-items: center; gap: 8px; padding: 10px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
      box-shadow: 0 4px 15px rgba(99,102,241,0.4); transition: all 0.2s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.6); transform: translateY(-1px); }
    }

    .form-card {
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px;
      padding: 24px; margin-bottom: 24px;
      h2 { font-size: 16px; font-weight: 600; color: var(--text-secondary); margin: 0 0 20px; }
    }

    .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }

    .field {
      display: flex; flex-direction: column; gap: 6px;
      label { font-size: 12px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; }
      input {
        padding: 10px 12px; background: var(--bg-input-deep); border: 1px solid var(--border-md);
        border-radius: 8px; color: var(--text-secondary); font-size: 13px; outline: none;
        transition: border-color 0.2s;
        &:focus { border-color: #6366f1; }
        &::placeholder { color: var(--text-placeholder); }
      }
    }

    .error-msg { font-size: 13px; color: #f87171; margin: 0 0 12px; }

    .btn-save {
      display: flex; align-items: center; gap: 8px; padding: 10px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:not(:disabled):hover { opacity: 0.9; }
    }

    .tech-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

    .tech-card {
      display: flex; align-items: center; gap: 14px;
      background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;
      transition: border-color 0.2s;
      &:hover { border-color: rgba(99,102,241,0.3); }
    }

    .tech-avatar {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 700; color: white;
    }

    .tech-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .tech-name { font-size: 14px; font-weight: 600; color: var(--text-secondary); }
    .tech-email { font-size: 12px; color: var(--text-faint); }

    .tech-badge {
      font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px;
      background: rgba(99,102,241,0.12); color: #818cf8;
    }

    .empty-state {
      grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 10px; padding: 60px; color: var(--text-dim);
      mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.4; }
      p { font-size: 14px; opacity: 0.6; margin: 0; }
    }

    @media (max-width: 768px) {
      .page { padding: 16px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class TechniciansComponent implements OnInit {
  readonly svc = inject(TechnicianService);

  showForm = signal(false);
  saving = signal(false);
  error = signal('');
  name = '';
  email = '';
  password = '';

  ngOnInit() {
    this.svc.loadAll().subscribe();
  }

  save() {
    this.error.set('');
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.error.set('Preencha todos os campos');
      return;
    }
    if (this.password.length < 6) {
      this.error.set('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    this.saving.set(true);
    this.svc.create(this.name.trim(), this.email.trim(), this.password).subscribe({
      next: () => {
        this.name = '';
        this.email = '';
        this.password = '';
        this.saving.set(false);
        this.showForm.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error ?? 'Erro ao salvar técnico');
        this.saving.set(false);
      }
    });
  }

  initials(name: string): string {
    return name.trim().split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase();
  }
}
