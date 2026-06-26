import { Component } from '@angular/core';
import { Roles } from '../../../services/roles';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { roleFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar rol" description="Edita los datos del rol seleccionado." basePath="/roles" mode="update" idKey="idRol" [fields]="fields" [service]="rolesService" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = roleFields;
  constructor(readonly rolesService: Roles) {}
}
