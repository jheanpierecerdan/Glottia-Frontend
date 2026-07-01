import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Events } from '../../../services/events';
import { Languages } from '../../../services/languages';
import { Users } from '../../../services/users';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { ResourceFormField } from '../../../shared/resource-form/resource-form';
import { eventFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar agenda" description="Ajusta fecha, cupos, modalidad y detalles para mantener la agenda clara." basePath="/eventos" mode="update" idKey="idEvento" [fields]="fields" [service]="eventsService" submitLabel="Guardar cambios" successMessage="Agenda actualizada correctamente." />`,
  styleUrl: './update.scss',
})
export class Update implements OnInit {
  fields: ResourceFormField[] = eventFields;

  constructor(
    readonly eventsService: Events,
    private readonly languagesService: Languages,
    private readonly usersService: Users,
  ) {}

  ngOnInit(): void {
    this.loadReadableOptions();
  }

  private loadReadableOptions(): void {
    forkJoin({
      languages: this.languagesService.getAll(),
      organizers: this.usersService.getByRole('ORGANIZADOR'),
    }).subscribe({
      next: ({ languages, organizers }) => {
        this.fields = eventFields.map((field) => {
          if (field.key === 'idIdioma') {
            return {
              ...field,
              label: 'Idioma',
              type: 'select',
              options: languages
                .filter((language) => language.idIdioma)
                .map((language) => ({
                  value: language.idIdioma!,
                  label: `${language.nombre} - ${language.codigoIso}`,
                })),
            };
          }

          if (field.key === 'idOrganizador') {
            return {
              ...field,
              label: 'Organizador',
              type: 'select',
              options: organizers
                .filter((organizer) => organizer.idUsuario)
                .map((organizer) => ({
                  value: organizer.idUsuario!,
                  label: `${organizer.nombre} ${organizer.apellido} - ${organizer.correo}`,
                })),
            };
          }

          return field;
        });
      },
    });
  }
}
