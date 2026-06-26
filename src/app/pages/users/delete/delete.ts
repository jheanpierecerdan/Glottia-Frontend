import { Component } from '@angular/core';
import { Users } from '../../../services/users';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { userFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar usuario" description="Revisa el registro antes de eliminarlo." basePath="/usuarios" mode="delete" idKey="idUsuario" [fields]="fields" [service]="usersService" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = userFields;
  constructor(readonly usersService: Users) {}
}
