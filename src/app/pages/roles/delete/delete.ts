import { Component } from '@angular/core';
import { Roles } from '../../../services/roles';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { roleFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar rol" description="Revisa el registro antes de eliminarlo." basePath="/roles" mode="delete" idKey="idRol" [fields]="fields" [service]="rolesService" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = roleFields;
  constructor(readonly rolesService: Roles) {}
}
