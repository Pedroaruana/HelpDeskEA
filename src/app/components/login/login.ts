import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand">
          <div class="brand-icon">
            <mat-icon>support_agent</mat-icon>
          </div>
          <div>
            <h1>HelpDesk EA</h1>
            <span>EA Solutions — Suporte T.I</span>
          </div>
        </div>

        <form class="form" (ngSubmit)="submit()">
          <h2>Entrar</h2>

          @if (error()) {
            <div class="alert-error">
              <mat-icon>error_outline</mat-icon>
              {{ error() }}
            </div>
          }

          <div class="field">
            <label>E-mail</label>
            <div class="input-wrap">
              <mat-icon>mail</mat-icon>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="seu@email.com"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <div class="field">
            <label>Senha</label>
            <div class="input-wrap">
              <mat-icon>lock</mat-icon>
              <input
                [type]="showPass() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button type="button" class="eye-btn" (click)="showPass.update(v => !v)">
                <mat-icon>{{ showPass() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="loading()" matRipple>
            @if (loading()) {
              <span class="spinner"></span>
              Entrando...
            } @else {
              <mat-icon>login</mat-icon>
              Entrar
            }
          </button>
        </form>

        <p class="hint">
          <mat-icon>info</mat-icon>
          Demo: pedro&#64;helpdeskea.com / 123456
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-base);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 40px 36px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.25);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 32px;
    }

    .brand-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(99,102,241,0.4);
      flex-shrink: 0;
      mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; }
    }

    .brand h1 {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      line-height: 1;
    }

    .brand span {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 3px;
      display: block;
    }

    .form h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 20px;
    }

    .alert-error {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      color: #f87171;
      margin-bottom: 16px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;

      label {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-muted);
      }
    }

    .input-wrap {
      display: flex;
      align-items: center;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0 12px;
      gap: 10px;
      transition: border-color 0.15s;

      &:focus-within { border-color: #6366f1; }

      mat-icon:first-child {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-faint);
        flex-shrink: 0;
      }

      input {
        flex: 1;
        background: none;
        border: none;
        outline: none;
        padding: 12px 0;
        font-size: 14px;
        color: var(--text-primary);
        font-family: inherit;
        &::placeholder { color: var(--text-placeholder); }
      }
    }

    .eye-btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: var(--text-faint);
      padding: 0;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { color: var(--text-muted); }
    }

    .btn-login {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      transition: opacity 0.2s, transform 0.15s;
      font-family: inherit;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }

      &:hover:not(:disabled) { transform: translateY(-1px); opacity: 0.92; }
      &:disabled { opacity: 0.6; cursor: default; }
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-dim);
      margin: 20px 0 0;
      text-align: center;
      justify-content: center;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPass = signal(false);

  submit() {
    if (!this.email || !this.password) {
      this.error.set('Preencha e-mail e senha.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      next: ({ token, user }) => {
        this.auth.setSession(token, user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.error || 'Erro ao conectar com o servidor.');
      },
    });
  }
}
