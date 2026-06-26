import { Component } from '@angular/core';
import { Roles } from '../../../services/roles';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { roleFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Registrar rol" description="Completa los datos del rol." basePath="/roles" mode="insert" idKey="idRol" [fields]="fields" [service]="rolesService" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = roleFields;
  constructor(readonly rolesService: Roles) {}
}
