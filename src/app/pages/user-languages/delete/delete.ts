import { Component } from '@angular/core';
import { UserLanguages } from '../../../services/user-languages';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { fromUserLanguageResource, userLanguageFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar idioma de usuario" description="Revisa el registro antes de eliminarlo." basePath="/usuarios-idiomas" mode="delete" idKey="idUsuarioIdioma" [fields]="fields" [service]="userLanguagesService" [fromResource]="fromResource" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = userLanguageFields;
  readonly fromResource = fromUserLanguageResource;
  constructor(readonly userLanguagesService: UserLanguages) {}
}
