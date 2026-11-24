import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ProductInfo } from '../../../core/models/checkout.model';

@Component({
  selector: 'app-product-summary',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4 d-flex align-items-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-3">
          <div
            class="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
            style="width: 48px; height: 48px;"
          >
            <i class="bi bi-grid-fill fs-5"></i>
          </div>
          <div>
            <h2 class="h6 fw-bold mb-1">{{ product().name }}</h2>
            <p class="text-secondary small mb-0">{{ product().summary }}</p>
          </div>
        </div>

        <div class="text-end">
          <span class="text-secondary small d-block">Total a pagar</span>
          <span class="h5 fw-bold mb-0">
            {{ product().price | currency : product().currency : 'symbol' : '1.2-2' : 'pt-BR' }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class ProductSummaryComponent {
  readonly product = input.required<ProductInfo>();
}