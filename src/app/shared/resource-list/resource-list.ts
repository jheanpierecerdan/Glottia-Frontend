import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

export interface ResourceColumn {
  key: string;
  label: string;
}

export type ResourceRow = Record<string, unknown>;

export interface ResourceAction {
  label: string;
  icon?: string;
  link?: (row: ResourceRow) => unknown[];
  queryParams?: (row: ResourceRow) => Record<string, unknown>;
  externalUrl?: (row: ResourceRow) => string;
}

@Component({
  selector: 'app-resource-list',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.scss',
})
export class ResourceList {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly basePath = input.required<string>();
  readonly idKey = input.required<string>();
  readonly columns = input.required<ResourceColumn[]>();
  readonly rows = input.required<ResourceRow[]>();
  readonly loading = input(false);
  readonly error = input('');
  readonly extraActions = input<ResourceAction[]>([]);
  readonly canCreate = input(true);
  readonly canModify = input(true);
  readonly reload = output<void>();
  readonly remove = output<number>();
  searchTerm = '';
  private readonly expanded = new Set<unknown>();

  constructor(readonly language: LanguageService) {}

  get filteredRows(): ResourceRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.rows();
    return this.rows().filter((row) => this.rowSearchText(row).includes(term));
  }

  getId(row: ResourceRow): unknown {
    return row[this.idKey()];
  }

  removeRow(row: ResourceRow): void {
    const id = Number(this.getId(row));
    if (!Number.isNaN(id)) {
      this.remove.emit(id);
    }
  }

  toggleRow(row: ResourceRow): void {
    const id = this.getId(row);
    if (this.expanded.has(id)) this.expanded.delete(id);
    else this.expanded.add(id);
  }

  isExpanded(row: ResourceRow): boolean {
    return this.expanded.has(this.getId(row));
  }

  updateSearch(value: string): void {
    this.searchTerm = value;
  }

  getActionQueryParams(action: ResourceAction, row: ResourceRow): Record<string, unknown> | undefined {
    return action.queryParams?.(row);
  }

  getActionUrl(action: ResourceAction, row: ResourceRow): string | undefined {
    return action.externalUrl?.(row);
  }

  get pageIcon(): string {
    const title = this.title().toLowerCase();
    if (title.includes('usuario')) return 'groups';
    if (title.includes('rol')) return 'admin_panel_settings';
    if (title.includes('idioma')) return 'translate';
    if (title.includes('interes')) return 'interests';
    if (title.includes('evento')) return 'event';
    if (title.includes('reserva')) return 'confirmation_number';
    return 'folder_open';
  }

  get countText(): string {
    const total = this.rows().length;
    return `${total} ${total === 1 ? 'registro' : 'registros'}`;
  }

  get filteredCountText(): string {
    const total = this.filteredRows.length;
    return `${total} ${total === 1 ? 'resultado' : 'resultados'}`;
  }

  primaryValue(row: ResourceRow): string {
    const keys = ['titulo', 'nombre', 'evento', 'usuario', 'correo', 'descripcion'];
    const key = keys.find((item) => row[item]);
    return key ? this.displayValue(row, key) : `Registro #${this.getId(row)}`;
  }

  summaryColumns(row: ResourceRow): ResourceColumn[] {
    const priority = ['correo', 'usuario', 'evento', 'fechaHora', 'fechaReserva', 'modalidad', 'estado', 'estadoReserva', 'cupoMaximo', 'codigoIso', 'idRol'];
    const columns = this.columns().filter((column) => column.key !== this.idKey() && this.displayValue(row, column.key) !== 'Sin dato');
    const ordered = [
      ...priority.map((key) => columns.find((column) => column.key === key)).filter((column): column is ResourceColumn => Boolean(column)),
      ...columns.filter((column) => !priority.includes(column.key)),
    ];
    return ordered.slice(0, 3);
  }

  fieldIcon(key: string): string {
    const normalized = key.toLowerCase();
    if (normalized.includes('correo')) return 'mail';
    if (normalized.includes('fecha')) return 'event';
    if (normalized.includes('hora')) return 'schedule';
    if (normalized.includes('estado')) return 'verified';
    if (normalized.includes('usuario')) return 'person';
    if (normalized.includes('evento')) return 'event_seat';
    if (normalized.includes('idioma')) return 'translate';
    if (normalized.includes('interes')) return 'interests';
    if (normalized.includes('rol')) return 'admin_panel_settings';
    if (normalized.includes('cupo')) return 'confirmation_number';
    if (normalized.startsWith('id')) return 'tag';
    return 'label';
  }

  displayValue(row: ResourceRow, key: string): string {
    const value = row[key];

    if ((key === 'imagenReferencial' || key === 'nivelSugerido') && (value === null || value === undefined || value === '')) {
      return key === 'imagenReferencial' ? 'Imagen referencial demo' : 'Todos los niveles';
    }
    if (value === null || value === undefined || value === '') return 'Sin dato';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (typeof value === 'object') return this.displayObject(value as ResourceRow);

    return String(value);
  }

  private displayObject(value: ResourceRow): string {
    const name = [value['nombre'], value['apellido']].filter(Boolean).join(' ');
    if (name) return name;
    if (value['titulo']) return String(value['titulo']);
    if (value['descripcion']) return String(value['descripcion']);

    const idKey = Object.keys(value).find((key) => key.toLowerCase().startsWith('id'));
    return idKey ? String(value[idKey]) : JSON.stringify(value);
  }

  private rowSearchText(row: ResourceRow): string {
    return this.columns()
      .map((column) => this.displayValue(row, column.key))
      .join(' ')
      .toLowerCase();
  }
}
