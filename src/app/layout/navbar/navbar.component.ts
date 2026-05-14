import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  HostListener,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { UiButtonComponent } from '../../shared/components/button/ui-button.component';
import { UiContainerComponent } from '../../shared/components/container/ui-container.component';
import { UiProfileComponent } from '../../shared/components/profile/ui-profile.component';

interface NavLink {
  label: string;
  anchor: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButtonComponent, UiContainerComponent, UiProfileComponent],
  templateUrl: './navbar.component.html',
  styleUrl:    './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly themeService       = inject(ThemeService);

  readonly scrolled     = signal(false);
  readonly menuOpen     = signal(false);

  readonly links: NavLink[] = [
    { label: 'Início',     anchor: '#inicio' },
    { label: 'Sobre',    anchor: '#sobre' },
    { label: 'Experiência',  anchor: '#experiencia'},
    { label: 'Formação',   anchor: '#formacao'},
    { label: 'Projetos', anchor: '#projetos' },
    { label: 'Contato',  anchor: '#contato' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrolled.set(window.scrollY > 20);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.scrolled.set(window.scrollY > 20);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
