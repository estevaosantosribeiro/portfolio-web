import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
  out:     'cubic-bezier(0, 0, 0.2, 1)',
  in:      'cubic-bezier(0.4, 0, 1, 1)',
} as const;

export const fadeUp: AnimationTriggerMetadata = trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(24px)' }),
    animate(`500ms ${EASING.out}`, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate(`300ms ${EASING.in}`, style({ opacity: 0, transform: 'translateY(-12px)' })),
  ]),
]);

export const fadeIn: AnimationTriggerMetadata = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(`400ms ${EASING.out}`, style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate(`250ms ${EASING.in}`, style({ opacity: 0 })),
  ]),
]);

export const scaleIn: AnimationTriggerMetadata = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.96)' }),
    animate(`400ms ${EASING.spring}`, style({ opacity: 1, transform: 'scale(1)' })),
  ]),
]);

export const staggerChildren = (selector = ':scope > *', delay = 80): AnimationTriggerMetadata =>
  trigger('staggerChildren', [
    transition(':enter', [
      query(selector, [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(delay, [
          animate(`500ms ${EASING.out}`, style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
      ], { optional: true }),
    ]),
  ]);

export const loadingExit: AnimationTriggerMetadata = trigger('loadingExit', [
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  state('hidden',  style({ opacity: 0, transform: 'scale(1.06)' })),
  transition('visible => hidden', [
    animate(`700ms 200ms ${EASING.default}`),
  ]),
]);

export const pageReveal: AnimationTriggerMetadata = trigger('pageReveal', [
  state('hidden',  style({ clipPath: 'circle(0% at 50% 40%)', opacity: 0 })),
  state('visible', style({ clipPath: 'circle(150% at 50% 40%)', opacity: 1 })),
  transition('hidden => visible', [
    animate(`900ms 300ms ${EASING.out}`),
  ]),
]);
