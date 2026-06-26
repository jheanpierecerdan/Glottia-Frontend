import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Roles as RolesService, Role } from '../../services/roles';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface PermissionCard {
  title: string;
  description: string;
  icon: string;
}

@Component({ selector: 'app-roles', imports: [ResourceList, MatIconModule, RouterLink], templateUrl: './roles.html', styleUrl: './roles.scss' })
export class Roles extends ResourcePage implements OnInit {
  readonly columns = [{ key: 'idRol', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'descripcion', label: 'Descripción' }];
  roles: Role[] = [];
  readonly permissionCards: PermissionCard[] = [
    { title: 'Administrador', description: 'Usuarios, roles, idiomas, intereses, eventos y reservas.', icon: 'security' },
    { title: 'Organizador', description: 'Crea y mantiene eventos, cupos, fechas y modalidad.', icon: 'event_available' },
    { title: 'Docente', description: 'Revisa agenda y acompaña sesiones de práctica.', icon: 'school' },
    { title: 'Estudiante', description: 'Explora eventos, reserva cupos y revisa sus participaciones.', icon: 'groups' },
  ];
  constructor(private readonly rolesService: RolesService) { super(); }
  ngOnInit(): void { this.cargarRoles(); }
  roleIcon(role: Role): string {
    const value = role.nombre.toLowerCase();
    if (value.includes('admin')) return 'admin_panel_settings';
    if (value.includes('docente')) return 'school';
    if (value.includes('organizador')) return 'event_available';
    if (value.includes('estudiante')) return 'groups';
    return 'verified_user';
  }
  cargarRoles(): void {
    this.startLoading();
    this.rolesService.getAll().pipe(finalize(() => this.finishLoading())).subscribe({
      next: (roles) => {
        this.roles = roles;
        this.rows = roles.map((role) => ({ ...role }));
      },
      error: () => this.showError(),
    });
  }

  eliminarRol(id: number): void {
    this.deleteResource(this.rolesService, id, () => this.cargarRoles());
  }
}
