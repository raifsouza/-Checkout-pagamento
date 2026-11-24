import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-pix-payment-panel',
  standalone: true,
  template: `
    <div class="text-center">
      <h3 class="h6 fw-bold mb-1">Pague com seu app do banco</h3>
      <p class="text-secondary small mb-3">
        Abra a opção Pix e escaneie o QR Code ou use o código abaixo. Depois, conclua o pagamento.
      </p>

      <!-- QR Code simulado em SVG -->
      <div class="d-inline-flex flex-column align-items-center p-3 border rounded-4 bg-white mb-2">
        <svg
          width="156"
          height="156"
          viewBox="0 0 21 21"
          shape-rendering="crispEdges"
          aria-label="QR Code Pix simulado"
        >
          <rect width="21" height="21" fill="#ffffff" />
          <path
            fill="#18181b"
            d="M0,0 h7 v7 h-7 z M1,1 v5 h5 v-5 z M2,2 h3 v3 h-3 z
               M14,0 h7 v7 h-7 z M15,1 v5 h5 v-5 z M16,2 h3 v3 h-3 z
               M0,14 h7 v7 h-7 z M1,15 v5 h5 v-5 z M2,16 h3 v3 h-3 z
               M9,1 h2 v2 h-2 z M12,2 h1 v3 h-1 z M8,5 h3 v1 h-3 z
               M2,9 h2 v2 h-2 z M6,8 h2 v3 h-2 z M10,8 h3 v3 h-3 z
               M15,9 h2 v2 h-2 z M19,8 h2 v3 h-2 z M8,12 h2 v2 h-2 z
               M12,12 h3 v2 h-3 z M17,13 h3 v2 h-3 z M9,16 h2 v4 h-2 z
               M13,17 h2 v3 h-2 z M17,17 h4 v3 h-4 z"
          />
        </svg>
      </div>
      <p class="text-secondary small mb-4">QR Code simulado • sem valor de pagamento</p>

      <div class="text-start mb-3">
        <label class="form-label small text-secondary fw-medium">Pix copia e cola</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control bg-light text-secondary small"
            [value]="pixCode()"
            readonly
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            (click)="copyCode()"
            [disabled]="disabled()"
          >
            <i class="bi" [class.bi-check2]="copied()" [class.bi-clipboard]="!copied()"></i>
            {{ copied() ? 'Copiado!' : 'Copiar código Pix' }}
          </button>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-primary btn-lg w-100 fw-semibold rounded-3"
        [disabled]="disabled()"
        (click)="confirmPix.emit()"
      >
        <i class="bi bi-arrow-right me-1"></i> Concluir pagamento
      </button>
    </div>
  `,
})
export class PixPaymentPanelComponent {
  readonly pixCode = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly confirmPix = output<void>();

  readonly copied = signal(false);

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.pixCode());
    } catch {
      // Fallback silencioso caso o navegador restrinja clipboard fora de HTTPS
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2500);
  }
}