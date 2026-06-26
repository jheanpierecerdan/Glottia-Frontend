import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ResourceForm } from './resource-form';

describe('ResourceForm', () => {
  let component: ResourceForm;
  let fixture: ComponentFixture<ResourceForm>;
  let router: Router;
  const service = {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service.create.mockReturnValue(of({ id: 1, nombre: 'TEST Frontend' }));

    await TestBed.configureTestingModule({
      imports: [ResourceForm],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ResourceForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Registrar rol');
    fixture.componentRef.setInput('description', 'Formulario de prueba');
    fixture.componentRef.setInput('basePath', '/roles');
    fixture.componentRef.setInput('mode', 'insert');
    fixture.componentRef.setInput('idKey', 'idRol');
    fixture.componentRef.setInput('fields', [
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'descripcion', label: 'Descripcion', required: true },
    ]);
    fixture.componentRef.setInput('service', service);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('registers from the frontend form and returns to the list', () => {
    component.form.patchValue({
      nombre: 'TEST Frontend',
      descripcion: 'Creado desde formulario frontend',
    });

    component.save();

    expect(service.create).toHaveBeenCalledWith({
      nombre: 'TEST Frontend',
      descripcion: 'Creado desde formulario frontend',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/roles']);
  });

  it('does not update if the frontend form has no changes', () => {
    fixture.componentRef.setInput('mode', 'update');
    component.form.patchValue({
      nombre: 'TEST Frontend',
      descripcion: 'Creado desde formulario frontend',
    });
    component.form.markAsPristine();

    component.save();

    expect(service.update).not.toHaveBeenCalled();
    expect(component.error).toBe('No hay cambios para actualizar.');
  });

  it('updates only after a frontend form change', () => {
    fixture.componentRef.setInput('mode', 'update');
    service.update.mockReturnValue(of({ id: 1, nombre: 'TEST Actualizado' }));
    component.form.patchValue({
      nombre: 'TEST Actualizado',
      descripcion: 'Creado desde formulario frontend',
    });
    component.form.markAsDirty();

    component.save();

    expect(service.update).toHaveBeenCalledWith(0, {
      nombre: 'TEST Actualizado',
      descripcion: 'Creado desde formulario frontend',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/roles']);
  });
});
