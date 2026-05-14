import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);

  scrollTo(anchor: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const id = anchor.startsWith('#') ? anchor.slice(1) : anchor;
    const target = document.getElementById(id);
    if (!target) return;

    const navbarHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72',
      10,
    );

    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
