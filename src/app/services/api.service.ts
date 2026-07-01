import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const LOCAL_API = 'http://localhost:8080/api';
const RENDER_API = 'https://backend-glottia-main.onrender.com/api';

const isBrowser = typeof window !== 'undefined';
const isLocalHost = isBrowser && ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const IS_LOCAL_API = !isBrowser || isLocalHost;
export const API_URL = IS_LOCAL_API ? LOCAL_API : RENDER_API;
export const API_HEALTH_URL = `${API_URL.replace(/\/api$/, '')}/api/health`;

export abstract class ApiService<T> {
  protected abstract readonly resource: string;
  constructor(protected readonly http: HttpClient) {}
  getAll(): Observable<T[]> { return this.http.get<T[]>(this.url); }
  getById(id: number): Observable<T> { return this.http.get<T>(`${this.url}/${id}`); }
  create(value: T): Observable<T> { return this.http.post<T>(this.url, value); }
  update(id: number, value: T): Observable<T> { return this.http.put<T>(`${this.url}/${id}`, value); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  protected get url(): string { return `${API_URL}/${this.resource}`; }
}
