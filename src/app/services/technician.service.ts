import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Technician } from '../models/ticket.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TechnicianService {
  private http = inject(HttpClient);
  private _technicians = signal<Technician[]>([]);
  technicians = this._technicians.asReadonly();

  loadAll() {
    return this.http.get<Technician[]>(`${environment.apiUrl}/technicians`).pipe(
      tap(data => this._technicians.set(data))
    );
  }

  create(name: string, email: string, password: string) {
    return this.http.post<Technician>(`${environment.apiUrl}/technicians`, { name, email, password }).pipe(
      tap(tech => this._technicians.update(ts => [...ts, tech]))
    );
  }
}
