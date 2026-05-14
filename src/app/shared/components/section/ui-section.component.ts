import { Component, input } from '@angular/core';
import { UiContainerComponent } from '../container/ui-container.component';

@Component({
  selector: 'ui-section',
  standalone: true,
  imports: [UiContainerComponent],
  template: `
    <section [id]="id() || null" [class]="sectionClasses">
      <ui-container [size]="containerSize()">
        <ng-content></ng-content>
      </ui-container>
    </section>
  `,
  styleUrl: './ui-section.component.scss',
})
export class UiSectionComponent {
  readonly id            = input<string>('');
  readonly padded        = input<boolean>(true);
  readonly containerSize = input<'sm' | 'md' | 'lg' | 'xl' | 'full'>('xl');

  get sectionClasses(): string {
    return ['section', this.padded() ? 'section--padded' : ''].filter(Boolean).join(' ');
  }
}
