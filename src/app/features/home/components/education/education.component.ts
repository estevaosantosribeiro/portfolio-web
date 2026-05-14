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
      institution: 'Universidade Placeholder',
      degree:      'Bacharelado em Ciência da Computação',
      period:      '2022 – presente',
      status:      'Em andamento',
      description: 'Formação acadêmica em ciência da computação com ênfase em engenharia de software, estruturas de dados, algoritmos e desenvolvimento de sistemas. Aqui você pode detalhar os aprendizados mais relevantes e o que esse curso representa na sua jornada.',
      topics:      ['Algoritmos', 'Estruturas de Dados', 'Engenharia de Software', 'Banco de Dados'],
      achievement: 'Melhor projeto do semestre',
      logoSrc:     '/assets/logos/university.png',
      logoAlt:     'Logo da universidade',
    },
    {
      id:          'academy',
      kind:        'academy',
      institution: 'Academia do Programador',
      degree:      'Desenvolvimento Web Full-Stack',
      period:      '2023',
      status:      'Concluído',
      description: 'Formação intensiva e prática em desenvolvimento web moderno, cobrindo as principais tecnologias do mercado com projetos reais e mentoria especializada.',
      topics:      ['Angular', 'React', 'Node.js', 'TypeScript'],
      logoSrc:     '/assets/logos/academia.png',
      logoAlt:     'Logo Academia do Programador',
    },
    {
      id:          'tech',
      kind:        'tech',
      institution: 'Instituição Técnica',
      degree:      'Técnico em Desenvolvimento de Sistemas',
      period:      '2020 – 2022',
      status:      'Concluído',
      description: 'Curso técnico com base sólida em lógica de programação, desenvolvimento de sistemas e fundamentos de banco de dados. Primeiro contato formal com engenharia de software.',
      topics:      ['Lógica de Programação', 'PHP', 'MySQL', 'Java'],
      logoSrc:     '/assets/logos/tech-school.png',
      logoAlt:     'Logo da instituição técnica',
    },
  ];

  readonly marqueeLogos: MarqueeLogo[] = [
    { name: 'Universidade',         logoSrc: '/assets/logos/university.png',  alt: 'Universidade' },
    { name: 'Academia do Programador', logoSrc: '/assets/logos/academia.png', alt: 'Academia do Programador' },
    { name: 'Instituição Técnica',  logoSrc: '/assets/logos/tech-school.png', alt: 'Instituição Técnica' },
    { name: 'Coursera',             logoSrc: '/assets/logos/coursera.png',     alt: 'Coursera' },
    { name: 'Udemy',                logoSrc: '/assets/logos/udemy.png',        alt: 'Udemy' },
    { name: 'Alura',                logoSrc: '/assets/logos/alura.png',        alt: 'Alura' },
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
