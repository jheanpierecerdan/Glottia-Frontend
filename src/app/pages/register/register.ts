import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Users } from '../../services/users';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    apellido: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    contrasena: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    ciudad: new FormControl('', { nonNullable: true }),
    modalidad: new FormControl('', { nonNullable: true }),
    biografia: new FormControl('', { nonNullable: true }),
    estado: new FormControl(true, { nonNullable: true }),
  });

  loading = false;
  error = '';
  showPassword = false;

  get passwordStrength(): 0 | 1 | 2 | 3 {
    const v = this.form.controls.contrasena.value;
    if (!v || v.length < 6) return 0;
    let score = 1;
    if (v.length >= 10) score++;
    if (/[A-Z]/.test(v) && /[0-9!@#$%^&*]/.test(v)) score++;
    return score as 0 | 1 | 2 | 3;
  }

  get passwordStrengthLabel(): string {
    return ['', 'Débil', 'Media', 'Fuerte'][this.passwordStrength];
  }

  constructor(
    private readonly users: Users,
    private readonly router: Router,
    private readonly sound: SoundService,
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const value = this.form.getRawValue();

    this.users.create({
      nombre: value.nombre,
      apellido: value.apellido,
      correo: value.correo,
      contrasena: value.contrasena,
      ...(value.ciudad ? { ciudad: value.ciudad } : {}),
      ...(value.modalidad ? { modalidad: value.modalidad } : {}),
      ...(value.biografia ? { biografia: value.biografia } : {}),
      estado: value.estado,
    }).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.sound.success();
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'No pudimos completar el registro. Revisa tus datos e inténtalo nuevamente.';
      },
    });
  }
}
