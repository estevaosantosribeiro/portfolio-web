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

export interface EducationEntry {
  id:           string;
  kind:         'university' | 'academy' | 'tech';
  institution:  string;
  degree:       string;
  period:       string;
  status:       string;
  description:  string;
  topics:       string[];
  achievement?: string;
  logoSrc:      string;
  logoAlt:      string;
}

export interface MarqueeLogo {
  name:    string;
  logoSrc: string;
  alt:     string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './education.component.html',
  styleUrl:    './education.component.scss',
})
export class EducationComponent implements AfterViewInit, OnDestroy {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly host       = inject(ElementRef<HTMLElement>);
  private readonly observers:  IntersectionObserver[] = [];

  readonly entries: EducationEntry[] = [
    {
      id:          'university',
      kind:        'university',
      institution: 'UNIPLAC',
      degree:      'Bacharelado em Sistemas de Informação',
      period:      'fev 2025 – dez 2028',
      status:      'Em andamento',
      description: 'Na graduação, utilizo Git e GitHub para controle de versão, além de desenvolver projetos com HTML, CSS e JavaScript.',
      topics:      ['Git', 'GitHub', 'HTML', 'CSS', 'JavaScript'],
      logoSrc:     'uniplac.png',
      logoAlt:     'Logo UNIPLAC',
    },
    {
      id:          'tech',
      kind:        'tech',
      institution: 'IFSC',
      degree:      'Técnico em Informática para Internet',
      period:      'jan 2023 – fev 2025',
      status:      'Concluído',
      description: 'Durante o curso adquiri conhecimento prático em desenvolvimento web com Laravel, MySQL e React, além da aplicação de metodologias ágeis como Scrum.',
      topics:      ['Laravel', 'MySQL', 'React', 'Scrum'],
      logoSrc:     'ifsc.png',
      logoAlt:     'Logo IFSC',
    },
    {
      id:          'academy',
      kind:        'academy',
      institution: 'Academia do Programador',
      degree:      'Turma Full-Stack',
      period:      'mar 2025 – dez 2025',
      status:      'Concluído',
      description: 'Desenvolvi habilidades em C#, ASP.NET e programação orientada a objetos, com foco no desenvolvimento web. Comprometimento é um dos pilares centrais desta formação.',
      topics:      ['C#', 'ASP.NET', 'OOP', 'Web Development'],
      logoSrc:     'academia.jpg',
      logoAlt:     'Logo Academia do Programador',
    },
  ];

  readonly marqueeLogos: MarqueeLogo[] = [
    { name: 'UNIPLAC',                 logoSrc: 'uniplac.png', alt: 'UNIPLAC' },
    { name: 'IFSC',                    logoSrc: 'ifsc.png',    alt: 'IFSC' },
    { name: 'Academia do Programador', logoSrc: 'academia.jpg', alt: 'Academia do Programador' },
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
    const path = el.querySelector('.edu__connector-path') as SVGPathElement | null;
    if (path) {
      path.style.strokeDashoffset = '0';
      path.style.opacity = '1';
    }
  }

  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;

    // Header
    this.observeGroup(
      el.querySelector('.edu__header') as HTMLElement | null,
      (group) => {
        const items = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(items, { opacity: 0, y: 32 });
        gsap.to(items, {
          opacity: 1, y: 0,
          duration: 1,
          stagger: 0.13,
          ease: 'power3.out',
        });
      },
    );

    // Grid — cards staggered by index
    this.observeGroup(
      el.querySelector('.edu__grid') as HTMLElement | null,
      (group) => {
        // Draw SVG connector first
        const path = group.querySelector('.edu__connector-path') as SVGPathElement | null;
        if (path) {
          const len = path.getTotalLength?.() ?? 600;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power2.inOut',
            delay: 0.1,
          });
        }

        // Cards staggered
        const cards = group.querySelectorAll('.edu__card') as NodeListOf<HTMLElement>;
        cards.forEach((card, i) => {
          const dy = i % 2 === 0 ? 36 : 28;
          gsap.set(card, { opacity: 0, y: dy });
          gsap.to(card, {
            opacity: 1, y: 0,
            duration: 0.95,
            ease: 'power3.out',
            delay: 0.2 + i * 0.18,
          });
        });

        // Float accent orbs gently
        const orbs = group.querySelectorAll('.edu__float-accent') as NodeListOf<HTMLElement>;
        orbs.forEach((orb, i) => {
          gsap.set(orb, { opacity: 0, scale: 0.7 });
          gsap.to(orb, {
            opacity: 1, scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.6 + i * 0.2,
          });
        });
      },
    );

    // Marquee label
    this.observeGroup(
      el.querySelector('.edu__marquee-section') as HTMLElement | null,
      (group) => {
        const label = group.querySelector('.edu__marquee-label') as HTMLElement | null;
        if (label) {
          gsap.set(label, { opacity: 0, y: 14 });
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
      { threshold: 0.06 },
    );
    obs.observe(el);
    this.observers.push(obs);
  }
}
