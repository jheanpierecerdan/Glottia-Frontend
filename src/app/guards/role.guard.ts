import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return router.createUrlTree(['/login']);
  const roles = route.data['roles'] as UserRole[] | undefined;
  return !roles || roles.includes(auth.role()!) ? true : router.createUrlTree([auth.landingFor()]);
};