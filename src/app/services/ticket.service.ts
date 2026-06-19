import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Ticket, TicketStatus, DashboardStats } from '../models/ticket.model';
import { environment } from '../../environments/environment';

const EMPTY_STATS: DashboardStats = {
  total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0,
  avgResolutionHours: 0, byWeek: [], byCategory: []
};

interface ApiTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  requester: string;
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

function mapTicket(t: ApiTicket): Ticket {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status as TicketStatus,
    priority: t.priority as Ticket['priority'],
    category: t.category as Ticket['category'],
    requester: t.requester,
    assignee: t.assignee ?? undefined,
    createdAt: new Date(t.created_at),
    updatedAt: new Date(t.updated_at),
    comments: [],
  };
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private _tickets = signal<Ticket[]>([]);
  private _stats = signal<DashboardStats>(EMPTY_STATS);
  loading = signal(false);

  tickets = this._tickets.asReadonly();
  stats = this._stats.asReadonly();

  private http = inject(HttpClient);

  loadAll() {
    this.loading.set(true);
    this.http.get<DashboardStats>(`${environment.apiUrl}/stats`).pipe(
      tap(data => this._stats.set(data))
    ).subscribe();
    return this.http.get<ApiTicket[]>(`${environment.apiUrl}/tickets`).pipe(
      tap(data => {
        this._tickets.set(data.map(mapTicket));
        this.loading.set(false);
      })
    ).subscribe({ error: () => this.loading.set(false) });
  }

  getById(id: string): Ticket | undefined {
    return this._tickets().find(t => t.id === id);
  }

  createTicket(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) {
    return this.http.post<ApiTicket>(`${environment.apiUrl}/tickets`, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      requester: data.requester,
      assignee: data.assignee,
    }).pipe(
      tap(created => {
        this._tickets.update(ts => [mapTicket(created), ...ts]);
      })
    );
  }

  updateStatus(id: string, status: TicketStatus) {
    return this.http.patch<ApiTicket>(`${environment.apiUrl}/tickets/${id}`, { status }).pipe(
      tap(updated => {
        this._tickets.update(ts =>
          ts.map(t => t.id === id ? { ...mapTicket(updated), comments: t.comments } : t)
        );
      })
    );
  }

  assignTechnician(id: string, assignee: string | null) {
    return this.http.patch<ApiTicket>(`${environment.apiUrl}/tickets/${id}`, { assignee }).pipe(
      tap(updated => {
        this._tickets.update(ts =>
          ts.map(t => t.id === id ? { ...mapTicket(updated), comments: t.comments } : t)
        );
      })
    );
  }

  deleteTicket(id: string) {
    return this.http.delete(`${environment.apiUrl}/tickets/${id}`).pipe(
      tap(() => this._tickets.update(ts => ts.filter(t => t.id !== id)))
    );
  }

  addComment(id: string, text: string, author: string): void {
    this._tickets.update(tickets =>
      tickets.map(t => t.id === id
        ? { ...t, updatedAt: new Date(), comments: [...t.comments, { id: `c${Date.now()}`, author, text, createdAt: new Date() }] }
        : t
      )
    );
  }
}
