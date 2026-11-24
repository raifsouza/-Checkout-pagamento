import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardPaymentPayload, PaymentMethod } from '../../../../../core/models/checkout.model';
import { CheckoutStateService } from '../../../../../core/services/checkout-state.service';
import { ProductSummaryComponent } from '../../../../../shared/components/product-summary/product-summary';
import { CardPaymentFormComponent } from '../../components/card-payment-form/card-payment-form';
import { PixPaymentPanelComponent } from '../../components/pix-payment-panel/pix-payment-panel';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    ProductSummaryComponent,
    CardPaymentFormComponent,
    PixPaymentPanelComponent,
  ],
  templateUrl: './payment-page.html',
})
export class PaymentPage {
  private readonly router = inject(Router);
  readonly checkoutState = inject(CheckoutStateService);

  selectMethod(method: PaymentMethod): void {
    if (this.checkoutState.isProcessing()) return;
    this.checkoutState.selectMethod(method);
  }

  async handleCardSubmit(payload: CardPaymentPayload): Promise<void> {
    const method = this.checkoutState.selectedMethod();
    if (method === 'pix') return;

    const result = await this.checkoutState.processCardPayment(method, payload);
    await this.router.navigate([result === 'success' ? '/sucesso' : '/erro']);
  }

  async handlePixSubmit(): Promise<void> {
    const result = await this.checkoutState.processPixPayment();
    await this.router.navigate([result === 'success' ? '/sucesso' : '/erro']);
  }
}