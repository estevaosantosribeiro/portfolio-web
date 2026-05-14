import { Component, output, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EASING } from '../../animations/animation.utils';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('screenExit', [
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      state('hidden',  style({ opacity: 0, transform: 'scale(1.08)', pointerEvents: 'none' })),
      transition('visible => hidden', [
        animate(`750ms ${EASING.default}`),
      ]),
    ]),
  ],
  templateUrl: './loading-screen.component.html',
  styleUrl:    './loading-screen.component.scss',
})
export class LoadingScreenComponent implements OnInit {
  readonly done = output<void>();

  readonly state = signal<'visible' | 'hidden'>('visible');

  ngOnInit(): void {
    setTimeout(() => {
      this.state.set('hidden');
    }, 2200);
  }

  onAnimationDone(): void {
    if (this.state() === 'hidden') {
      this.done.emit();
    }
  }
}
