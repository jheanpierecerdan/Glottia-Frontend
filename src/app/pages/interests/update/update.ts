import { Component } from '@angular/core';
import { Interests } from '../../../services/interests';
import { ResourceForm } from '../../../shared/resource-form/resource-form';
import { interestFields } from '../../resource-form-configs';

@Component({
  selector: 'app-update',
  imports: [ResourceForm],
  template: `<app-resource-form title="Actualizar interes" description="Edita los datos del interes seleccionado." basePath="/intereses" mode="update" idKey="idInteres" [fields]="fields" [service]="interestsService" />`,
  styleUrl: './update.scss',
})
export class Update {
  readonly fields = interestFields;
  constructor(readonly interestsService: Interests) {}
}
