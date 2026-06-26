import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Role {
  idRol?: number;
  nombre: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class Roles extends ApiService<Role> {
  protected readonly resource = 'roles';
  constructor(http: HttpClient) { super(http); }
}
