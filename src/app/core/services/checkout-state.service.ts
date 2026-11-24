import { computed, Injectable, signal } from '@angular/core';
import {
  CardPaymentPayload,
  CheckoutState,
  PaymentErrorInfo,
  PaymentMethod,
  PaymentReceipt,
  ProductInfo,
} from '../models/checkout.model';

const DEFAULT_PRODUCT: ProductInfo = {
  id: 'nexo-pro-monthly',
  name: 'Nexo Pro',
  summary: 'Plano mensal • 1 usuário',
  price: 79.9,
  currency: 'BRL',
};

const PIX_MOCK_CODE =
  '00020126580014BR.GOV.BCB.PIX0136nexo-pro-checkout-demo-7990520400005303986540579.905802BR5913NEXO SOFTWARE6009SAO PAULO62070503***6304A1B2';

@Injectable({
  providedIn: 'root',
})
export class CheckoutStateService {
  private readonly state = signal<CheckoutState>({
    product: DEFAULT_PRODUCT,
    selectedMethod: 'credit',
    status: 'idle',
    receipt: null,
    error: null,
    simulateFailureMode: 'random',
  });

  readonly product = computed(() => this.state().product);
  readonly selectedMethod = computed(() => this.state().selectedMethod);
  readonly status = computed(() => this.state().status);
  readonly isProcessing = computed(() => this.state().status === 'processing');
  readonly receipt = computed(() => this.state().receipt);
  readonly error = computed(() => this.state().error);
  readonly simulateFailureMode = computed(() => this.state().simulateFailureMode);
  readonly pixCode = PIX_MOCK_CODE;

  selectMethod(method: PaymentMethod): void {
    this.state.update((current) => ({
      ...current,
      selectedMethod: method,
      error: null,
    }));
  }

  setSimulationMode(mode: 'random' | 'always_error' | 'always_success'): void {
    this.state.update((current) => ({
      ...current,
      simulateFailureMode: mode,
    }));
  }

  async processCardPayment(
    method: Extract<PaymentMethod, 'credit' | 'debit'>,
    card: CardPaymentPayload
  ): Promise<'success' | 'error'> {
    const cleanDigits = card.number.replace(/\D/g, '');
    const last4 = cleanDigits.slice(-4) || '0000';
    const methodLabel = method === 'credit' ? 'Cartão de crédito' : 'Cartão de débito';

    return this.runSimulatedProcessing(method, `${methodLabel} •••• ${last4}`);
  }

  async processPixPayment(): Promise<'success' | 'error'> {
    return this.runSimulatedProcessing('pix', 'Pix instantâneo (simulado)');
  }

  async retryLastPayment(): Promise<'success' | 'error'> {
    const currentMethod = this.state().error?.method ?? this.state().selectedMethod;
    const label =
      currentMethod === 'pix'
        ? 'Pix instantâneo (simulado)'
        : currentMethod === 'debit'
          ? 'Cartão de débito (nova tentativa)'
          : 'Cartão de crédito (nova tentativa)';

    this.selectMethod(currentMethod);
    return this.runSimulatedProcessing(currentMethod, label);
  }

  prepareChangePaymentMethod(): void {
    this.state.update((current) => ({
      ...current,
      status: 'idle',
      error: null,
    }));
  }

  resetCheckout(): void {
    this.state.set({
      product: DEFAULT_PRODUCT,
      selectedMethod: 'credit',
      status: 'idle',
      receipt: null,
      error: null,
      simulateFailureMode: this.state().simulateFailureMode,
    });
  }

  private async runSimulatedProcessing(
    method: PaymentMethod,
    maskedDetail: string
  ): Promise<'success' | 'error'> {
    this.state.update((current) => ({
      ...current,
      status: 'processing',
      selectedMethod: method,
      error: null,
    }));

    await this.delay(1600);

    const shouldFail = this.shouldSimulateError();

    if (shouldFail) {
      const errorInfo = this.buildMockError(method);
      this.state.update((current) => ({
        ...current,
        status: 'error',
        receipt: null,
        error: errorInfo,
      }));
      return 'error';
    }

    const currentProduct = this.state().product;
    const receipt: PaymentReceipt = {
      method,
      methodLabel: this.getMethodLabel(method),
      maskedDetail,
      paidAt: new Date().toISOString(),
      amount: currentProduct.price,
      currency: currentProduct.currency,
      product: currentProduct,
    };

    this.state.update((current) => ({
      ...current,
      status: 'success',
      receipt,
      error: null,
    }));

    return 'success';
  }

  private shouldSimulateError(): boolean {
    const mode = this.state().simulateFailureMode;
    if (mode === 'always_error') return true;
    if (mode === 'always_success') return false;
    return Math.random() < 0.4;
  }

  private buildMockError(method: PaymentMethod): PaymentErrorInfo {
    if (method === 'pix') {
      return {
        code: 'PIX TIMEOUT SIMULATED',
        title: 'Não foi possível confirmar o Pix',
        message:
          'A confirmação simulada demorou mais que o esperado ou não foi concluída. Você pode tentar novamente ou escolher outro meio de pagamento.',
        method,
        canRetry: true,
      };
    }

    return {
      code: 'CARD DECLINED SIMULATED',
      title: 'Não foi possível concluir o pagamento',
      message:
        'A transação foi recusada na simulação de processamento. Verifique os dados, tente novamente ou escolha outro meio de pagamento.',
      method,
      canRetry: true,
    };
  }

  private getMethodLabel(method: PaymentMethod): string {
    switch (method) {
      case 'credit':
        return 'Cartão de crédito';
      case 'debit':
        return 'Cartão de débito';
      case 'pix':
        return 'Pix';
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}