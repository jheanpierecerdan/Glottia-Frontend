import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservations } from '../../../services/reservations';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { reservationFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form [title]="title" [description]="description" basePath="/reservas" mode="insert" idKey="idReserva" [fields]="fields" [service]="reservationsService" [submitLabel]="submitLabel" [successMessage]="successMessage" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = reservationFields;

  constructor(
    readonly reservationsService: Reservations,
    private readonly route: ActivatedRoute,
  ) {}

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
}
