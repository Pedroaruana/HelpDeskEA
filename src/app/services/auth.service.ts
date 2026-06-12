import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'hd-token';
  private readonly USER_KEY = 'hd-user';

  token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  currentUser = signal<User | null>(this.loadUser());

  isLoggedIn = computed(() => !!this.token());

  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    );
  }

  setSession(token: string, user: User) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
  }

  isTokenValid(): boolean {
    const token = this.token();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return this.token();
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
