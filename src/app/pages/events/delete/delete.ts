import { Component } from '@angular/core';
import { Events } from '../../../services/events';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { eventFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar evento" description="Revisa el registro antes de eliminarlo." basePath="/eventos" mode="delete" idKey="idEvento" [fields]="fields" [service]="eventsService" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = eventFields;
  constructor(readonly eventsService: Events) {}
}
