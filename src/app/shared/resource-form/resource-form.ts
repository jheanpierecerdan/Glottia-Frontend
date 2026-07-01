import { ChangeDetectorRef, Component, OnInit, input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';
import { FeedbackService } from '../../services/feedback';
import { openGoogleCalendarEvent } from '../../services/google-calendar';
import { LanguageService } from '../../services/language.service';

export interface ResourceFormOption {
  value: string | number | boolean;
  label: string;
}

export interface ResourceFormField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  min?: number;
  options?: ResourceFormOption[];
}

export type ResourceFormMode = 'insert' | 'update' | 'delete';
export type ResourceFormValue = Record<string, unknown>;

@Component({
  selector: 'app-resource-form',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.scss',
})
export class ResourceForm implements OnInit {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly basePath = input.required<string>();
  readonly mode = input.required<ResourceFormMode>();
  readonly idKey = input.required<string>();
  readonly fields = input.required<ResourceFormField[]>();
  readonly service = input.required<ApiService<unknown>>();
  readonly toPayload = input<(value: ResourceFormValue) => unknown>((value) => value);
  readonly fromResource = input<(value: ResourceFormValue) => ResourceFormValue>((value) => value);
  readonly submitLabel = input('');
  readonly successMessage = input('');

  form = new FormGroup<Record<string, FormControl<unknown>>>({});
  loading = false;
  saving = false;
  error = '';
  record?: ResourceFormValue;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly feedback: FeedbackService,
    private readonly changeDetector: ChangeDetectorRef,
    readonly language: LanguageService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    if (this.mode() !== 'insert') {
      this.loadRecord();
    } else {
      this.applyQueryParams();
    }
  }

  get isDelete(): boolean {
    return this.mode() === 'delete';
  }

  get id(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  save(): void {
    if (this.isDelete) {
      this.delete();
      return;
    }

    if (this.mode() === 'update' && !this.form.dirty) {
      this.error = 'No hay cambios para actualizar.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const payload = this.toPayload()(this.normalizedValue());
    const request = this.mode() === 'insert'
      ? this.service().create(payload)
      : this.service().update(this.id, payload);

    request.pipe(finalize(() => {
      this.saving = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: () => {
        if (this.shouldOpenGoogleCalendar) {
          openGoogleCalendarEvent(payload as ResourceFormValue);
        }
        this.feedback.show(this.successText);
        this.router.navigate([this.basePath()]);
      },
      error: () => {
        this.error = 'No se pudo guardar el registro. Revisa los datos e intenta nuevamente.';
        this.changeDetector.detectChanges();
      },
    });
  }

  hasError(field: ResourceFormField): boolean {
    const control = this.form.controls[field.key];
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }

  get actionLabel(): string {
    if (this.submitLabel()) return this.submitLabel();
    if (this.isDelete) return 'Eliminar';
    return this.mode() === 'update' ? 'Modificar' : 'Guardar';
  }

  get actionIcon(): string {
    if (this.isDelete) return 'delete';
    if (this.actionLabel.toLowerCase().includes('reservar')) return 'event_available';
    return this.mode() === 'update' ? 'edit' : 'check_circle';
  }

  get formIcon(): string {
    if (this.isDelete) return 'delete_forever';
    if (this.actionLabel.toLowerCase().includes('reservar')) return 'confirmation_number';
    return this.mode() === 'update' ? 'edit_note' : 'add_circle';
  }

  get modeLabel(): string {
    if (this.isDelete) return 'Eliminar registro';
    if (this.actionLabel.toLowerCase().includes('reservar')) return 'Reserva de cupo';
    return this.mode() === 'update' ? 'Edicion de datos' : 'Nuevo registro';
  }

  fieldIcon(field: ResourceFormField): string {
    if (field.key.toLowerCase().includes('correo')) return 'mail';
    if (field.key.toLowerCase().includes('fecha')) return 'event';
    if (field.key.toLowerCase().includes('hora')) return 'schedule';
    if (field.key.toLowerCase().includes('estado')) return 'verified';
    if (field.key.toLowerCase().includes('usuario')) return 'person';
    if (field.key.toLowerCase().includes('evento')) return 'event_seat';
    if (field.key.toLowerCase().includes('idioma')) return 'translate';
    if (field.key.toLowerCase().includes('interes')) return 'interests';
    if (field.key.toLowerCase().includes('rol')) return 'admin_panel_settings';
    if (field.type === 'password') return 'lock';
    if (field.type === 'number') return 'pin';
    if (field.type === 'select') return 'tune';
    if (field.type === 'textarea') return 'notes';
    return 'label';
  }

  private get successText(): string {
    if (this.successMessage()) return this.successMessage();
    return this.mode() === 'insert' ? 'Guardado exitosamente.' : 'Modificado exitosamente.';
  }

  private get shouldOpenGoogleCalendar(): boolean {
    return this.basePath() === '/eventos' && !this.isDelete;
  }

  private buildForm(): void {
    const controls: Record<string, FormControl<unknown>> = {};

    for (const field of this.fields()) {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      if (field.min !== undefined) validators.push(Validators.min(field.min));
      controls[field.key] = new FormControl(field.type === 'checkbox' ? false : '', validators);
    }

    this.form = new FormGroup(controls);
  }

  private normalizedValue(): ResourceFormValue {
    const value = this.form.getRawValue();
    const normalized: ResourceFormValue = {};

    for (const field of this.fields()) {
      const fieldValue = value[field.key];
      if (fieldValue === '' && !field.required) continue;
      normalized[field.key] = field.type === 'number' ? Number(fieldValue) : fieldValue;
    }

    return normalized;
  }

  private loadRecord(): void {
    this.loading = true;
    this.error = '';
    this.service().getById(this.id).pipe(finalize(() => {
      this.loading = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: (record) => {
        this.record = record as ResourceFormValue;
        this.form.patchValue(this.fromResource()(this.record));
        this.form.markAsPristine();
      },
      error: () => {
        this.error = 'No se pudo cargar el registro solicitado.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private applyQueryParams(): void {
    const values: ResourceFormValue = {};

    for (const field of this.fields()) {
      const value = this.route.snapshot.queryParamMap.get(field.key);
      if (value === null) continue;
      values[field.key] = field.type === 'number' ? Number(value) : value;
    }

    if (Object.keys(values).length) {
      this.form.patchValue(values);
      this.form.markAsDirty();
      this.changeDetector.detectChanges();
    }
  }

  private delete(): void {
    this.saving = true;
    this.error = '';
    this.service().delete(this.id).pipe(finalize(() => {
      this.saving = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: () => {
        this.feedback.show('Eliminado exitosamente.');
        this.router.navigate([this.basePath()]);
      },
      error: () => {
        this.error = 'No se pudo eliminar el registro. Intenta nuevamente.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
