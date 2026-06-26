import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Interest } from './interests';
import { User } from './users';

export interface UserInterest {
  idUsuarioInteres?: number;
  usuario: User;
  interes: Interest;
}

@Injectable({ providedIn: 'root' })
export class UserInterests extends ApiService<UserInterest> {
  protected readonly resource = 'user-interests';
  constructor(http: HttpClient) { super(http); }

  getByUser(userId: number): Observable<UserInterest[]> { return this.http.get<UserInterest[]>(`${this.url}/user/${userId}`); }
  getByInterest(interestId: number): Observable<UserInterest[]> { return this.http.get<UserInterest[]>(`${this.url}/interes/${interestId}`); }
}
