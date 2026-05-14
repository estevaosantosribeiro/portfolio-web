import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, AboutComponent],
  template: `
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
    </main>
  `,
})
export class HomeComponent {}
