import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { UserInterests as UserInterestsService } from '../../services/user-interests';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';

@Component({ selector: 'app-user-interests', imports: [ResourceList], templateUrl: './user-interests.html', styleUrl: './user-interests.scss' })
export class UserInterests extends ResourcePage implements OnInit {
  readonly columns = [
    { key: 'idUsuarioInteres', label: 'ID' }, { key: 'usuario', label: 'Usuario' },
    { key: 'interes', label: 'Interes' },
  ];
  constructor(private readonly userInterestsService: UserInterestsService) { super(); }
  ngOnInit(): void { this.cargarInteresesDeUsuario(); }
  cargarInteresesDeUsuario(): void {
    this.startLoading();
    this.userInterestsService.getAll().pipe(finalize(() => this.finishLoading())).subscribe({
      next: (items) => this.rows = items.map((item) => ({
        idUsuarioInteres: item.idUsuarioInteres,
        usuario: `${item.usuario?.nombre ?? ''} ${item.usuario?.apellido ?? ''}`.trim() || item.usuario?.idUsuario,
        interes: item.interes?.nombre || item.interes?.idInteres,
      })),
      error: () => this.showError(),
    });
  }

  eliminarInteresDeUsuario(id: number): void {
    this.deleteResource(this.userInterestsService, id, () => this.cargarInteresesDeUsuario());
  }
}
