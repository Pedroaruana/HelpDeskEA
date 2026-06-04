import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatRippleModule],
  template: `
    <div class="dialog">
      <div class="dialog-icon">
        <mat-icon>delete_forever</mat-icon>
      </div>
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message">{{ data.message }}</p>
      <div class="dialog-actions">
        <button class="btn-cancel" (click)="cancel()" matRipple>
          {{ data.cancelLabel ?? 'Cancelar' }}
        </button>
        <button class="btn-confirm" (click)="confirm()" matRipple>
          <mat-icon>delete</mat-icon>
          {{ data.confirmLabel ?? 'Excluir' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog {
      background: #1e293b;
      border-radius: 16px;
      padding: 32px 28px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 380px;
    }

    .dialog-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(239, 68, 68, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #f87171;
      }
    }

    .dialog-title {
      font-size: 18px;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 10px;
    }

    .dialog-message {
      font-size: 14px;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 28px;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      width: 100%;
    }

    .btn-cancel {
      flex: 1;
      padding: 11px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      &:hover { color: #94a3b8; }
    }

    .btn-confirm {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 11px;
      border-radius: 10px;
      border: none;
      background: #ef4444;
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: #dc2626; }
    }
  `]
})
export class ConfirmDialogComponent {
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  confirm() { this.dialogRef.close(true); }
  cancel() { this.dialogRef.close(false); }
}
