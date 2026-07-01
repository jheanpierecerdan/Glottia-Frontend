import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, timeout } from 'rxjs';
import { API_HEALTH_URL } from './api.service';

@Injectable({ providedIn: 'root' })
export class BackendWakeupService {
  readonly waking = signal(false);
  readonly ready = signal(false);
  readonly message = signal('');

  constructor(private readonly http: HttpClient) {}

  wake(): void {
    if (this.waking()) return;

    this.waking.set(true);
    this.message.set('Conectando con el backend...');

    this.http.get(API_HEALTH_URL).pipe(
      timeout(180000),
      catchError(() => of(null)),
    ).subscribe((response) => {
      this.ready.set(Boolean(response));
      this.waking.set(false);
      this.message.set(response ? '' : 'El backend aun esta despertando. Intenta nuevamente en un momento.');
    });
  }
}
