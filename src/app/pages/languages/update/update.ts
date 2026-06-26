import { Component } from '@angular/core';
import { Languages } from '../../../services/languages';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { languageFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar idioma" description="Edita los datos del idioma seleccionado." basePath="/idiomas" mode="update" idKey="idIdioma" [fields]="fields" [service]="languagesService" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = languageFields;
  constructor(readonly languagesService: Languages) {}
}
