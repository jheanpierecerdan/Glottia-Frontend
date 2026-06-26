import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { UserLanguages as UserLanguagesService } from '../../services/user-languages';
import { ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';

@Component({ selector: 'app-user-languages', imports: [ResourceList], templateUrl: './user-languages.html', styleUrl: './user-languages.scss' })
export class UserLanguages extends ResourcePage implements OnInit {
  readonly columns = [
    { key: 'idUsuarioIdioma', label: 'ID' }, { key: 'usuario', label: 'Usuario' },
    { key: 'idioma', label: 'Idioma' }, { key: 'nivel', label: 'Nivel' }, { key: 'tipo', label: 'Tipo' },
  ];
  constructor(private readonly userLanguagesService: UserLanguagesService) { super(); }
  ngOnInit(): void { this.cargarIdiomasDeUsuario(); }
  cargarIdiomasDeUsuario(): void {
    this.startLoading();
    this.userLanguagesService.getAll().pipe(finalize(() => this.finishLoading())).subscribe({
      next: (items) => this.rows = items.map((item) => ({
        idUsuarioIdioma: item.idUsuarioIdioma,
        usuario: `${item.usuario?.nombre ?? ''} ${item.usuario?.apellido ?? ''}`.trim() || item.usuario?.idUsuario,
        idioma: item.idioma?.nombre || item.idioma?.idIdioma,
        nivel: item.nivel,
        tipo: item.tipo,
      })),
      error: () => this.showError(),
    });
  }

  eliminarIdiomaDeUsuario(id: number): void {
    this.deleteResource(this.userLanguagesService, id, () => this.cargarIdiomasDeUsuario());
  }
}
