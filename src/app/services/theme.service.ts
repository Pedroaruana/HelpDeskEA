import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'hd-theme';

  isDark = signal<boolean>(this.load());

  icon = computed(() => (this.isDark() ? 'light_mode' : 'dark_mode'));
  tooltip = computed(() => (this.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro'));

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('light-theme', !dark);
      localStorage.setItem(this.KEY, dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private load(): boolean {
    const saved = localStorage.getItem(this.KEY);
    return saved ? saved === 'dark' : true;
  }
}
