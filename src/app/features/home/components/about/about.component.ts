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

interface Experience {
  id:          string;
  title:       string;
  role:        string;
  description: string;
  tag:         string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl:    './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly host       = inject(ElementRef<HTMLElement>);
  private readonly observers: IntersectionObserver[] = [];

  readonly experiences: Experience[] = [
    {
      id:          'semear',
      title:       'Semear',
      role:        'Educador voluntário',
      description: 'Ensinei informática e lógica de programação para crianças e adolescentes em situação de vulnerabilidade, desenvolvendo habilidades de comunicação, didática e impacto social real.',
      tag:         'Educação & Impacto',
    },
    {
      id:          'reuni',
      title:       'Reuni',
      role:        'Competidor',
      description: 'Participei de uma das maiores competições universitárias de empreendedorismo do Brasil, desenvolvendo pitch, validação de mercado e visão estratégica de produto.',
      tag:         'Empreendedorismo',
    },
    {
      id:          'startup-weekend',
      title:       'Startup Weekend',
      role:        'Co-fundador',
      description: 'Em 54 horas construímos um produto do zero — da ideia ao protótipo. Aprendi a priorizar, iterar rápido e colaborar sob pressão em um ambiente de alto ritmo.',
      tag:         'Inovação',
    },
  ];

  // Duplicated twice for seamless CSS marquee loop
  readonly skills: string[] = [
    'Angular', 'React', 'Next.js', 'TypeScript', 'JavaScript',
    'C#', '.NET', 'Node.js', 'Laravel', 'PHP',
    'MySQL', 'React Native', 'Flutter', 'Git', 'Docker',
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

  // ─── Instant reveal for reduced-motion ────────────────────────────────────
  private revealAll(): void {
    const el = this.host.nativeElement as HTMLElement;
    (el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>).forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    });
  }

  // ─── Scroll-triggered GSAP reveals ────────────────────────────────────────
  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;

    // Content column: label → heading → body → experiences
    this.observeGroup(
      el.querySelector('.about__content') as HTMLElement | null,
      (group) => {
        const items = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(items, { opacity: 0, y: 30 });
        gsap.to(items, {
          opacity:  1,
          y:        0,
          duration: 0.85,
          stagger:  0.11,
          ease:     'power3.out',
        });
      },
    );

    // Image card + badges
    this.observeGroup(
      el.querySelector('.about__visual') as HTMLElement | null,
      (group) => {
        const card = group.querySelector('.about__image-card') as HTMLElement | null;
        if (!card) return;

        gsap.set(card, { opacity: 0, scale: 0.96, y: 28 });
        gsap.to(card, {
          opacity:  1,
          scale:    1,
          y:        0,
          duration: 1.05,
          ease:     'power3.out',
        });

        const badges = group.querySelectorAll('.about__badge') as NodeListOf<HTMLElement>;
        gsap.set(badges, { opacity: 0, scale: 0.8, y: 10 });
        gsap.to(badges, {
          opacity:  1,
          scale:    1,
          y:        0,
          duration: 0.55,
          stagger:  0.09,
          ease:     'back.out(1.6)',
          delay:    0.45,
        });
      },
    );

    // Marquee label
    this.observeGroup(
      el.querySelector('.about__skills') as HTMLElement | null,
      (group) => {
        const label = group.querySelector('.about__skills-label') as HTMLElement | null;
        if (label) {
          gsap.set(label, { opacity: 0, y: 16 });
          gsap.to(label, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        }
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
      { threshold: 0.08 },
    );
    obs.observe(el);
    this.observers.push(obs);
  }
}
