import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const CLIENT_ID_KEY = 'hd-client-id';

function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const headers: Record<string, string> = { 'X-Client-Id': getClientId() };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  req = req.clone({ setHeaders: headers });
  return next(req);
};
