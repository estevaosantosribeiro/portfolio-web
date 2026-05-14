import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  AfterViewInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../core/services/scroll.service';
import { gsap } from 'gsap';

interface NavLink {
  label: string;
  anchor: string;
}

interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'instagram' | 'email';
}

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host       = inject(ElementRef<HTMLElement>);
  private readonly scrollSvc  = inject(ScrollService);
  private observer?: IntersectionObserver;

  readonly year = new Date().getFullYear();

  readonly links: NavLink[] = [
    { label: 'Início',      anchor: '#inicio'     },
    { label: 'Sobre',       anchor: '#sobre'       },
    { label: 'Experiência', anchor: '#experiencia' },
    { label: 'Formação',    anchor: '#formacao'    },
    { label: 'Projetos',    anchor: '#projetos'    },
    { label: 'Contato',     anchor: '#contato'     },
  ];

  readonly socials: SocialLink[] = [
    { label: 'GitHub',    url: 'https://github.com',    icon: 'github'    },
    { label: 'LinkedIn',  url: 'https://linkedin.com',  icon: 'linkedin'  },
    { label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { label: 'E-mail',    url: 'mailto:estevaosantosribeiro@gmail.com', icon: 'email' },
  ];

  scrollTo(anchor: string): void {
    this.scrollSvc.scrollTo(anchor);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealAll();
      return;
    }
    this.initReveal();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private revealAll(): void {
    const el = this.host.nativeElement as HTMLElement;
    (el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>).forEach(n => {
      n.style.opacity = '1';
      n.style.transform = 'none';
    });
  }

  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;
    const targets = el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
    gsap.set(targets, { opacity: 0, y: 20 });

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(targets, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' });
        this.observer?.disconnect();
      },
      { threshold: 0.1 },
    );
    this.observer.observe(el);
  }
}
