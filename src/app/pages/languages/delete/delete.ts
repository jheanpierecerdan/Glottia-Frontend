import { Component } from '@angular/core';
import { Languages } from '../../../services/languages';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { languageFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar idioma" description="Revisa el registro antes de eliminarlo." basePath="/idiomas" mode="delete" idKey="idIdioma" [fields]="fields" [service]="languagesService" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = languageFields;
  constructor(readonly languagesService: Languages) {}
}
