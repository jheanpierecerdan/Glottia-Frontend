import { Component } from '@angular/core';
import { Events } from '../../../services/events';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { eventFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar agenda" description="Ajusta fecha, cupos, modalidad y detalles para mantener la agenda clara." basePath="/eventos" mode="update" idKey="idEvento" [fields]="fields" [service]="eventsService" submitLabel="Guardar cambios" successMessage="Agenda actualizada correctamente." />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = eventFields;
  constructor(readonly eventsService: Events) {}
}
