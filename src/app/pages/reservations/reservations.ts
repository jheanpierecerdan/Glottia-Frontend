import { Component, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Reservations as ReservationsService, Reservation } from '../../services/reservations';
import { Events, Event } from '../../services/events';
import { Users, User } from '../../services/users';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ReservationDay {
  date: Date;
  key: string;
  number: number;
  currentMonth: boolean;
  today: boolean;
  reservations: Reservation[];
}

@Component({ selector: 'app-reservations', imports: [ResourceList, MatIconModule, RouterLink], templateUrl: './reservations.html', styleUrl: './reservations.scss' })
export class Reservations extends ResourcePage implements OnInit {
  readonly columns = [
    { key: 'idReserva', label: 'ID' }, { key: 'usuario', label: 'Usuario' },
    { key: 'evento', label: 'Evento' }, { key: 'fechaReserva', label: 'Fecha' },
    { key: 'estadoReserva', label: 'Estado' },
  ];
  reservations: Reservation[] = [];
  visibleReservations: Reservation[] = [];
  users: User[] = [];
  events: Event[] = [];
  reservationDays: ReservationDay[] = [];
  currentMonth = new Date();
  readonly weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: Users,
    private readonly eventsService: Events,
    readonly auth: AuthService,
  ) { super(); }
  ngOnInit(): void { this.cargarReservas(); }
  get pageTitle(): string {
    return this.auth.role() === 'ESTUDIANTE' ? 'Mis reservas' : 'Reservas de eventos';
  }
  get pageDescription(): string {
    return this.auth.role() === 'ESTUDIANTE'
      ? 'Consulta tus cupos separados y visualízalos en calendario según la fecha del evento.'
      : 'Supervisa las inscripciones y el movimiento real de usuarios dentro de la agenda.';
  }
  get confirmedCount(): number {
    return this.visibleReservations.filter((reservation) => this.isConfirmed(reservation.estadoReserva)).length;
  }
  get pendingCount(): number {
    return Math.max(this.visibleReservations.length - this.confirmedCount, 0);
  }
  get recentReservations(): Reservation[] {
    return [...this.visibleReservations]
      .sort((a, b) => new Date(b.fechaReserva ?? 0).getTime() - new Date(a.fechaReserva ?? 0).getTime())
      .slice(0, 5);
  }
  get monthTitle(): string {
    return this.currentMonth.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  }
  userName(idUsuario: number): string {
    const user = this.users.find((item) => item.idUsuario === idUsuario);
    return user ? `${user.nombre} ${user.apellido}` : `Usuario ${idUsuario}`;
  }
  eventName(idEvento: number): string {
    return this.events.find((item) => item.idEvento === idEvento)?.titulo ?? `Evento ${idEvento}`;
  }
  eventDate(idEvento: number): Date | null {
    const raw = this.events.find((item) => item.idEvento === idEvento)?.fechaHora;
    if (!raw) return null;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.buildReservationCalendar();
  }
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.buildReservationCalendar();
  }
  trackDay(_: number, day: ReservationDay): string { return day.key; }
  cargarReservas(): void {
    this.startLoading();
    forkJoin({
      reservations: this.reservationsService.getAll().pipe(catchError(() => of([] as Reservation[]))),
      users: this.usersService.getAll().pipe(catchError(() => of([] as User[]))),
      events: this.eventsService.getAll().pipe(catchError(() => of([] as Event[]))),
    }).pipe(finalize(() => this.finishLoading())).subscribe({
      next: ({ reservations, users, events }) => {
        this.reservations = reservations;
        this.users = users;
        this.events = events;
        const currentUser = users.find((user) => user.correo === this.auth.session()?.correo);
        this.visibleReservations = this.auth.role() === 'ESTUDIANTE' && currentUser?.idUsuario
          ? reservations.filter((reservation) => reservation.idUsuario === currentUser.idUsuario)
          : reservations;
        this.rows = this.visibleReservations.map((reservation) => ({
          ...reservation,
          usuario: this.userName(reservation.idUsuario),
          evento: this.eventName(reservation.idEvento),
        }));
        this.setInitialCalendarMonth();
        this.buildReservationCalendar();
      },
      error: () => this.showError(),
    });
  }

  eliminarReserva(id: number): void {
    this.deleteResource(this.reservationsService, id, () => this.cargarReservas());
  }

  private isConfirmed(value: string): boolean {
    return ['confirmada', 'confirmado', 'activo', 'activa'].includes((value ?? '').toLowerCase());
  }

  private setInitialCalendarMonth(): void {
    const firstDate = this.visibleReservations
      .map((reservation) => this.eventDate(reservation.idEvento))
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    if (firstDate) this.currentMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  }

  private buildReservationCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - startOffset);
    const grouped = this.groupReservationsByEventDate();
    const todayKey = this.dateKey(new Date());

    this.reservationDays = Array.from({ length: 35 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = this.dateKey(date);
      return {
        date,
        key,
        number: date.getDate(),
        currentMonth: date.getMonth() === month,
        today: key === todayKey,
        reservations: grouped.get(key) ?? [],
      };
    });
  }

  private groupReservationsByEventDate(): Map<string, Reservation[]> {
    const grouped = new Map<string, Reservation[]>();
    this.visibleReservations.forEach((reservation) => {
      const date = this.eventDate(reservation.idEvento);
      if (!date) return;
      const key = this.dateKey(date);
      grouped.set(key, [...(grouped.get(key) ?? []), reservation]);
    });
    return grouped;
  }

  private dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
