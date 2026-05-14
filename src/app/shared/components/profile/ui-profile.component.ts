import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile" [class.profile--has-avatar]="avatarUrl()">
      <div class="profile__avatar" aria-hidden="true">
        @if (avatarUrl()) {
          <img [src]="avatarUrl()" [alt]="name()" class="profile__img">
        } @else {
          <span class="profile__initial">{{ initial() }}</span>
        }
      </div>
      
      <div class="profile__info">
        <span class="profile__name">{{ name() }}</span>
        @if (verified()) {
          <span class="profile__verified" title="Perfil Verificado">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="var(--color-verified, #3b82f6)"/>
              <path d="M7 12.5L10 15.5L17 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        }
      </div>
    </div>
  `,
  styleUrl: './ui-profile.component.scss',
})
export class UiProfileComponent {
  readonly name      = input.required<string>();
  readonly avatarUrl = input<string | null>(null);
  readonly verified  = input<boolean>(true);

  readonly initial = computed(() => {
    return this.name().charAt(0).toUpperCase();
  });
}
