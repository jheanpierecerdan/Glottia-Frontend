import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.service';

export type UserRole = 'ADMINISTRADOR' | 'ORGANIZADOR' | 'DOCENTE' | 'ESTUDIANTE';
export interface Session { token: string; correo: string; nombre: string; rol: UserRole; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'glottia_session';
  private readonly sessionState = signal<Session | null>(this.readSession());
  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.token));
  readonly role = computed(() => this.sessionState()?.rol ?? null);

  constructor(private readonly http: HttpClient) {}

  login(correo: string, contrasena: string): Observable<Session> {
    return this.http.post<Session>(`${API_URL.replace(/\/api$/, '')}/ingresos`, { correo, contrasena }).pipe(
      tap((session) => { localStorage.setItem(this.storageKey, JSON.stringify(session)); this.sessionState.set(session); }),
    );
  }
  startGuest(): void {
    const session: Session = { token: 'guest-demo-token', correo: 'invitado@glottia.demo', nombre: 'Invitado', rol: 'ESTUDIANTE' };
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionState.set(session);
  }
  logout(): void { localStorage.removeItem(this.storageKey); this.sessionState.set(null); }
  landingFor(role: UserRole | null = this.role()): string {
    return ({ ADMINISTRADOR: '/panel', ORGANIZADOR: '/panel', DOCENTE: '/panel', ESTUDIANTE: '/panel' } as const)[role ?? 'ESTUDIANTE'];
  }
  private readSession(): Session | null {
    if (typeof localStorage === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem(this.storageKey) ?? 'null') as Session | null; }
    catch { localStorage.removeItem(this.storageKey); return null; }
  }
}
