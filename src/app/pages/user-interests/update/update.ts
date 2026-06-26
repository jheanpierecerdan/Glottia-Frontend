import { Component } from '@angular/core';
import { UserInterests } from '../../../services/user-interests';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { fromUserInterestResource, toUserInterestPayload, userInterestFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar interes de usuario" description="Edita la relacion entre usuario e interes." basePath="/usuarios-intereses" mode="update" idKey="idUsuarioInteres" [fields]="fields" [service]="userInterestsService" [toPayload]="toPayload" [fromResource]="fromResource" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = userInterestFields;
  readonly toPayload = toUserInterestPayload;
  readonly fromResource = fromUserInterestResource;
  constructor(readonly userInterestsService: UserInterests) {}
}
