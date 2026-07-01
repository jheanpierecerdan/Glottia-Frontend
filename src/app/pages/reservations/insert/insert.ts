import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Events } from '../../../services/events';
import { Reservations } from '../../../services/reservations';
import { Users } from '../../../services/users';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { ResourceFormField } from '../../../shared/resource-form/resource-form';
import { reservationFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form [title]="title" [description]="description" basePath="/reservas" mode="insert" idKey="idReserva" [fields]="fields" [service]="reservationsService" [submitLabel]="submitLabel" [successMessage]="successMessage" />`,
  styleUrl: './insert.scss',
})
export class Insert implements OnInit {
  fields: ResourceFormField[] = reservationFields;

  constructor(
    readonly reservationsService: Reservations,
    private readonly route: ActivatedRoute,
    private readonly usersService: Users,
    private readonly eventsService: Events,
  ) {}

  ngOnInit(): void {
    this.loadReadableOptions();
  }

  get isReserveFlow(): boolean {
    return this.route.snapshot.queryParamMap.has('idEvento');
  }

  get title(): string {
    return this.isReserveFlow ? 'Reservar cupo' : 'Registrar reserva';
  }

  get description(): string {
    return this.isReserveFlow
      ? 'Confirma tu participación y separa un cupo en el evento seleccionado.'
      : 'Registra una reserva vinculando usuario, evento, fecha y estado.';
  }

  get submitLabel(): string {
    return this.isReserveFlow ? 'Reservar cupo' : 'Guardar';
  }

  get successMessage(): string {
    return this.isReserveFlow ? 'Cupo reservado exitosamente.' : 'Guardado exitosamente.';
  }

  private loadReadableOptions(): void {
    forkJoin({
      users: this.usersService.getAll(),
      events: this.eventsService.getAll(),
    }).subscribe({
      next: ({ users, events }) => {
        this.fields = reservationFields.map((field) => {
          if (field.key === 'idUsuario') {
            return {
              ...field,
              label: 'Usuario',
              type: 'select',
              options: users
                .filter((user) => user.idUsuario)
                .map((user) => ({
                  value: user.idUsuario!,
                  label: `${user.nombre} ${user.apellido} - ${user.correo}`,
                })),
            };
          }

          if (field.key === 'idEvento') {
            return {
              ...field,
              label: 'Evento',
              type: 'select',
              options: events
                .filter((event) => event.idEvento)
                .map((event) => ({
                  value: event.idEvento!,
                  label: `${event.titulo} - ${this.formatDate(event.fechaHora)}`,
                })),
            };
          }

          return field;
        });
      },
    });
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  }
}
