import { Component } from '@angular/core';
import { Reservations } from '../../../services/reservations';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { reservationFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar reserva" description="Edita los datos de la reserva seleccionada." basePath="/reservas" mode="update" idKey="idReserva" [fields]="fields" [service]="reservationsService" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = reservationFields;
  constructor(readonly reservationsService: Reservations) {}
}
