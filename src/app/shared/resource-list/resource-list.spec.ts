import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ResourceList } from './resource-list';

describe('ResourceList', () => {
  let component: ResourceList;
  let fixture: ComponentFixture<ResourceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Recurso');
    fixture.componentRef.setInput('description', 'Descripcion');
    fixture.componentRef.setInput('basePath', '/recurso');
    fixture.componentRef.setInput('idKey', 'id');
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('rows', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

