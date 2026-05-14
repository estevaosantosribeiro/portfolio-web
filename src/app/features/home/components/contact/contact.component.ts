import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';

import { ContactService } from '../../../../core/services/contact.service';
import { ContactSchema, getFieldError } from './contact.schema';

export type FormState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private readonly fb         = inject(FormBuilder);
  private readonly svc        = inject(ContactService);
  private readonly cdr        = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host       = inject(ElementRef<HTMLElement>);

  private readonly observers: IntersectionObserver[] = [];
  private sendSub?: Subscription;

  readonly formState = signal<FormState>('idle');
  readonly MESSAGE_MAX = 1000;

  readonly form = this.fb.nonNullable.group({
    name:    ['', ContactSchema.name],
    email:   ['', ContactSchema.email],
    subject: ['', ContactSchema.subject],
    message: ['', ContactSchema.message],
  });

  get nameCtrl()    { return this.form.controls.name; }
  get emailCtrl()   { return this.form.controls.email; }
  get subjectCtrl() { return this.form.controls.subject; }
  get messageCtrl() { return this.form.controls.message; }

  get messageLength(): number { return this.messageCtrl.value.length; }
  get isLoading(): boolean    { return this.formState() === 'loading'; }
  get isSuccess(): boolean    { return this.formState() === 'success'; }

  fieldError(errors: ValidationErrors | null): string {
    return getFieldError(errors);
  }

  showError(control: typeof this.nameCtrl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealAll();
      return;
    }

    this.initReveal();
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
    this.sendSub?.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.formState.set('loading');
    const { name, email, subject, message } = this.form.getRawValue();

    this.sendSub = this.svc.send({ name, email, subject, message }).subscribe({
      next: (result) => {
        if (result.success) {
          this.formState.set('success');
          this.form.reset();
        } else {
          this.formState.set('error');
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.formState.set('error');
        this.cdr.markForCheck();
      },
    });
  }

  retry(): void {
    this.formState.set('idle');
  }

  // ─── Reveal ───────────────────────────────────────────────────────────────

  private revealAll(): void {
    const el = this.host.nativeElement as HTMLElement;
    (el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>).forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    });
  }

  private initReveal(): void {
    const el = this.host.nativeElement as HTMLElement;

    this.observeGroup(
      el.querySelector('.contact__header') as HTMLElement | null,
      (group) => {
        const items = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' });
      },
    );

    this.observeGroup(
      el.querySelector('.contact__body') as HTMLElement | null,
      (group) => {
        const cols = group.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
        gsap.set(cols, { opacity: 0, y: 28 });
        gsap.to(cols, { opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', delay: 0.1 });
      },
    );
  }

  private observeGroup(el: HTMLElement | null, onEnter: (el: HTMLElement) => void): void {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        onEnter(el);
        obs.disconnect();
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    this.observers.push(obs);
  }
}
