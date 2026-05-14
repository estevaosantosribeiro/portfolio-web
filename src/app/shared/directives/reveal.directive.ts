import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly delay  = input<number>(0, { alias: 'revealDelay' });
  readonly offset = input<number>(0.15, { alias: 'revealOffset' });

  private readonly el         = inject(ElementRef<HTMLElement>);
  private readonly renderer   = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.el.nativeElement;
    this.renderer.setStyle(el, 'opacity', '0');
    this.renderer.setStyle(el, 'transform', 'translateY(28px)');
    this.renderer.setStyle(el, 'transition', `opacity 600ms cubic-bezier(0, 0, 0.2, 1) ${this.delay()}ms, transform 600ms cubic-bezier(0, 0, 0.2, 1) ${this.delay()}ms`);

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.renderer.setStyle(el, 'opacity', '1');
        this.renderer.setStyle(el, 'transform', 'translateY(0)');
        this.observer?.unobserve(el);
      },
      { threshold: this.offset() },
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
