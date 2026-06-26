import { Component } from '@angular/core';
import { Users } from '../../../services/users';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { userFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar usuario" description="Edita los datos del usuario seleccionado." basePath="/usuarios" mode="update" idKey="idUsuario" [fields]="fields" [service]="usersService" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = userFields;
  constructor(readonly usersService: Users) {}
}
