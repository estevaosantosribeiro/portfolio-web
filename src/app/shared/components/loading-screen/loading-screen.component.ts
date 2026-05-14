import { Component, output, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EASING } from '../../animations/animation.utils';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('screenExit', [
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      state('hidden',  style({ opacity: 0, transform: 'scale(1.08)' })),
      transition('visible => hidden', [
        animate(`750ms ${EASING.default}`),
      ]),
    ]),
  ],
  templateUrl: './loading-screen.component.html',
  styleUrl:    './loading-screen.component.scss',
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  readonly done = output<void>();

  readonly state = signal<'visible' | 'hidden'>('visible');

  private emitted = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.state.set('hidden');
    }, 2200);
  }

  ngOnDestroy(): void {
    this.emitted = true;
  }

  onAnimationDone(): void {
    if (this.state() === 'hidden' && !this.emitted) {
      this.emitted = true;
      this.done.emit();
    }
  }
}
