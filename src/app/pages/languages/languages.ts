import { Component, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Languages as LanguagesService, Language } from '../../services/languages';
import { Events, Event } from '../../services/events';
import { UserLanguages, UserLanguage } from '../../services/user-languages';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface LanguageInsight {
  language: Language;
  events: number;
  learners: number;
}

@Component({ selector: 'app-languages', imports: [ResourceList, MatIconModule, RouterLink], templateUrl: './languages.html', styleUrl: './languages.scss' })
export class Languages extends ResourcePage implements OnInit {
  readonly columns = [{ key: 'idIdioma', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'codigoIso', label: 'Código ISO' }, { key: 'descripcion', label: 'Descripción' }];
  languages: Language[] = [];
  events: Event[] = [];
  userLanguages: UserLanguage[] = [];
  insights: LanguageInsight[] = [];
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly eventsService: Events,
    private readonly userLanguagesService: UserLanguages,
  ) { super(); }
  ngOnInit(): void { this.cargarIdiomas(); }
  get codedLanguages(): number {
    return this.languages.filter((language) => Boolean(language.codigoIso)).length;
  }
  cargarIdiomas(): void {
    this.startLoading();
    forkJoin({
      languages: this.languagesService.getAll().pipe(catchError(() => of([] as Language[]))),
      events: this.eventsService.getAll().pipe(catchError(() => of([] as Event[]))),
      userLanguages: this.userLanguagesService.getAll().pipe(catchError(() => of([] as UserLanguage[]))),
    }).pipe(finalize(() => this.finishLoading())).subscribe({
      next: ({ languages, events, userLanguages }) => {
        this.languages = languages;
        this.events = events;
        this.userLanguages = userLanguages;
        this.insights = this.buildInsights(languages, events, userLanguages);
        this.rows = languages.map((language) => ({ ...language }));
      },
      error: () => this.showError(),
    });
  }

  eliminarIdioma(id: number): void {
    this.deleteResource(this.languagesService, id, () => this.cargarIdiomas());
  }

  private buildInsights(languages: Language[], events: Event[], userLanguages: UserLanguage[]): LanguageInsight[] {
    return languages.map((language) => ({
      language,
      events: events.filter((event) => event.idIdioma === language.idIdioma).length,
      learners: userLanguages.filter((item) => item.idioma?.idIdioma === language.idIdioma).length,
    })).sort((a, b) => (b.events + b.learners) - (a.events + a.learners));
  }
}
