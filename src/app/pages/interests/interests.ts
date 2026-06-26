import { Component, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Interests as InterestsService, Interest } from '../../services/interests';
import { UserInterests, UserInterest } from '../../services/user-interests';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface InterestInsight {
  interest: Interest;
  users: number;
}

@Component({ selector: 'app-interests', imports: [ResourceList, MatIconModule, RouterLink], templateUrl: './interests.html', styleUrl: './interests.scss' })
export class Interests extends ResourcePage implements OnInit {
  readonly columns = [{ key: 'idInteres', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }];
  interests: Interest[] = [];
  userInterests: UserInterest[] = [];
  insights: InterestInsight[] = [];
  constructor(
    private readonly interestsService: InterestsService,
    private readonly userInterestsService: UserInterests,
  ) { super(); }
  ngOnInit(): void { this.cargarIntereses(); }
  get describedInterests(): number {
    return this.interests.filter((interest) => Boolean(interest.descripcion)).length;
  }
  cargarIntereses(): void {
    this.startLoading();
    forkJoin({
      interests: this.interestsService.getAll().pipe(catchError(() => of([] as Interest[]))),
      userInterests: this.userInterestsService.getAll().pipe(catchError(() => of([] as UserInterest[]))),
    }).pipe(finalize(() => this.finishLoading())).subscribe({
      next: ({ interests, userInterests }) => {
        this.interests = interests;
        this.userInterests = userInterests;
        this.insights = this.buildInsights(interests, userInterests);
        this.rows = interests.map((interest) => ({ ...interest }));
      },
      error: () => this.showError(),
    });
  }

  eliminarInteres(id: number): void {
    this.deleteResource(this.interestsService, id, () => this.cargarIntereses());
  }

  private buildInsights(interests: Interest[], userInterests: UserInterest[]): InterestInsight[] {
    return interests.map((interest) => ({
      interest,
      users: userInterests.filter((item) => item.interes?.idInteres === interest.idInteres).length,
    })).sort((a, b) => b.users - a.users);
  }
}
