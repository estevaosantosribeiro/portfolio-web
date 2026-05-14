import { Component, input } from '@angular/core';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

@Component({
  selector: 'ui-container',
  standalone: true,
  template: `<div [class]="'container container--' + size()"><ng-content></ng-content></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .container {
      width: 100%;
      margin-inline: auto;
      padding-inline: var(--space-4);
    }

    @media (min-width: 640px)  { .container { padding-inline: var(--space-6); } }
    @media (min-width: 768px)  { .container { padding-inline: var(--space-8); } }
    @media (min-width: 1024px) { .container { padding-inline: var(--space-12); } }
    @media (min-width: 1440px) { .container { padding-inline: var(--space-16); } }

    .container--sm   { max-width: 640px; }
    .container--md   { max-width: 768px; }
    .container--lg   { max-width: 1024px; }
    .container--xl   { max-width: 1280px; }
    .container--2xl  { max-width: 1440px; }
    .container--full { max-width: none; }
  `],
})
export class UiContainerComponent {
  readonly size = input<ContainerSize>('xl');
}
