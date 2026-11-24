import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CardPaymentPayload, PaymentMethod } from '../../../../../core/models/checkout.model';

function cardExpirationValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  if (!value) return null;

  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) {
    return { invalidFormat: true };
  }

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { expiredCard: true };
  }

  return null;
}

function cardNumberValidator(control: AbstractControl): ValidationErrors | null {
  const digits = (control.value ?? '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length < 13 || digits.length > 19) {
    return { invalidLength: true };
  }
  return null;
}

function nonBlankNameValidator(control: AbstractControl): ValidationErrors | null {
  const trimmed = (control.value ?? '').trim();
  if (!trimmed) return null;
  return trimmed.length < 3 ? { minLength: true } : null;
}

@Component({
  selector: 'app-card-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './card-payment-form.html',
})


export class CardPaymentFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly method = input.required<Extract<PaymentMethod, 'credit' | 'debit'>>();
  readonly amount = input.required<number>();
  readonly currency = input<string>('BRL');
  readonly disabled = input<boolean>(false);
  readonly submitCard = output<CardPaymentPayload>();
  
 readonly form = this.fb.nonNullable.group({
    number: ['', [Validators.required, cardNumberValidator]],
    holderName: [
      '',
      [
        Validators.required,
        nonBlankNameValidator,
        Validators.maxLength(60),
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/),
      ],
    ],
    expiration: ['', [Validators.required, cardExpirationValidator]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  onHolderNameInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const sanitized = inputEl.value
      .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '')
      .slice(0, 60);

    inputEl.value = sanitized;
    this.form.controls.holderName.setValue(sanitized, { emitEvent: false });
    this.form.controls.holderName.updateValueAndValidity();
  }

  onCardNumberInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const digits = inputEl.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.form.controls.number.setValue(formatted, { emitEvent: false });
    this.form.controls.number.updateValueAndValidity();
  }

  onExpirationInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const digits = inputEl.value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    this.form.controls.expiration.setValue(formatted, { emitEvent: false });
    this.form.controls.expiration.updateValueAndValidity();
  }

  onCvvInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const digits = inputEl.value.replace(/\D/g, '').slice(0, 4);
    this.form.controls.cvv.setValue(digits, { emitEvent: false });
    this.form.controls.cvv.updateValueAndValidity();
  }

  hasError(controlName: keyof typeof this.form.controls): boolean {
    const ctrl = this.form.controls[controlName];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit(): void {
    if (this.form.invalid || this.disabled()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitCard.emit(this.form.getRawValue());
  }
}