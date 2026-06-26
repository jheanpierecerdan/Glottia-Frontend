import { Component } from '@angular/core';
import { Interests } from '../../../services/interests';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { interestFields } from '../../resource-form-configs';

@Component({
  selector: 'app-delete',
  imports: [ResourceForm],
  template: `<app-resource-form title="Eliminar interes" description="Revisa el registro antes de eliminarlo." basePath="/intereses" mode="delete" idKey="idInteres" [fields]="fields" [service]="interestsService" />`,
  styleUrl: './delete.scss',
})
export class Delete {
  readonly fields = interestFields;
  constructor(readonly interestsService: Interests) {}
}
