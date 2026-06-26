import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const LOCAL_API = 'http://localhost:8080/api';
// API de Render desactivada por ahora. Para pruebas locales usamos siempre el backend local.
// const RENDER_API = 'https://backend-glottia-main.onrender.com/api';

export const API_URL = LOCAL_API;

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
