import {
  ChangeDetectionStrategy,
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { UiButtonComponent } from '../../../../shared/components/button/ui-button.component';
import { HeroCanvasComponent } from '../hero-canvas/hero-canvas.component';

// ─── Typewriter config ─────────────────────────────────────────────────────────
const WORDS: readonly string[] = ['Full-Stack', 'Front-end', 'Back-end'];

const TIMING = {
  type:       82,    // ms per character typed
  delete:     48,    // ms per character deleted
  pauseFull:  2600,  // ms to hold a complete word before deleting
  pauseNext:  320,   // ms before typing the next word
  startDelay: 1900,  // ms after entrance animation settles
} as const;

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButtonComponent, HeroCanvasComponent],
  templateUrl: './hero.component.html',
  styleUrl:    './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {

  private readonly platformId   = inject(PLATFORM_ID);
  private readonly contentRef   = viewChild<ElementRef<HTMLElement>>('heroContent');
  private readonly introLineRef = viewChild<ElementRef<HTMLElement>>('introLine');

  // Signals read by the template — must be non-private
  readonly typedText  = signal<string>('');
  readonly isDeleting = signal<boolean>(false);

  // Internal typewriter state — not referenced in the template
  private wordIndex = 0;
  private charIndex = 0;
  private timerId?: ReturnType<typeof setTimeout>;

  // ─── Lifecycle ────────────────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.typedText.set(WORDS[0]); // SSR: show first word statically
      return;
    }

    this.runEntrance();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typedText.set(WORDS[0]);
      this.charIndex = WORDS[0].length;
      return;
    }

    // Start typewriter after the entrance animation has fully settled
    this.timerId = setTimeout(() => this.tick(), TIMING.startDelay);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timerId);
  }

  // ─── GSAP entrance ────────────────────────────────────────────────────────────
  private runEntrance(): void {
    const content   = this.contentRef()?.nativeElement;
    const introLine = this.introLineRef()?.nativeElement;
    if (!content) return;

    const items = content.querySelectorAll<HTMLElement>('[data-animate]');

    gsap.set(introLine ?? [], { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(items, { opacity: 0, y: 28 });

    const tl = gsap.timeline({ delay: 0.2 });

    if (introLine) {
      tl.to(introLine, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' });
    }

    tl.to(
      items,
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out' },
      introLine ? '-=0.3' : 0,
    );
  }

  // ─── Typewriter state machine ─────────────────────────────────────────────────
  //
  //  Typing state  (isDeleting = false):
  //    charIndex++ → set text → if full word: switch to deleting + schedulePauseFull
  //                           → else: scheduleType
  //
  //  Deleting state (isDeleting = true):
  //    charIndex-- → set text → if empty: switch to typing + advance word + schedulePauseNext
  //                           → else: scheduleDelete
  //
  private tick(): void {
    const word = WORDS[this.wordIndex];

    if (this.isDeleting()) {
      this.charIndex--;
      this.typedText.set(word.slice(0, this.charIndex));

      if (this.charIndex === 0) {
        this.isDeleting.set(false);
        this.wordIndex = (this.wordIndex + 1) % WORDS.length;
        this.timerId = setTimeout(() => this.tick(), TIMING.pauseNext);
      } else {
        this.timerId = setTimeout(() => this.tick(), TIMING.delete);
      }

    } else {
      this.charIndex++;
      this.typedText.set(word.slice(0, this.charIndex));

      if (this.charIndex === word.length) {
        this.isDeleting.set(true);
        this.timerId = setTimeout(() => this.tick(), TIMING.pauseFull);
      } else {
        this.timerId = setTimeout(() => this.tick(), TIMING.type);
      }
    }
  }
}
