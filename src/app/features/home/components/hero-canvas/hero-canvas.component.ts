import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';
import { effect } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  radius: number;
}

@Component({
  selector: 'app-hero-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="hero-canvas" aria-hidden="true"></canvas>`,
  styles: [`
    :host { display: block; position: absolute; inset: 0; }
    .hero-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  `],
})
export class HeroCanvasComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef    = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly platformId   = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  private ctx?: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private rafId?: number;
  private resizeObserver?: ResizeObserver;

  private readonly PARTICLE_COUNT = 55;
  private readonly CONNECTION_DIST = 130;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d') ?? undefined;
    if (!this.ctx) return;

    this.resize();
    this.initParticles();
    this.loop();

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.initParticles();
    });
    this.resizeObserver.observe(canvas.parentElement!);
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    this.ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private initParticles(): void {
    const canvas = this.canvasRef().nativeElement;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    this.particles = Array.from({ length: this.PARTICLE_COUNT }, () => ({
      x:       Math.random() * w,
      y:       Math.random() * h,
      vx:      (Math.random() - 0.5) * 0.35,
      vy:      (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.4 + 0.1,
      radius:  Math.random() * 1.8 + 0.6,
    }));
  }

  private loop(): void {
    if (!this.ctx) return;

    const canvas  = this.canvasRef().nativeElement;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const isDark  = this.themeService.current() === 'dark';
    const dotColor = isDark ? '240, 237, 232' : '26, 26, 24';

    this.ctx.clearRect(0, 0, w, h);

    // Update + draw particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${dotColor}, ${p.opacity * 0.6})`;
      this.ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx   = a.x - b.x;
        const dy   = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.CONNECTION_DIST) {
          const alpha = (1 - dist / this.CONNECTION_DIST) * 0.12;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(${dotColor}, ${alpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    this.rafId = requestAnimationFrame(() => this.loop());
  }
}
