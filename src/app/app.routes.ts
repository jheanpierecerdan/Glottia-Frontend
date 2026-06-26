import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { roleGuard } from './guards/role.guard';
import { Home } from './pages/home/home';
import { Agenda } from './pages/agenda/agenda';
import { Dashboard } from './pages/dashboard/dashboard';
import { SessionPrep } from './pages/session-prep/session-prep';
import { Events } from './pages/events/events';
import { Interests } from './pages/interests/interests';
import { Languages } from './pages/languages/languages';
import { Reservations } from './pages/reservations/reservations';
import { Roles } from './pages/roles/roles';
import { UserInterests } from './pages/user-interests/user-interests';
import { UserLanguages } from './pages/user-languages/user-languages';
import { Users } from './pages/users/users';
import { Insert as EventInsert } from './pages/events/insert/insert';
import { Update as EventUpdate } from './pages/events/update/update';
import { Delete as EventDelete } from './pages/events/delete/delete';
import { Insert as InterestInsert } from './pages/interests/insert/insert';
import { Update as InterestUpdate } from './pages/interests/update/update';
import { Delete as InterestDelete } from './pages/interests/delete/delete';
import { Insert as LanguageInsert } from './pages/languages/insert/insert';
import { Update as LanguageUpdate } from './pages/languages/update/update';
import { Delete as LanguageDelete } from './pages/languages/delete/delete';
import { Insert as ReservationInsert } from './pages/reservations/insert/insert';
import { Update as ReservationUpdate } from './pages/reservations/update/update';
import { Delete as ReservationDelete } from './pages/reservations/delete/delete';
import { Insert as RoleInsert } from './pages/roles/insert/insert';
import { Update as RoleUpdate } from './pages/roles/update/update';
import { Delete as RoleDelete } from './pages/roles/delete/delete';
import { Insert as UserInterestInsert } from './pages/user-interests/insert/insert';
import { Update as UserInterestUpdate } from './pages/user-interests/update/update';
import { Delete as UserInterestDelete } from './pages/user-interests/delete/delete';
import { Insert as UserLanguageInsert } from './pages/user-languages/insert/insert';
import { Update as UserLanguageUpdate } from './pages/user-languages/update/update';
import { Delete as UserLanguageDelete } from './pages/user-languages/delete/delete';
import { Insert as UserInsert } from './pages/users/insert/insert';
import { Update as UserUpdate } from './pages/users/update/update';
import { Delete as UserDelete } from './pages/users/delete/delete';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Home,
    children: [
      { path: 'panel', component: Dashboard, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE', 'ESTUDIANTE'] } },
      { path: 'agenda', component: Agenda, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE', 'ESTUDIANTE'] } },
      { path: 'preparar-sesion', component: SessionPrep, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE'] } },
      { path: 'usuarios', component: Users, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios/insert', component: UserInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios/update/:id', component: UserUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios/delete/:id', component: UserDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles', component: Roles, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles/insert', component: RoleInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles/update/:id', component: RoleUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'roles/delete/:id', component: RoleDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'idiomas', component: Languages, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'idiomas/insert', component: LanguageInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'idiomas/update/:id', component: LanguageUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'idiomas/delete/:id', component: LanguageDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'intereses', component: Interests, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'intereses/insert', component: InterestInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'intereses/update/:id', component: InterestUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'intereses/delete/:id', component: InterestDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'eventos', component: Events, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE', 'ESTUDIANTE'] } },
      { path: 'eventos/insert', component: EventInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE'] } },
      { path: 'eventos/update/:id', component: EventUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE'] } },
      { path: 'eventos/delete/:id', component: EventDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ORGANIZADOR', 'DOCENTE'] } },
      { path: 'reservas', component: Reservations, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ESTUDIANTE'] } },
      { path: 'reservas/insert', component: ReservationInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ESTUDIANTE'] } },
      { path: 'reservas/update/:id', component: ReservationUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ESTUDIANTE'] } },
      { path: 'reservas/delete/:id', component: ReservationDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR', 'ESTUDIANTE'] } },
      { path: 'usuarios-idiomas', component: UserLanguages, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-idiomas/insert', component: UserLanguageInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-idiomas/update/:id', component: UserLanguageUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-idiomas/delete/:id', component: UserLanguageDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-intereses', component: UserInterests, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-intereses/insert', component: UserInterestInsert, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-intereses/update/:id', component: UserInterestUpdate, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
      { path: 'usuarios-intereses/delete/:id', component: UserInterestDelete, canActivate: [roleGuard], data: { roles: ['ADMINISTRADOR'] } },
    ],
  },
  { path: '**', redirectTo: '' },
];
