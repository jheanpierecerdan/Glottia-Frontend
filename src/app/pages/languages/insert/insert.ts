import { Component } from '@angular/core';
import { Languages } from '../../../services/languages';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { languageFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Registrar idioma" description="Completa los datos del idioma." basePath="/idiomas" mode="insert" idKey="idIdioma" [fields]="fields" [service]="languagesService" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = languageFields;
  constructor(readonly languagesService: Languages) {}
}
