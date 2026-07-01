import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FeedbackService } from '../../services/feedback';
import { SoundService } from '../../services/sound.service';
import { LanguageService } from '../../services/language.service';
@Component({ selector: 'app-login', imports: [ReactiveFormsModule, RouterLink, MatIconModule], templateUrl: './login.html', styleUrl: './login.scss' })
export class Login {
  readonly form = new FormGroup({
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    contrasena: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  loading = false;
  error = '';
  showPassword = false;
  constructor(private readonly auth: AuthService, private readonly router: Router, private readonly sound: SoundService, private readonly feedback: FeedbackService, readonly language: LanguageService) {
    if (auth.isAuthenticated()) void router.navigateByUrl(auth.landingFor());
  }
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Completa el correo y la contrasena para iniciar sesion.';
      return;
    }
    this.loading = true; this.error = '';
    const { correo, contrasena } = this.form.getRawValue();
    this.auth.login(correo, contrasena).pipe(finalize(() => this.loading = false)).subscribe({
      next: (session) => { this.sound.success(); this.feedback.show('Sesion iniciada correctamente.'); void this.router.navigateByUrl(this.auth.landingFor(session.rol)); },
      error: (response: HttpErrorResponse) => {
        this.error = response.status === 0 || response.status === 404 || response.status >= 500
          ? 'El servidor no está disponible. Verifica que el backend esté activo o que la URL de Render sea correcta.'
          : 'Correo o contraseña incorrectos. Revisa tus datos e inténtalo otra vez.';
      },
    });
  }

  simulateSocialLogin(provider: string): void {
    this.error = `Acceso con ${provider} simulado. En produccion se conectaria con OAuth.`;
  }

  recoverPassword(): void {
    const correo = this.form.controls.correo.value || 'tu correo registrado';
    this.error = `Solicitud de recuperacion simulada para ${correo}.`;
  }

  enterAsGuest(): void {
    this.auth.startGuest();
    this.sound.success();
    void this.router.navigateByUrl('/panel');
  }

  fieldError(field: 'correo' | 'contrasena'): string {
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return '';
    if (control.hasError('required')) return field === 'correo' ? 'Ingresa tu correo electronico.' : 'Ingresa tu contrasena.';
    if (control.hasError('email')) return 'Ingresa un correo valido.';
    return '';
  }
}
