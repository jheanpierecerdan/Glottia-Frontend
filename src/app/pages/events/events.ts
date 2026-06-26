import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Events as EventsService } from '../../services/events';
import { ResourceAction, ResourceList } from '../../shared/resource-list/resource-list';
import { ResourcePage } from '../resource-page';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-events', imports: [ResourceList], templateUrl: './events.html', styleUrl: './events.scss' })
export class Events extends ResourcePage implements OnInit {
  readonly columns = [
    { key: 'idEvento', label: 'ID' }, { key: 'titulo', label: 'Título' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'modalidad', label: 'Modalidad' }, { key: 'fechaHora', label: 'Fecha' },
    { key: 'cupoMaximo', label: 'Cupo' }, { key: 'ubicacion', label: 'Ubicación' },
    { key: 'enlaceVirtual', label: 'Enlace virtual' }, { key: 'estado', label: 'Estado' },
    { key: 'idIdioma', label: 'ID Idioma' }, { key: 'idOrganizador', label: 'ID Organizador' },
  ];
  readonly actions: ResourceAction[] = [
    {
      label: 'Reservar cupo',
      link: () => ['/reservas', 'insert'],
      queryParams: (event) => ({ idEvento: event['idEvento'] }),
    },
  ];
  constructor(private readonly eventsService: EventsService, readonly auth: AuthService) { super(); }
  canManage(): boolean { return this.auth.role() !== 'ESTUDIANTE'; }
  ngOnInit(): void { this.cargarEventos(); }
  cargarEventos(): void {
    this.startLoading();
    this.eventsService.getAll().pipe(finalize(() => this.finishLoading())).subscribe({
      next: (events) => this.rows = events.map((event) => ({ ...event })),
      error: () => this.showError(),
    });
  }

  eliminarEvento(id: number): void {
    this.deleteResource(this.eventsService, id, () => this.cargarEventos());
  }
}
