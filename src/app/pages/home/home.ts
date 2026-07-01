import { AfterViewInit, Component, ElementRef, HostListener, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FeedbackService } from '../../services/feedback';
import { Users } from '../../services/users';
import { AuthService } from '../../services/auth.service';
import { SoundService } from '../../services/sound.service';
import { ThemeService } from '../../services/theme.service';
import { AppLanguage, LanguageService } from '../../services/language.service';
import { BackendWakeupService } from '../../services/backend-wakeup.service';
import { IS_LOCAL_API } from '../../services/api.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  experienceReady = sessionStorage.getItem('glottia_experience') === 'ready';
  readonly copy: Record<string, Record<string, string>> = {
    es: {
      navHome: 'Inicio',
      navEvents: 'Eventos',
      navBenefits: 'Beneficios',
      navAbout: 'Nosotros',
      navContact: 'Contacto',
      navHelp: 'Ayuda',
      myPanel: 'Mi panel',
      logout: 'Salir',
      yourSpace: 'Tu espacio',
      users: 'Usuarios',
      roles: 'Roles',
      languages: 'Idiomas',
      interests: 'Intereses',
      calendarAgenda: 'Agenda calendario',
      eventsList: 'Lista de eventos',
      reservations: 'Reservas',
      closeSession: 'Cerrar sesion',
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro',
      login: 'Iniciar sesion',
      drawerTitle: 'Menu Glottia',
      drawerSubtitle: 'Explora tu comunidad',
      drawerNav: 'Navegacion',
      heroKicker: 'Encuentros linguisticos y cultura',
      heroTitle: 'Una forma mas natural de vivir los idiomas',
      heroText: 'Participa en sesiones por idioma, nivel y modalidad. Glottia reune conversacion guiada, intercambio cultural y comunidad en un solo espacio.',
      heroPrimary: 'Ingresar a Glottia',
      heroSecondary: 'Explorar agenda',
      statEvents: 'eventos',
      statLanguages: 'idiomas',
      statLevels: 'niveles',
      agendaLabel: 'Agenda viva de Glottia',
      agendaTitle: 'Una agenda abierta al intercambio cultural',
      agendaText: 'Elige una sesion breve, comparte ideas y fortalece tu fluidez en un entorno cuidado.',
      benefitsTitle: 'Aprendizaje conversacional con una experiencia cuidada',
      benefitsText: 'Glottia combina practica guiada, comunidad y eventos de aforo reducido para acompanar tu progreso con claridad.',
      eventsTitle: 'Eventos disenados para ganar fluidez',
      eventsText: 'Encuentra una sesion que encaje con tu idioma, tu nivel y tu ritmo de aprendizaje.',
      aboutTitle: 'Quienes somos?',
      testimonialsTitle: 'Testimonios',
      howTitle: 'Como funciona Glottia',
      howText: 'El flujo es simple: crea tu cuenta, elige un evento, reserva tu cupo y revisa tu agenda.',
      helpTitle: 'Centro de ayuda',
      helpText: 'Canales para resolver dudas frecuentes sobre reservas, eventos, perfiles y acceso.',
      appLabel: 'App movil',
      appTitle: 'Descarga Glottia para seguir practicando desde cualquier lugar',
      appText: 'Accede a una experiencia movil para revisar eventos y continuar tu aprendizaje.',
      signupLabel: 'Tu agenda linguistica empieza aqui',
      signupTitle: 'Accede a experiencias conversacionales disenadas para avanzar',
      signupText: 'Registrate y descubre eventos donde puedas participar segun tu idioma, nivel y modalidad.',
    },
    en: {
      navHome: 'Home',
      navEvents: 'Events',
      navBenefits: 'Benefits',
      navAbout: 'About',
      navContact: 'Contact',
      navHelp: 'Help',
      myPanel: 'My dashboard',
      logout: 'Log out',
      yourSpace: 'Your space',
      users: 'Users',
      roles: 'Roles',
      languages: 'Languages',
      interests: 'Interests',
      calendarAgenda: 'Calendar agenda',
      eventsList: 'Events list',
      reservations: 'Reservations',
      closeSession: 'Sign out',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      login: 'Sign in',
      drawerTitle: 'Glottia Menu',
      drawerSubtitle: 'Explore your community',
      drawerNav: 'Navigation',
      heroKicker: 'Language meetups and culture',
      heroTitle: 'A more natural way to experience languages',
      heroText: 'Join sessions by language, level and format. Glottia brings guided conversation, cultural exchange and community into one space.',
      heroPrimary: 'Enter Glottia',
      heroSecondary: 'Explore agenda',
      statEvents: 'events',
      statLanguages: 'languages',
      statLevels: 'levels',
      agendaLabel: 'Glottia live agenda',
      agendaTitle: 'An open agenda for cultural exchange',
      agendaText: 'Choose a short session, share ideas and strengthen your fluency in a supportive space.',
      benefitsTitle: 'Conversational learning with a thoughtful experience',
      benefitsText: 'Glottia combines guided practice, community and small-group events to support your progress clearly.',
      eventsTitle: 'Events designed to build fluency',
      eventsText: 'Find a session that matches your language, level and learning pace.',
      aboutTitle: 'Who are we?',
      testimonialsTitle: 'Testimonials',
      howTitle: 'How Glottia works',
      howText: 'The flow is simple: create your account, choose an event, reserve your spot and check your agenda.',
      helpTitle: 'Help Center',
      helpText: 'Channels to solve common questions about reservations, events, profiles and access.',
      appLabel: 'Mobile app',
      appTitle: 'Download Glottia to keep practicing anywhere',
      appText: 'Access a mobile experience to review events and continue your learning.',
      signupLabel: 'Your language agenda starts here',
      signupTitle: 'Access conversational experiences designed for progress',
      signupText: 'Sign up and discover events where you can participate by language, level and format.',
    },
  };
  scrollProgress = 0;
  readonly eventCount = signal(0);
  readonly languageCount = signal(0);
  readonly levelCount = signal(0);
  private countersStarted = false;
  readonly signupForm = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    apellido: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    contrasena: new FormControl('', { nonNullable: true }),
    ciudad: new FormControl('', { nonNullable: true }),
    modalidad: new FormControl('', { nonNullable: true }),
    idRol: new FormControl<number | null>(null),
    biografia: new FormControl('', { nonNullable: true }),
    estado: new FormControl(true, { nonNullable: true }),
  });

  menuOpen = false;
  savingSignup = false;
  signupError = '';

  constructor(
    readonly feedback: FeedbackService,
    readonly usersService: Users,
    private readonly router: Router,
    readonly auth: AuthService,
    readonly sounds: SoundService,
    readonly theme: ThemeService,
    readonly language: LanguageService,
    private readonly backendWakeup: BackendWakeupService,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {
    if (!IS_LOCAL_API) this.backendWakeup.wake();
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

    setTimeout(() => {
      const root = this.elementRef.nativeElement;
      root
        .querySelectorAll([
          '.section-heading',
          '.community-pulse header',
          '.pulse-feed article',
          '.benefit-card',
          '.event-card',
          '.about-section > h2',
          '.about-copy',
          '.about-layout img',
          '.testimonials-section > h2',
          '.testimonial-card',
          '.signup-copy',
          '.signup-form',
          '.site-footer',
          '.footer-brand',
          '.footer-links',
          '.footer-contact',
          '.footer-device',
        ].join(', '))
        .forEach((element) => {
          element.classList.add('reveal-on-scroll');
          observer.observe(element);
        });

      root.querySelectorAll<HTMLElement>('.pulse-feed article, .benefit-card, .event-card').forEach((card) => {
        card.classList.add('tilt-card');
        card.addEventListener('pointermove', (event) => this.tiltCard(event, card));
        card.addEventListener('pointerleave', () => {
          card.style.removeProperty('--tilt-x');
          card.style.removeProperty('--tilt-y');
        });
      });

      if (this.experienceReady) this.animateCounters();
    });
  }

  @HostListener('window:scroll')
  updateScrollProgress(): void {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = maximum > 0 ? Math.min(100, (window.scrollY / maximum) * 100) : 0;
  }

  moveHeroGlow(event: MouseEvent): void {
    const hero = event.currentTarget as HTMLElement;
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
    hero.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
  }

  get isLandingPage(): boolean {
    return this.router.url.split('#')[0] === '/';
  }

  goToSection(sectionId: string): void {
    this.menuOpen = false;

    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    const label = language === 'en' ? 'English' : 'Español';
    this.feedback.show(`Idioma de interfaz cambiado a ${label}.`);
  }

  t(key: string): string {
    return this.copy[this.language.current()]?.[key] ?? this.copy['es'][key] ?? key;
  }

  sessionName(): string {
    const name = this.auth.session()?.nombre ?? '';
    return this.language.current() === 'en' && name.toLowerCase() === 'invitado' ? 'Guest' : name;
  }

  roleName(): string {
    const role = this.auth.role();
    const labels: Record<string, string> = {
      ADMINISTRADOR: this.language.t('Administrador', 'Administrator'),
      ORGANIZADOR: this.language.t('Organizador', 'Organizer'),
      DOCENTE: this.language.t('Docente', 'Teacher'),
      ESTUDIANTE: this.language.t('Estudiante', 'Student'),
    };
    return role ? labels[role] ?? role : '';
  }

  activateExperience(): void {
    this.experienceReady = true;
    sessionStorage.setItem('glottia_experience', 'ready');
    this.sounds.welcome();
    this.animateCounters();
  }

  private tiltCard(event: PointerEvent, card: HTMLElement): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
  }

  private animateCounters(): void {
    if (this.countersStarted) return;
    this.countersStarted = true;
    const start = performance.now();
    const duration = 1400;
    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.eventCount.set(Math.round(120 * eased));
      this.languageCount.set(Math.round(8 * eased));
      this.levelCount.set(Math.round(3 * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
    this.feedback.show('Sesión cerrada. ¡Hasta pronto!');
    void this.router.navigate(['/']);
  }

  createUserFromHome(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const value = this.signupForm.getRawValue();
    const payload = {
      nombre: value.nombre,
      apellido: value.apellido,
      correo: value.correo,
      ...(value.contrasena ? { contrasena: value.contrasena } : {}),
      ...(value.ciudad ? { ciudad: value.ciudad } : {}),
      ...(value.modalidad ? { modalidad: value.modalidad } : {}),
      idRol: undefined,
      ...(value.biografia ? { biografia: value.biografia } : {}),
      estado: value.estado,
    };

    this.savingSignup = true;
    this.signupError = '';

    this.usersService.create(payload).pipe(finalize(() => this.savingSignup = false)).subscribe({
      next: () => {
        this.feedback.show('Usuario registrado exitosamente. Ya puedes iniciar sesión.');
        this.sounds.success();
        this.signupForm.reset({ estado: true });
      },
      error: () => {
        this.signupError = 'No se pudo registrar el usuario. Revisa los datos e intenta nuevamente.';
      },
    });
  }
}
