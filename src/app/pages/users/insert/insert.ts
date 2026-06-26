import { Component } from '@angular/core';
import { Users } from '../../../services/users';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { userFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Registrar usuario" description="Completa los datos del usuario." basePath="/usuarios" mode="insert" idKey="idUsuario" [fields]="fields" [service]="usersService" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = userFields;
  constructor(readonly usersService: Users) {}
}
