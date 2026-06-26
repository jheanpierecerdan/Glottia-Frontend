import { Component } from '@angular/core';
import { UserInterests } from '../../../services/user-interests';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { toUserInterestPayload, userInterestFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Registrar interes de usuario" description="Relaciona un usuario con un interes." basePath="/usuarios-intereses" mode="insert" idKey="idUsuarioInteres" [fields]="fields" [service]="userInterestsService" [toPayload]="toPayload" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = userInterestFields;
  readonly toPayload = toUserInterestPayload;
  constructor(readonly userInterestsService: UserInterests) {}
}
