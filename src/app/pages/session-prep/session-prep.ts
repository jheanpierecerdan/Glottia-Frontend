import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Events, Event } from '../../services/events';

@Component({
  selector: 'app-session-prep',
  imports: [RouterLink, MatIconModule],
  templateUrl: './session-prep.html',
  styleUrl: './session-prep.scss',
})
export class SessionPrep implements OnInit {
  loading = true;
  events: Event[] = [];

  readonly checklist = [
    { icon: 'record_voice_over', title: 'Objetivo conversacional', text: 'Define qué habilidad se practicará: fluidez, pronunciación, escucha o vocabulario.' },
    { icon: 'forum', title: 'Dinámica inicial', text: 'Prepara una pregunta rompehielo para que el grupo empiece sin sentirse evaluado.' },
    { icon: 'psychology', title: 'Corrección amable', text: 'Anota errores comunes y conviértelos en tips al final de la sesión.' },
  ];

  constructor(private readonly eventsService: Events) {}

  ngOnInit(): void {
    this.eventsService.getAll().pipe(finalize(() => this.loading = false)).subscribe({
      next: (events) => this.events = this.nextEvents(events),
      error: () => this.events = [],
    });
  }

  eventDate(event: Event): string {
    if (!event.fechaHora) return 'Fecha por definir';
    return new Date(event.fechaHora).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  }

  private nextEvents(events: Event[]): Event[] {
    const now = Date.now();
    return [...events]
      .filter((event) => !event.fechaHora || new Date(event.fechaHora).getTime() >= now)
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
      .slice(0, 5);
  }
}
