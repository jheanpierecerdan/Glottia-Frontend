import { Component } from '@angular/core';
import { Interests } from '../../../services/interests';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { interestFields } from '../../resource-form-configs';

@Component({
  selector: 'app-insert',
  imports: [ResourceForm],
  template: `<app-resource-form title="Registrar interes" description="Completa los datos del interes." basePath="/intereses" mode="insert" idKey="idInteres" [fields]="fields" [service]="interestsService" />`,
  styleUrl: './insert.scss',
})
export class Insert {
  readonly fields = interestFields;
  constructor(readonly interestsService: Interests) {}
}
