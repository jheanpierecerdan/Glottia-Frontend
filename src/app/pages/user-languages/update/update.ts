import { Component } from '@angular/core';
import { UserLanguages } from '../../../services/user-languages';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { fromUserLanguageResource, toUserLanguagePayload, userLanguageFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar idioma de usuario" description="Edita la relacion entre usuario e idioma." basePath="/usuarios-idiomas" mode="update" idKey="idUsuarioIdioma" [fields]="fields" [service]="userLanguagesService" [toPayload]="toPayload" [fromResource]="fromResource" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = userLanguageFields;
  readonly toPayload = toUserLanguagePayload;
  readonly fromResource = fromUserLanguageResource;
  constructor(readonly userLanguagesService: UserLanguages) {}
}
