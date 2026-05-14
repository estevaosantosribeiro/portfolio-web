import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

// ─── Field rules ──────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value && !EMAIL_RE.test(control.value) ? { emailFormat: true } : null;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

export const ContactSchema = {
  name: [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(80),
  ],
  email: [
    Validators.required,
    Validators.maxLength(254),
    emailFormat(),
  ],
  subject: [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(120),
  ],
  message: [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(1000),
  ],
};

// ─── Error messages ───────────────────────────────────────────────────────────

export function getFieldError(errors: ValidationErrors | null): string {
  if (!errors) return '';
  if (errors['required'])     return 'Este campo é obrigatório.';
  if (errors['minlength'])    return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
  if (errors['maxlength'])    return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
  if (errors['emailFormat'])  return 'Insira um e-mail válido.';
  return 'Valor inválido.';
}
