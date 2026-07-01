import { Component, OnInit } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Events, Event } from '../../services/events';
import { buildGoogleCalendarUrl } from '../../services/google-calendar';
import { LanguageService } from '../../services/language.service';

registerLocaleData(localeEsPe);

interface CalendarDay {
  date: Date;
  key: string;
  number: number;
  currentMonth: boolean;
  today: boolean;
  events: Event[];
}

@Component({
  selector: 'app-agenda',
  imports: [RouterLink, MatIconModule, DatePipe],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda implements OnInit {
  loading = true;
  error = '';
  events: Event[] = [];
  days: CalendarDay[] = [];
  selectedDay: CalendarDay | null = null;
  currentMonth = new Date();
  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  constructor(private readonly eventsService: Events, readonly language: LanguageService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  get monthTitle(): string {
    const month = this.monthNames[this.currentMonth.getMonth()];
    return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${this.currentMonth.getFullYear()}`;
  }

  get monthEvents(): Event[] {
    const month = this.currentMonth.getMonth();
    const year = this.currentMonth.getFullYear();
    return this.events
      .filter((event) => {
        const date = this.eventDate(event);
        return date && date.getMonth() === month && date.getFullYear() === year;
      })
      .sort((a, b) => this.eventDate(a)!.getTime() - this.eventDate(b)!.getTime());
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }

  goToday(): void {
    this.currentMonth = new Date();
    this.buildCalendar();
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day;
  }

  eventTime(event: Event): string {
    const date = this.eventDate(event);
    return date ? date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : 'Por definir';
  }

  googleCalendarUrl(event: Event): string {
    return buildGoogleCalendarUrl(event);
  }

  trackDay(_: number, day: CalendarDay): string {
    return day.key;
  }

  trackEvent(_: number, event: Event): number | string {
    return event.idEvento ?? `${event.titulo}-${event.fechaHora}`;
  }

  private loadEvents(): void {
    this.loading = true;
    this.eventsService.getAll().pipe(finalize(() => this.loading = false)).subscribe({
      next: (events) => {
        this.events = events;
        const firstUpcoming = this.events
          .map((event) => this.eventDate(event))
          .filter((date): date is Date => Boolean(date))
          .filter((date) => date.getTime() >= Date.now())
          .sort((a, b) => a.getTime() - b.getTime())[0];
        if (firstUpcoming) this.currentMonth = new Date(firstUpcoming.getFullYear(), firstUpcoming.getMonth(), 1);
        this.buildCalendar();
      },
      error: () => {
        this.error = 'No se pudo cargar la agenda. Revisa que el backend local esté encendido.';
        this.buildCalendar();
      },
    });
  }

  private buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - startOffset);
    const eventsByDate = this.groupEventsByDate();
    const todayKey = this.dateKey(new Date());

    this.days = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = this.dateKey(date);
      return {
        date,
        key,
        number: date.getDate(),
        currentMonth: date.getMonth() === month,
        today: key === todayKey,
        events: eventsByDate.get(key) ?? [],
      };
    });

    this.selectedDay = this.days.find((day) => day.today && day.currentMonth)
      ?? this.days.find((day) => day.events.length > 0 && day.currentMonth)
      ?? this.days.find((day) => day.currentMonth)
      ?? null;
  }

  private groupEventsByDate(): Map<string, Event[]> {
    const grouped = new Map<string, Event[]>();
    this.events.forEach((event) => {
      const date = this.eventDate(event);
      if (!date) return;
      const key = this.dateKey(date);
      grouped.set(key, [...(grouped.get(key) ?? []), event]);
    });
    grouped.forEach((items, key) => grouped.set(key, items.sort((a, b) => this.eventDate(a)!.getTime() - this.eventDate(b)!.getTime())));
    return grouped;
  }

  private eventDate(event: Event): Date | null {
    if (!event.fechaHora) return null;
    const date = new Date(event.fechaHora);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
