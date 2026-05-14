import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

interface ExperienceEntry {
  id:          string;
  company:     string;
  role:        string;
  period:      string;
  duration:    string;
  description: string;
  tags:        string[];
  logoSrc:     string;
  logoAlt:     string;
  index:       number;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrl:    './experience.component.scss',
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly host       = inject(ElementRef<HTMLElement>);
  private readonly observers: IntersectionObserver[] = [];

  readonly entries: ExperienceEntry[] = [
    {
      id:          'company-one',
      company:     'UEEK Soluções Digitais',
      role:        'Desenvolvedor Web Full-Stack (Estágio)',
      period:      'Jul 2025 – Presente',
      duration:    '11 meses',
      description: 'Desenvolvimento de soluções web inovadoras, aplicando conhecimentos em front-end e back-end para criar aplicações modernas e responsivas.',
      tags:        ['React', 'TypeScript', 'SCSS', 'Laravel', 'Next.js', 'PostgreSQL', 'Git', 'GitHub', 'PHP'],
      logoSrc:     'ueek.jpg',
      logoAlt:     'UEEK Soluções Digitais',
      index:       0,
    },
    {
      id:          'company-two',
      company:     'JBS Seara Alimentos',
      role:        'Suporte de TI (Aprendiz)',
      period:      'Jan 2025 – jun 2025',
      duration:    '5 meses',
      description: 'Atuação na área de suporte de TI, fornecendo assistência técnica, resolução de problemas de hardware e software, suporte em rede e atendimento direto ao usuário final.',
      tags:        ['Suporte de TI', 'Suporte técnico', 'Hardware', 'Rede', 'Windows', 'Atendimento ao cliente'],
      logoSrc:     'seara.png',
      logoAlt:     'JBS Seara Alimentos',
      index:       1,
    },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealAll();
      return;
    }

    this.initReveal();
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
  }

  private revealAll(): void {
    const el = this.host.nativeElement as HTMLElement;
    (el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>).forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    });
    const line = el.querySelector('.exp__timeline-line-fill') as HTMLElement | null;
    if (line) { line.style.transform = 'scaleY(1)'; }
  }

  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;

    // Header reveal
    this.observeGroup(
      el.querySelector('.exp__header') as HTMLElement | null,
      (group) => {
        const items = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(items, { opacity: 0, y: 28 });
        gsap.to(items, {
          opacity:  1,
          y:        0,
          duration: 0.9,
          stagger:  0.12,
          ease:     'power3.out',
        });
      },
    );

    // Timeline line draw
    this.observeGroup(
      el.querySelector('.exp__timeline') as HTMLElement | null,
      (group) => {
        const fill = group.querySelector('.exp__timeline-line-fill') as HTMLElement | null;
        if (fill) {
          gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' });
          gsap.to(fill, {
            scaleY:   1,
            duration: 1.8,
            ease:     'power2.inOut',
            delay:    0.2,
          });
        }

        // Animate each entry
        const entries = group.querySelectorAll('.exp__entry') as NodeListOf<HTMLElement>;
        entries.forEach((entry, i) => {
          const node = entry.querySelector('.exp__node') as HTMLElement | null;
          const card = entry.querySelector('.exp__card') as HTMLElement | null;
          const meta = entry.querySelector('.exp__meta') as HTMLElement | null;
          const delay = 0.3 + i * 0.28;

          if (node) {
            gsap.set(node, { opacity: 0, scale: 0.5 });
            gsap.to(node, {
              opacity:  1,
              scale:    1,
              duration: 0.55,
              ease:     'back.out(2)',
              delay,
            });
          }

          if (card) {
            gsap.set(card, { opacity: 0, x: 24, y: 10 });
            gsap.to(card, {
              opacity:  1,
              x:        0,
              y:        0,
              duration: 0.85,
              ease:     'power3.out',
              delay:    delay + 0.08,
            });
          }

          if (meta) {
            gsap.set(meta, { opacity: 0, x: -18 });
            gsap.to(meta, {
              opacity:  1,
              x:        0,
              duration: 0.7,
              ease:     'power3.out',
              delay:    delay + 0.15,
            });
          }
        });
      },
    );
  }

  private observeGroup(
    el: HTMLElement | null,
    onEnter: (el: HTMLElement) => void,
  ): void {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        onEnter(el);
        obs.disconnect();
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    this.observers.push(obs);
  }
}
