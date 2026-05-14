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

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status?: string;
  imageSrc: string;
  imageAlt: string;
  liveUrl?: string;
  repoUrl?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly observers: IntersectionObserver[] = [];

  readonly projects: Project[] = [
    {
      id: 'project-one',
      title: 'Projeto Alpha',
      description: 'Plataforma web moderna com foco em experiência do usuário e alta performance. Interface construída com atenção aos detalhes e fluxos intuitivos.',
      tags: ['Angular', 'TypeScript', 'SCSS'],
      status: 'Em produção',
      imageSrc: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
      imageAlt: 'Screenshot do Projeto Alpha',
      liveUrl: '#',
      repoUrl: '#',
    },
    {
      id: 'project-two',
      title: 'Projeto Beta',
      description: 'Sistema de gestão com dashboard analítico, autenticação segura e API RESTful robusta integrada ao front-end.',
      tags: ['React', 'Node.js', 'TypeScript'],
      status: 'Em desenvolvimento',
      imageSrc: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      imageAlt: 'Screenshot do Projeto Beta',
      liveUrl: '#',
      repoUrl: '#',
    },
    {
      id: 'project-three',
      title: 'Projeto Gamma',
      description: 'Aplicação full-stack com arquitetura limpa, cobertura de testes e deploy automatizado via CI/CD.',
      tags: ['.NET', 'Angular', 'SQL'],
      imageSrc: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
      imageAlt: 'Screenshot do Projeto Gamma',
      repoUrl: '#',
    },
    {
      id: 'project-four',
      title: 'Projeto Delta',
      description: 'E-commerce com catálogo dinâmico, carrinho de compras, integração de pagamentos e painel administrativo.',
      tags: ['Laravel', 'Vue.js', 'MySQL'],
      status: 'Concluído',
      imageSrc: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
      imageAlt: 'Screenshot do Projeto Delta',
      liveUrl: '#',
      repoUrl: '#',
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
  }

  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;

    this.observeGroup(
      el.querySelector('.proj__header') as HTMLElement | null,
      (group) => {
        const items = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
        });
      },
    );

    this.observeGroup(
      el.querySelector('.proj__grid') as HTMLElement | null,
      (group) => {
        const cards = group.querySelectorAll('.proj__card') as NodeListOf<HTMLElement>;
        gsap.set(cards, { opacity: 0, y: 32 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
        });
      },
    );
  }

  private observeGroup(el: HTMLElement | null, onEnter: (el: HTMLElement) => void): void {
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
