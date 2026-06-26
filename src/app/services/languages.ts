import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Language {
  idIdioma?: number;
  nombre: string;
  codigoIso: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class Languages extends ApiService<Language> {
  protected readonly resource = 'languages';
  constructor(http: HttpClient) { super(http); }
}
