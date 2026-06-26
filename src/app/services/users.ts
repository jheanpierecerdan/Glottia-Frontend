import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  ciudad?: string;
  biografia?: string;
  modalidad?: string;
  fechaRegistro?: string;
  estado?: boolean;
  idRol?: number;
}

@Injectable({ providedIn: 'root' })
export class Users extends ApiService<User> {
  protected readonly resource = 'users';

  constructor(http: HttpClient) { super(http); }

  getByEmail(email: string): Observable<User> { return this.http.get<User>(`${this.url}/correo/${email}`); }
  getByRole(role: string): Observable<User[]> { return this.http.get<User[]>(`${this.url}/rol/${role}`); }
  getByCity(city: string): Observable<User[]> { return this.http.get<User[]>(`${this.url}/ciudad/${city}`); }
  getByModality(modality: string): Observable<User[]> { return this.http.get<User[]>(`${this.url}/modalidad/${modality}`); }
}
