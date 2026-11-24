import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CheckoutStateService } from '../services/checkout-state.service';

export const successAccessGuard: CanActivateFn = () => {
  const checkoutState = inject(CheckoutStateService);
  const router = inject(Router);

  if (checkoutState.receipt()) {
    return true;
  }

  return router.createUrlTree(['/pagamento']);
};

export const errorAccessGuard: CanActivateFn = () => {
  const checkoutState = inject(CheckoutStateService);
  const router = inject(Router);

  if (checkoutState.error()) {
    return true;
  }

  return router.createUrlTree(['/pagamento']);
};