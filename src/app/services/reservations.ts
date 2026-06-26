import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from './users';

export interface Reservation {
  idReserva?: number;
  fechaReserva: string;
  estadoReserva: string;
  idUsuario: number;
  idEvento: number;
}

@Injectable({ providedIn: 'root' })
export class Reservations extends ApiService<Reservation> {
  protected readonly resource = 'reservations';
  constructor(http: HttpClient) { super(http); }

  getByUser(userId: number): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${this.url}/usuario/${userId}`); }
  getParticipants(eventId: number): Observable<User[]> { return this.http.get<User[]>(`${this.url}/evento/${eventId}/participantes`); }
  countByEvent(eventId: number): Observable<number> { return this.http.get<number>(`${this.url}/evento/${eventId}/conteo`); }
  exists(userId: number, eventId: number): Observable<boolean> { return this.http.get<boolean>(`${this.url}/validar/${userId}/${eventId}`); }
}
