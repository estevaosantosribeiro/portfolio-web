import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';
export type ButtonSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="classes"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="disabled()"
      (click)="clicked.emit()"
    >
      <span class="btn__label">
        <ng-content></ng-content>
      </span>
      @if (variant() === 'primary') {
        <span class="btn__arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      }
      <span class="btn__fill" aria-hidden="true"></span>
    </button>
  `,
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  readonly variant   = input<ButtonVariant>('primary');
  readonly size      = input<ButtonSize>('md');
  readonly disabled  = input<boolean>(false);
  readonly ariaLabel = input<string>('');

  readonly clicked = output<void>();

  get classes(): string {
    return ['btn', `btn--${this.variant()}`, `btn--${this.size()}`].join(' ');
  }
}
