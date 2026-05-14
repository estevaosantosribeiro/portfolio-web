import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly current = signal<Theme>('light');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = localStorage.getItem('theme') as Theme | null;
    const preferred: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    this.apply(stored ?? preferred);
  }

  toggle(): void {
    this.apply(this.current() === 'light' ? 'dark' : 'light');
  }

  private apply(theme: Theme): void {
    this.current.set(theme);

    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    requestAnimationFrame(() => {
      setTimeout(() => root.classList.remove('theme-transitioning'), 450);
    });
  }
}
