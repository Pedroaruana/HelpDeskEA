import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UIService {
  sidebarOpen = signal(false);
  toggle() { this.sidebarOpen.update(v => !v); }
  close() { this.sidebarOpen.set(false); }
}
