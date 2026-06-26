import { ChangeDetectorRef, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackService } from '../services/feedback';
import { ResourceColumn, ResourceRow } from '../shared/resource-list/resource-list';

export abstract class ResourcePage {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly feedback = inject(FeedbackService);

  loading = false;
  error = '';
  rows: ResourceRow[] = [];
  abstract readonly columns: ResourceColumn[];

  protected startLoading(): void {
    this.loading = true;
    this.error = '';
  }

  protected finishLoading(): void {
    this.loading = false;
    this.changeDetector.detectChanges();
  }

  protected showError(): void {
    this.loading = false;
    this.error = 'No se pudieron cargar los datos del servidor. Intenta nuevamente en unos segundos.';
    this.changeDetector.detectChanges();
  }

  protected deleteResource(service: { delete(id: number): Observable<void> }, id: number, reload: () => void): void {
    if (!confirm('Deseas eliminar este registro?')) return;

    service.delete(id).subscribe({
      next: () => {
        this.feedback.show('Eliminado exitosamente.');
        reload();
      },
      error: () => this.showError(),
    });
  }
}
