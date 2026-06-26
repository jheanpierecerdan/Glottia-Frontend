import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { API_URL } from './api.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).session()?.token;
  if (!token || !request.url.startsWith(API_URL)) return next(request);
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};