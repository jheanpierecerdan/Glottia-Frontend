import { Component } from '@angular/core';
import { Events } from '../../../services/events';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { eventFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Crear evento" description="Diseña una experiencia con fecha, cupos, modalidad e idioma para la comunidad." basePath="/eventos" mode="insert" idKey="idEvento" [fields]="fields" [service]="eventsService" submitLabel="Publicar evento" successMessage="Evento publicado exitosamente." />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = eventFields;
  constructor(readonly eventsService: Events) {}
}
