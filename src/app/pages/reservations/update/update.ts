import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Events } from '../../../services/events';
import { Reservations } from '../../../services/reservations';
import { Users } from '../../../services/users';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { ResourceFormField } from '../../../shared/resource-form/resource-form';
import { reservationFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar reserva" description="Edita los datos de la reserva seleccionada." basePath="/reservas" mode="update" idKey="idReserva" [fields]="fields" [service]="reservationsService" />`,
  styleUrl: './update.scss',
})
export class Update implements OnInit {
  fields: ResourceFormField[] = reservationFields;

  constructor(
    readonly reservationsService: Reservations,
    private readonly usersService: Users,
    private readonly eventsService: Events,
  ) {}

  ngOnInit(): void {
    this.loadReadableOptions();
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
