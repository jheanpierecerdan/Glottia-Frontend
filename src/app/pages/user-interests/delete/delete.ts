import { Component } from '@angular/core';
import { UserInterests } from '../../../services/user-interests';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { fromUserInterestResource, userInterestFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar interes de usuario" description="Revisa el registro antes de eliminarlo." basePath="/usuarios-intereses" mode="delete" idKey="idUsuarioInteres" [fields]="fields" [service]="userInterestsService" [fromResource]="fromResource" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = userInterestFields;
  readonly fromResource = fromUserInterestResource;
  constructor(readonly userInterestsService: UserInterests) {}
}
