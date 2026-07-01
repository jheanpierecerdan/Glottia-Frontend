import { Component, OnInit, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserRole } from '../../services/auth.service';
import { Events, Event } from '../../services/events';
import { Reservations, Reservation } from '../../services/reservations';
import { Roles, Role } from '../../services/roles';
import { Users, User } from '../../services/users';
import { LanguageService } from '../../services/language.service';

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
  private loadedUsers: User[] = [];
  private loadedRoles: Role[] = [];
  private loadedEvents: Event[] = [];
  private loadedReservations: Reservation[] = [];

  constructor(
    readonly auth: AuthService,
    private readonly usersService: Users,
    private readonly rolesService: Roles,
    private readonly eventsService: Events,
    private readonly reservationsService: Reservations,
    readonly language: LanguageService,
  ) {
    effect(() => {
      this.language.current();
      this.rebuildTranslatedState();
    });
  }

  ngOnInit(): void {
    this.actions = this.actionsFor(this.role);
    this.loadDashboard();
  }

  get role(): UserRole {
    return this.auth.role() ?? 'ESTUDIANTE';
  }

  get greeting(): string {
    return ({
      ADMINISTRADOR: this.language.t('Centro de control Glottia', 'Glottia control center'),
      ORGANIZADOR: this.language.t('Cabina de produccion de eventos', 'Event production cockpit'),
      DOCENTE: this.language.t('Sala de acompanamiento docente', 'Teacher guidance room'),
      ESTUDIANTE: this.language.t('Tu ruta de practica conversacional', 'Your conversation practice path'),
    } as const)[this.role];
  }

  get intro(): string {
    return ({
      ADMINISTRADOR: this.language.t('Mira la salud de la comunidad, usuarios activos y accesos clave desde un solo lugar.', 'Check community health, active users and key shortcuts from one place.'),
      ORGANIZADOR: this.language.t('Planifica encuentros, revisa la agenda y manten viva la experiencia de la comunidad.', 'Plan meetups, review the agenda and keep the community experience alive.'),
      DOCENTE: this.language.t('Encuentra sesiones, prepara dinamicas y acompana a los estudiantes con una vista mas clara.', 'Find sessions, prepare activities and support students with a clearer view.'),
      ESTUDIANTE: this.language.t('Explora eventos disponibles, reserva cupos y continua tu avance sin perderte entre formularios.', 'Explore available events, reserve spots and keep moving without getting lost in forms.'),
    } as const)[this.role];
  }

  get roleLabel(): string {
    return ({
      ADMINISTRADOR: this.language.t('Administrador', 'Administrator'),
      ORGANIZADOR: this.language.t('Organizador', 'Organizer'),
      DOCENTE: this.language.t('Docente', 'Teacher'),
      ESTUDIANTE: this.language.t('Estudiante', 'Student'),
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
        this.loadedUsers = users;
        this.loadedRoles = roles;
        this.loadedEvents = events;
        this.loadedReservations = reservations;
        this.upcomingEvents = this.nextEvents(events);
        this.reservations = reservations.slice(0, 4);
        this.activeUsers = users.filter((user) => user.estado !== false).length;
        this.inactiveUsers = Math.max(users.length - this.activeUsers, 0);
        this.roleStats = this.buildRoleStats(users, roles);
        this.studentCount = this.countStudents(this.roleStats);
        this.rebuildTranslatedState();
      });
      return;
    }

    forkJoin({
      events: this.eventsService.getAll().pipe(catchError(() => of([] as Event[]))),
      reservations: of([] as Reservation[]),
    }).pipe(finalize(() => this.loading = false)).subscribe(({ events, reservations }) => {
      this.loadedEvents = events;
      this.loadedReservations = reservations;
      this.upcomingEvents = this.nextEvents(events);
      this.reservations = reservations.slice(0, 4);
      this.rebuildTranslatedState();
    });
  }

  private rebuildTranslatedState(): void {
    this.actions = this.actionsFor(this.role);

    if (this.role === 'ADMINISTRADOR') {
      this.activeUsers = this.loadedUsers.filter((user) => user.estado !== false).length;
      this.inactiveUsers = Math.max(this.loadedUsers.length - this.activeUsers, 0);
      this.upcomingEvents = this.nextEvents(this.loadedEvents);
      this.reservations = this.loadedReservations.slice(0, 4);
      this.roleStats = this.buildRoleStats(this.loadedUsers, this.loadedRoles);
      this.studentCount = this.countStudents(this.roleStats);
      this.metrics = [
        { label: this.language.t('Usuarios registrados', 'Registered users'), value: this.loadedUsers.length, detail: this.language.t(`${this.activeUsers} activos en la comunidad`, `${this.activeUsers} active in the community`), icon: 'groups' },
        { label: this.language.t('Estudiantes registrados', 'Registered students'), value: this.studentCount, detail: this.language.t('Alumnos detectados desde roles reales', 'Students detected from real roles'), icon: 'school' },
        { label: this.language.t('Eventos publicados', 'Published events'), value: this.loadedEvents.length, detail: this.language.t(`${this.upcomingEvents.length} proximos en agenda`, `${this.upcomingEvents.length} upcoming in agenda`), icon: 'event_available' },
        { label: this.language.t('Reservas creadas', 'Created reservations'), value: this.loadedReservations.length, detail: this.language.t('Movimiento real dentro de Glottia', 'Real activity inside Glottia'), icon: 'confirmation_number' },
        { label: this.language.t('Roles configurados', 'Configured roles'), value: this.loadedRoles.length || '-', detail: this.language.t('Permisos y accesos diferenciados', 'Permissions and differentiated access'), icon: 'admin_panel_settings' },
      ];
      return;
    }

    this.upcomingEvents = this.nextEvents(this.loadedEvents);
    this.reservations = this.loadedReservations.slice(0, 4);
    this.metrics = this.metricsFor(this.role, this.loadedEvents);
  }

  private metricsFor(role: UserRole, events: Event[]): MetricCard[] {
    const future = this.nextEvents(events).length;
    if (role === 'ESTUDIANTE') {
      return [
        { label: this.language.t('Eventos disponibles', 'Available events'), value: events.length, detail: this.language.t(`${future} encuentros proximos para practicar`, `${future} upcoming meetups to practice`), icon: 'travel_explore' },
        { label: this.language.t('Mis reservas', 'My reservations'), value: this.language.t('Ver', 'View'), detail: this.language.t('Accede rapido a tus inscripciones', 'Quickly access your registrations'), icon: 'bookmark_added' },
        { label: this.language.t('Modalidades', 'Formats'), value: this.countModalities(events), detail: this.language.t('Presencial, virtual o mixta segun agenda', 'In-person, virtual or mixed depending on agenda'), icon: 'hub' },
      ];
    }
    if (role === 'DOCENTE') {
      return [
        { label: this.language.t('Sesiones activas', 'Active sessions'), value: events.length, detail: this.language.t(`${future} espacios para acompanar`, `${future} spaces to support`), icon: 'school' },
        { label: this.language.t('Formatos de practica', 'Practice formats'), value: this.countModalities(events), detail: this.language.t('Dinamicas adaptadas a cada modalidad', 'Activities adapted to each format'), icon: 'psychology' },
        { label: this.language.t('Accion principal', 'Main action'), value: this.language.t('Guia', 'Guide'), detail: this.language.t('Revisar eventos y preparar participacion', 'Review events and prepare participation'), icon: 'auto_stories' },
      ];
    }
    return [
      { label: this.language.t('Eventos gestionables', 'Manageable events'), value: events.length, detail: this.language.t(`${future} encuentros proximos`, `${future} upcoming meetups`), icon: 'event_note' },
      { label: this.language.t('Modalidades activas', 'Active formats'), value: this.countModalities(events), detail: this.language.t('Organiza experiencias variadas', 'Organize varied experiences'), icon: 'diversity_3' },
      { label: this.language.t('Accion principal', 'Main action'), value: this.language.t('Crear', 'Create'), detail: this.language.t('Publica o actualiza encuentros', 'Publish or update meetups'), icon: 'add_circle' },
    ];
  }

  private actionsFor(role: UserRole): QuickAction[] {
    const sharedEvents: QuickAction = {
      label: this.language.t('Ver agenda calendario', 'View calendar agenda'),
      description: this.language.t('Revisar eventos ubicados en su fecha real.', 'Review events placed on their real date.'),
      icon: 'event',
      route: '/agenda',
      accent: 'rose',
    };

    const byRole: Record<UserRole, QuickAction[]> = {
      ADMINISTRADOR: [
        { label: this.language.t('Gestionar usuarios', 'Manage users'), description: this.language.t('Crear, editar y revisar perfiles registrados.', 'Create, edit and review registered profiles.'), icon: 'manage_accounts', route: '/usuarios', accent: 'rose' },
        { label: this.language.t('Configurar roles', 'Configure roles'), description: this.language.t('Mantener permisos y perfiles de acceso.', 'Maintain permissions and access profiles.'), icon: 'admin_panel_settings', route: '/roles', accent: 'violet' },
        { label: this.language.t('Idiomas e intereses', 'Languages and interests'), description: this.language.t('Organizar catalogos para conectar mejor a la comunidad.', 'Organize catalogs to better connect the community.'), icon: 'translate', route: '/idiomas', accent: 'mint' },
        { label: this.language.t('Revisar reservas', 'Review reservations'), description: this.language.t('Supervisar inscripciones y movimiento por evento.', 'Supervise registrations and event activity.'), icon: 'fact_check', route: '/reservas', accent: 'amber' },
      ],
      ORGANIZADOR: [
        { label: this.language.t('Crear evento', 'Create event'), description: this.language.t('Disenar un nuevo encuentro con cupos y modalidad.', 'Design a new meetup with spots and format.'), icon: 'add_task', route: '/eventos/insert', accent: 'rose' },
        sharedEvents,
        { label: this.language.t('Actualizar agenda', 'Update agenda'), description: this.language.t('Mantener fechas, cupos y modalidades listas para la comunidad.', 'Keep dates, spots and formats ready for the community.'), icon: 'edit_calendar', route: '/eventos', accent: 'amber' },
      ],
      DOCENTE: [
        sharedEvents,
        { label: this.language.t('Preparar sesion', 'Prepare session'), description: this.language.t('Revisar proximos encuentros y guia docente.', 'Review upcoming meetups and teacher guide.'), icon: 'menu_book', route: '/preparar-sesion', accent: 'mint' },
      ],
      ESTUDIANTE: [
        sharedEvents,
        { label: this.language.t('Reservar cupo', 'Reserve spot'), description: this.language.t('Inscribirte en una experiencia conversacional.', 'Register for a conversation experience.'), icon: 'bookmark_add', route: '/reservas/insert', accent: 'mint' },
        { label: this.language.t('Mis reservas', 'My reservations'), description: this.language.t('Consultar tus participaciones y estados.', 'Check your participations and statuses.'), icon: 'collections_bookmark', route: '/reservas', accent: 'violet' },
      ],
    };
    return byRole[role];
  }

  private buildRoleStats(users: User[], roles: Role[]): RoleStat[] {
    const roleNames = new Map(roles.map((role) => [role.idRol, this.prettyRole(role.nombre)]));
    const fallback = new Map<number, string>([
      [1, this.language.t('Administrador', 'Administrator')],
      [2, this.language.t('Organizador', 'Organizer')],
      [3, this.language.t('Docente', 'Teacher')],
      [4, this.language.t('Estudiante', 'Student')],
    ]);
    const counts = new Map<string, number>();
    users.forEach((user) => {
      const name = roleNames.get(user.idRol) ?? fallback.get(user.idRol ?? 0) ?? this.language.t('Sin rol', 'No role');
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
    return stats.find((stat) => stat.name.toLowerCase().includes('estudiante') || stat.name.toLowerCase().includes('student'))?.count ?? 0;
  }

  private prettyRole(value: string): string {
    const normalized = value.toLowerCase();
    if (normalized.includes('admin')) return this.language.t('Administrador', 'Administrator');
    if (normalized.includes('organ')) return this.language.t('Organizador', 'Organizer');
    if (normalized.includes('doc')) return this.language.t('Docente', 'Teacher');
    if (normalized.includes('est') || normalized.includes('student')) return this.language.t('Estudiante', 'Student');
    return value;
  }
}
