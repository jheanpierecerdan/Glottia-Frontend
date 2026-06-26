import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Users as UsersService, User } from '../../services/users';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface CommunityRole {
  label: string;
  count: number;
  percent: number;
  icon: string;
}

@Component({ selector: 'app-users', imports: [ResourceList, MatIconModule, RouterLink], templateUrl: './users.html', styleUrl: './users.scss' })
export class Users extends ResourcePage implements OnInit {
  readonly columns = [
    { key: 'idUsuario', label: 'ID' }, { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' }, { key: 'correo', label: 'Correo' },
    { key: 'ciudad', label: 'Ciudad' }, { key: 'modalidad', label: 'Modalidad' },
    { key: 'biografia', label: 'Biografia' }, { key: 'fechaRegistro', label: 'Fecha registro' },
    { key: 'estado', label: 'Estado' }, { key: 'idRol', label: 'ID Rol' },
  ];
  users: User[] = [];
  activeUsers = 0;
  inactiveUsers = 0;
  roleSummary: CommunityRole[] = [];

  constructor(private readonly usersService: UsersService) { super(); }
  ngOnInit(): void { this.cargarUsuarios(); }

  get newestUsers(): User[] {
    return [...this.users]
      .sort((a, b) => new Date(b.fechaRegistro ?? 0).getTime() - new Date(a.fechaRegistro ?? 0).getTime())
      .slice(0, 6);
  }

  roleName(idRol?: number): string {
    return ({ 1: 'Administrador', 2: 'Organizador', 3: 'Docente', 4: 'Estudiante' } as Record<number, string>)[idRol ?? 0] ?? 'Sin rol';
  }

  userInitials(user: User): string {
    return `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase() || 'GL';
  }

  cargarUsuarios(): void {
    this.startLoading();
    this.usersService.getAll().pipe(finalize(() => this.finishLoading())).subscribe({
      next: (users) => {
        this.users = users;
        this.rows = users.map((user) => ({ ...user }));
        this.activeUsers = users.filter((user) => user.estado !== false).length;
        this.inactiveUsers = Math.max(users.length - this.activeUsers, 0);
        this.roleSummary = this.buildRoleSummary(users);
      },
      error: () => this.showError(),
    });
  }

  eliminarUsuario(id: number): void {
    this.deleteResource(this.usersService, id, () => this.cargarUsuarios());
  }

  private buildRoleSummary(users: User[]): CommunityRole[] {
    const total = Math.max(users.length, 1);
    const icons = new Map<string, string>([
      ['Administrador', 'admin_panel_settings'],
      ['Organizador', 'event_available'],
      ['Docente', 'school'],
      ['Estudiante', 'groups'],
      ['Sin rol', 'person_off'],
    ]);
    const counts = new Map<string, number>();
    users.forEach((user) => {
      const label = this.roleName(user.idRol);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    return Array.from(counts, ([label, count]) => ({
      label,
      count,
      percent: Math.round((count / total) * 100),
      icon: icons.get(label) ?? 'person',
    })).sort((a, b) => b.count - a.count);
  }
}
