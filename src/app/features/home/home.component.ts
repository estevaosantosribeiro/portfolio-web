import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { EducationComponent } from './components/education/education.component';
import { ProjectsComponent } from './components/projects/projects.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, AboutComponent, ExperienceComponent, EducationComponent, ProjectsComponent],
  template: `
    <main>
      <app-hero></app-hero>
      <app-about></app-about>
      <app-experience></app-experience>
      <app-education></app-education>
      <app-projects></app-projects>
    </main>
  `,
})
export class HomeComponent {}
