import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserRole } from '../../services/auth.service';
import { Events, Event } from '../../services/events';
import { Reservations, Reservation } from '../../services/reservations';
import { Roles, Role } from '../../services/roles';
import { Users, User } from '../../services/users';

interface MetricCard {
  label: string;
  value: number | string;
  detail: string;
  icon: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: string;
  route: string;
  accent: 'rose' | 'mint' | 'violet' | 'amber';
}

interface RoleStat {
  name: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  loading = true;
  error = '';
  metrics: MetricCard[] = [];
  actions: QuickAction[] = [];
  roleStats: RoleStat[] = [];
  upcomingEvents: Event[] = [];
  reservations: Reservation[] = [];
  activeUsers = 0;
  inactiveUsers = 0;
  studentCount = 0;

  constructor(
    readonly auth: AuthService,
    private readonly usersService: Users,
    private readonly rolesService: Roles,
    private readonly eventsService: Events,
    private readonly reservationsService: Reservations,
  ) {}

  ngOnInit(): void {
    this.actions = this.actionsFor(this.role);
    this.loadDashboard();
  }

  get role(): UserRole {
    return this.auth.role() ?? 'ESTUDIANTE';
  }

  get greeting(): string {
    return ({
      ADMINISTRADOR: 'Centro de control Glottia',
      ORGANIZADOR: 'Cabina de producción de eventos',
      DOCENTE: 'Sala de acompañamiento docente',
      ESTUDIANTE: 'Tu ruta de práctica conversacional',
    } as const)[this.role];
  }

  get intro(): string {
    return ({
      ADMINISTRADOR: 'Mira la salud de la comunidad, usuarios activos y accesos clave desde un solo lugar.',
      ORGANIZADOR: 'Planifica encuentros, revisa la agenda y mantén viva la experiencia de la comunidad.',
      DOCENTE: 'Encuentra sesiones, prepara dinámicas y acompaña a los estudiantes con una vista más clara.',
      ESTUDIANTE: 'Explora eventos disponibles, reserva cupos y continúa tu avance sin perderte entre formularios.',
    } as const)[this.role];
  }

  get roleLabel(): string {
    return ({
      ADMINISTRADOR: 'Administrador',
      ORGANIZADOR: 'Organizador',
      DOCENTE: 'Docente',
      ESTUDIANTE: 'Estudiante',
    } as const)[this.role];
  }

  get showAdminChart(): boolean {
    return this.role === 'ADMINISTRADOR' && this.roleStats.length > 0;
  }

  trackByLabel(_: number, item: MetricCard | QuickAction): string {
    return item.label;
  }

  trackByEvent(_: number, event: Event): number | string {
    return event.idEvento ?? event.titulo;
  }

  private loadDashboard(): void {
    this.loading = true;
    this.error = '';

    if (this.role === 'ADMINISTRADOR') {
      forkJoin({
        users: this.usersService.getAll().pipe(catchError(() => of([] as User[]))),
        roles: this.rolesService.getAll().pipe(catchError(() => of([] as Role[]))),
        events: this.eventsService.getAll().pipe(catchError(() => of([] as Event[]))),
        reservations: this.reservationsService.getAll().pipe(catchError(() => of([] as Reservation[]))),
      }).pipe(finalize(() => this.loading = false)).subscribe(({ users, roles, events, reservations }) => {
        this.upcomingEvents = this.nextEvents(events);
        this.reservations = reservations.slice(0, 4);
        this.activeUsers = users.filter((user) => user.estado !== false).length;
        this.inactiveUsers = Math.max(users.length - this.activeUsers, 0);
        this.roleStats = this.buildRoleStats(users, roles);
        this.studentCount = this.countStudents(this.roleStats);
        this.metrics = [
          { label: 'Usuarios registrados', value: users.length, detail: `${this.activeUsers} activos en la comunidad`, icon: 'groups' },
          { label: 'Estudiantes registrados', value: this.studentCount, detail: 'Alumnos detectados desde roles reales', icon: 'school' },
          { label: 'Eventos publicados', value: events.length, detail: `${this.upcomingEvents.length} próximos en agenda`, icon: 'event_available' },
          { label: 'Reservas creadas', value: reservations.length, detail: 'Movimiento real dentro de Glottia', icon: 'confirmation_number' },
          { label: 'Roles configurados', value: roles.length || '—', detail: 'Permisos y accesos diferenciados', icon: 'admin_panel_settings' },
        ];
      });
      return;
    }

    const requests = {
      events: this.eventsService.getAll().pipe(catchError(() => of([] as Event[]))),
      reservations: of([] as Reservation[]),
    };

    forkJoin(requests).pipe(finalize(() => this.loading = false)).subscribe(({ events, reservations }) => {
      this.upcomingEvents = this.nextEvents(events);
      this.reservations = reservations.slice(0, 4);
      this.metrics = this.metricsFor(this.role, events, reservations);
    });
  }

  private metricsFor(role: UserRole, events: Event[], reservations: Reservation[]): MetricCard[] {
    const future = this.nextEvents(events).length;
    if (role === 'ESTUDIANTE') {
      return [
        { label: 'Eventos disponibles', value: events.length, detail: `${future} encuentros próximos para practicar`, icon: 'travel_explore' },
        { label: 'Mis reservas', value: 'Ver', detail: 'Accede rápido a tus inscripciones', icon: 'bookmark_added' },
        { label: 'Modalidades', value: this.countModalities(events), detail: 'Presencial, virtual o mixta según agenda', icon: 'hub' },
      ];
    }
    if (role === 'DOCENTE') {
      return [
        { label: 'Sesiones activas', value: events.length, detail: `${future} espacios para acompañar`, icon: 'school' },
        { label: 'Formatos de práctica', value: this.countModalities(events), detail: 'Dinámicas adaptadas a cada modalidad', icon: 'psychology' },
        { label: 'Acción principal', value: 'Guía', detail: 'Revisar eventos y preparar participación', icon: 'auto_stories' },
      ];
    }
    return [
      { label: 'Eventos gestionables', value: events.length, detail: `${future} encuentros próximos`, icon: 'event_note' },
      { label: 'Modalidades activas', value: this.countModalities(events), detail: 'Organiza experiencias variadas', icon: 'diversity_3' },
      { label: 'Acción principal', value: 'Crear', detail: 'Publica o actualiza encuentros', icon: 'add_circle' },
    ];
  }

  private actionsFor(role: UserRole): QuickAction[] {
    const sharedEvents: QuickAction = {
      label: 'Ver agenda calendario',
      description: 'Revisar eventos ubicados en su fecha real.',
      icon: 'event',
      route: '/agenda',
      accent: 'rose',
    };

    const byRole: Record<UserRole, QuickAction[]> = {
      ADMINISTRADOR: [
        { label: 'Gestionar usuarios', description: 'Crear, editar y revisar perfiles registrados.', icon: 'manage_accounts', route: '/usuarios', accent: 'rose' },
        { label: 'Configurar roles', description: 'Mantener permisos y perfiles de acceso.', icon: 'admin_panel_settings', route: '/roles', accent: 'violet' },
        { label: 'Idiomas e intereses', description: 'Organizar catálogos para conectar mejor a la comunidad.', icon: 'translate', route: '/idiomas', accent: 'mint' },
        { label: 'Revisar reservas', description: 'Supervisar inscripciones y movimiento por evento.', icon: 'fact_check', route: '/reservas', accent: 'amber' },
      ],
      ORGANIZADOR: [
        { label: 'Crear evento', description: 'Diseñar un nuevo encuentro con cupos y modalidad.', icon: 'add_task', route: '/eventos/insert', accent: 'rose' },
        sharedEvents,
        { label: 'Actualizar agenda', description: 'Mantener fechas, cupos y modalidades listas para la comunidad.', icon: 'edit_calendar', route: '/eventos', accent: 'amber' },
      ],
      DOCENTE: [
        sharedEvents,
        { label: 'Preparar sesión', description: 'Revisar próximos encuentros y guía docente.', icon: 'menu_book', route: '/preparar-sesion', accent: 'mint' },
      ],
      ESTUDIANTE: [
        sharedEvents,
        { label: 'Reservar cupo', description: 'Inscribirte en una experiencia conversacional.', icon: 'bookmark_add', route: '/reservas/insert', accent: 'mint' },
        { label: 'Mis reservas', description: 'Consultar tus participaciones y estados.', icon: 'collections_bookmark', route: '/reservas', accent: 'violet' },
      ],
    };
    return byRole[role];
  }

  private buildRoleStats(users: User[], roles: Role[]): RoleStat[] {
    const roleNames = new Map(roles.map((role) => [role.idRol, this.prettyRole(role.nombre)]));
    const fallback = new Map<number, string>([
      [1, 'Administrador'],
      [2, 'Organizador'],
      [3, 'Docente'],
      [4, 'Estudiante'],
    ]);
    const counts = new Map<string, number>();
    users.forEach((user) => {
      const name = roleNames.get(user.idRol) ?? fallback.get(user.idRol ?? 0) ?? 'Sin rol';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    const total = Math.max(users.length, 1);
    return Array.from(counts, ([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }

  private nextEvents(events: Event[]): Event[] {
    const now = Date.now();
    return [...events]
      .filter((event) => !event.fechaHora || new Date(event.fechaHora).getTime() >= now)
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
      .slice(0, 4);
  }

  private countModalities(events: Event[]): number {
    return new Set(events.map((event) => event.modalidad).filter(Boolean)).size || 1;
  }

  private countStudents(stats: RoleStat[]): number {
    return stats.find((stat) => stat.name.toLowerCase().includes('estudiante'))?.count ?? 0;
  }

  private prettyRole(value: string): string {
    return value.toLowerCase().replace(/(^|\s|_)\S/g, (letter) => letter.replace('_', ' ').toUpperCase());
  }
}
