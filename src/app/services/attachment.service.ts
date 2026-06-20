import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Attachment } from '../models/ticket.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  private http = inject(HttpClient);
  private _attachments = signal<Attachment[]>([]);
  attachments = this._attachments.asReadonly();

  loadByTicket(ticketId: string) {
    return this.http.get<Attachment[]>(`${environment.apiUrl}/attachments/${ticketId}`).pipe(
      tap(data => this._attachments.set(data))
    );
  }

  upload(ticketId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Attachment>(`${environment.apiUrl}/attachments/${ticketId}`, form).pipe(
      tap(att => this._attachments.update(list => [att, ...list]))
    );
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/attachments/${id}`).pipe(
      tap(() => this._attachments.update(list => list.filter(a => a.id !== id)))
    );
  }

  clear() {
    this._attachments.set([]);
  }
}
