import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Interest {
  idInteres?: number;
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class Interests extends ApiService<Interest> {
  protected readonly resource = 'interests';
  constructor(http: HttpClient) { super(http); }
}
