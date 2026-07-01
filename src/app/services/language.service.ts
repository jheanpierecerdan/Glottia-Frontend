import { Injectable, signal } from '@angular/core';

export type AppLanguage = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'glottia_language';
  private readonly state = signal<AppLanguage>(this.readLanguage());
  readonly current = this.state.asReadonly();
  private readonly labels: Record<string, string> = {
    Eventos: 'Events',
    Usuarios: 'Users',
    Roles: 'Roles',
    Idiomas: 'Languages',
    Intereses: 'Interests',
    Reservas: 'Reservations',
    Nombre: 'Name',
    Apellido: 'Last name',
    Correo: 'Email',
    Contrasena: 'Password',
    Ciudad: 'City',
    Modalidad: 'Format',
    Biografia: 'Biography',
    Activo: 'Active',
    Descripcion: 'Description',
    Titulo: 'Title',
    Fecha: 'Date',
    'Fecha y hora': 'Date and time',
    Cupo: 'Capacity',
    'Cupo maximo': 'Max capacity',
    Ubicacion: 'Location',
    'Enlace virtual': 'Virtual link',
    Imagen: 'Image',
    'Imagen referencial': 'Reference image',
    'Nivel sugerido': 'Suggested level',
    Estado: 'Status',
    'ID Idioma': 'Language ID',
    'ID Organizador': 'Organizer ID',
    'ID Usuario': 'User ID',
    'ID Evento': 'Event ID',
    'Fecha de reserva': 'Reservation date',
    Interes: 'Interest',
    Rol: 'Role',
    Tipo: 'Type',
    Nivel: 'Level',
  };

  constructor() {
    document.documentElement.lang = this.state();
  }

  set(language: AppLanguage): void {
    this.state.set(language);
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
  }

  t(es: string, en: string): string {
    return this.state() === 'en' ? en : es;
  }

  label(value: string): string {
    return this.state() === 'en' ? this.labels[value] ?? value : value;
  }

  private readLanguage(): AppLanguage {
    const value = localStorage.getItem(this.storageKey);
    return value === 'en' ? 'en' : 'es';
  }
}
