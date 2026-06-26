import { Component } from '@angular/core';
import { Reservations } from '../../../services/reservations';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { reservationFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar reserva" description="Revisa el registro antes de eliminarlo." basePath="/reservas" mode="delete" idKey="idReserva" [fields]="fields" [service]="reservationsService" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = reservationFields;
  constructor(readonly reservationsService: Reservations) {}
}
