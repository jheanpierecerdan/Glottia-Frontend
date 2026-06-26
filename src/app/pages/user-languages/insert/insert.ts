import { Component } from '@angular/core';
import { UserLanguages } from '../../../services/user-languages';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { toUserLanguagePayload, userLanguageFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Registrar idioma de usuario" description="Relaciona un usuario con un idioma." basePath="/usuarios-idiomas" mode="insert" idKey="idUsuarioIdioma" [fields]="fields" [service]="userLanguagesService" [toPayload]="toPayload" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = userLanguageFields;
  readonly toPayload = toUserLanguagePayload;
  constructor(readonly userLanguagesService: UserLanguages) {}
}
