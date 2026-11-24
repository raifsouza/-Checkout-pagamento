import { Routes } from '@angular/router';
import { errorAccessGuard, successAccessGuard } from './core/guards/checkout-result.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pagamento',
  },
  {
    path: 'pagamento',
    loadComponent: () =>
      import('./shared/features/checkout/pages/payment-page/payment-page').then((m) => m.PaymentPage),
  },
  {
    path: 'sucesso',
    canActivate: [successAccessGuard],
    loadComponent: () =>
      import('./shared/features/checkout/pages/success-page/success-page').then((m) => m.SuccessPage),
  },
  {
    path: 'erro',
    canActivate: [errorAccessGuard],
    loadComponent: () =>
      import('./shared/features/checkout/pages/error-page/error-page').then((m) => m.ErrorPage),
  },
  {
    path: '**',
    redirectTo: 'pagamento',
  },
];