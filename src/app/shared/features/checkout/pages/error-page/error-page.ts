import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutStateService } from '../../../../../core/services/checkout-state.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    @if (checkoutState.error(); as error) {
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center">
            <div
              class="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mx-auto mb-3"
              style="width: 64px; height: 64px;"
            >
              <i class="bi bi-x-lg fs-3"></i>
            </div>

            <h1 class="h4 fw-bold mb-2">{{ error.title }}</h1>
            <p class="text-secondary mb-4">{{ error.message }}</p>

            <div class="border rounded-4 p-3 bg-light text-start mb-4">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-semibold">{{ checkoutState.product().name }}</span>
                <span class="fw-bold">
                  {{
                    checkoutState.product().price
                      | currency : checkoutState.product().currency : 'symbol' : '1.2-2' : 'pt-BR'
                  }}
                </span>
              </div>
              <div class="d-flex justify-content-between small text-secondary">
                <span>Código do erro</span>
                <code>{{ error.code }}</code>
              </div>
            </div>

            <div class="d-grid gap-2">
              @if (error.canRetry) {
                <button
                  type="button"
                  class="btn btn-primary btn-lg fw-semibold rounded-3"
                  [disabled]="checkoutState.isProcessing()"
                  (click)="retryPayment()"
                >
                  <i class="bi bi-arrow-clockwise me-1"></i> Tentar novamente
                </button>
              }

              <button
                type="button"
                class="btn btn-outline-secondary btn-lg fw-semibold rounded-3"
                (click)="chooseAnotherMethod()"
              >
                Escolher outro meio de pagamento
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ErrorPage {
  private readonly router = inject(Router);
  readonly checkoutState = inject(CheckoutStateService);

  async retryPayment(): Promise<void> {
    const result = await this.checkoutState.retryLastPayment();
    await this.router.navigate([result === 'success' ? '/sucesso' : '/erro']);
  }

  async chooseAnotherMethod(): Promise<void> {
    this.checkoutState.prepareChangePaymentMethod();
    await this.router.navigate(['/pagamento']);
  }
}