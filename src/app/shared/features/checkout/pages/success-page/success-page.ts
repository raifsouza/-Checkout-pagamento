import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutStateService } from '../../../../../core/services/checkout-state.service';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    @if (checkoutState.receipt(); as receipt) {
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center">
            <div
              class="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mx-auto mb-3"
              style="width: 64px; height: 64px;"
            >
              <i class="bi bi-check-lg fs-2"></i>
            </div>

            <h1 class="h4 fw-bold mb-2">Pagamento confirmado!</h1>
            <p class="text-secondary mb-4">
              Sua assinatura foi ativada com sucesso. Confira os detalhes abaixo.
            </p>

            <div class="border rounded-4 p-3 p-md-4 bg-light text-start mb-4">
              <div class="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom">
                <div>
                  <span class="text-secondary small d-block">Produto</span>
                  <strong class="d-block">{{ receipt.product.name }}</strong>
                  <span class="text-secondary small">{{ receipt.product.summary }}</span>
                </div>
                <span class="h5 fw-bold mb-0">
                  {{ receipt.amount | currency : receipt.currency : 'symbol' : '1.2-2' : 'pt-BR' }}
                </span>
              </div>

              <div class="d-flex justify-content-between small mb-2">
                <span class="text-secondary">Meio de pagamento</span>
                <span class="fw-semibold">{{ receipt.maskedDetail }}</span>
              </div>

              <div class="d-flex justify-content-between small">
                <span class="text-secondary">Data</span>
                <span class="fw-medium">{{ receipt.paidAt | date : 'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>

            <button
              type="button"
              class="btn btn-primary btn-lg w-100 fw-semibold rounded-3"
              (click)="startNewCheckout()"
            >
              Acessar meu espaço
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class SuccessPage {
  private readonly router = inject(Router);
  readonly checkoutState = inject(CheckoutStateService);

  async startNewCheckout(): Promise<void> {
    this.checkoutState.resetCheckout();
    await this.router.navigate(['/pagamento']);
  }
}