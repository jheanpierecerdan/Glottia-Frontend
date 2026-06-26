import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Language } from './languages';
import { User } from './users';

export interface UserLanguage {
  idUsuarioIdioma?: number;
  nivel: string;
  tipo: string;
  usuario: User;
  idioma: Language;
}

@Injectable({ providedIn: 'root' })
export class UserLanguages extends ApiService<UserLanguage> {
  protected readonly resource = 'user-languages';
  constructor(http: HttpClient) { super(http); }

  getByUser(userId: number): Observable<UserLanguage[]> { return this.http.get<UserLanguage[]>(`${this.url}/usuario/${userId}`); }
  getByLanguage(languageId: number): Observable<UserLanguage[]> { return this.http.get<UserLanguage[]>(`${this.url}/idioma/${languageId}`); }
  getByLanguageAndLevel(languageId: number, level: string): Observable<UserLanguage[]> {
    return this.http.get<UserLanguage[]>(`${this.url}/idioma/${languageId}/nivel/${level}`);
  }
}
