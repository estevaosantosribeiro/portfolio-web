import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EASING } from './shared/animations/animation.utils';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LoadingScreenComponent],
  animations: [
    trigger('pageReveal', [
      state('hidden',  style({ clipPath: 'circle(0% at 50% 42%)', opacity: 0 })),
      state('visible', style({ clipPath: 'circle(150% at 50% 42%)', opacity: 1 })),
      transition('hidden => visible', [
        animate(`950ms 100ms ${EASING.out}`),
      ]),
    ]),
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly loading = signal(true);
  readonly pageState = signal<'hidden' | 'visible'>('hidden');

  onLoadingDone(): void {
    this.loading.set(false);
    // Trigger reveal on next frame so Angular renders the outlet first
    requestAnimationFrame(() => {
      this.pageState.set('visible');
    });
  }
}
