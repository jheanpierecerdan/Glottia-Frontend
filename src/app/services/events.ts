import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Event {
  idEvento?: number;
  titulo: string;
  descripcion: string;
  modalidad: string;
  fechaHora: string;
  cupoMaximo: number;
  ubicacion?: string;
  enlaceVirtual?: string;
  estado: string;
  idIdioma?: number;
  idOrganizador?: number;
}

@Injectable({ providedIn: 'root' })
export class Events extends ApiService<Event> {
  protected readonly resource = 'events';
  constructor(http: HttpClient) { super(http); }

  getActive(): Observable<Event[]> { return this.http.get<Event[]>(`${this.url}/activos`); }
  getFuture(): Observable<Event[]> { return this.http.get<Event[]>(`${this.url}/futuros`); }
  getByLanguage(id: number): Observable<Event[]> { return this.http.get<Event[]>(`${this.url}/idioma/${id}`); }
  getByModality(modality: string): Observable<Event[]> { return this.http.get<Event[]>(`${this.url}/modalidad/${modality}`); }
  getByCreator(userId: number): Observable<Event[]> { return this.http.get<Event[]>(`${this.url}/creador/${userId}`); }
}
