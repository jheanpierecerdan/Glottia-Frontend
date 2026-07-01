import { ResourceFormField, ResourceFormValue } from '../shared/resource-form/resource-form';

export const roleFields: ResourceFormField[] = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true },
];

export const languageFields: ResourceFormField[] = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'codigoIso', label: 'Codigo ISO', required: true },
  { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true },
];

export const interestFields: ResourceFormField[] = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true },
];

export const userFields: ResourceFormField[] = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'apellido', label: 'Apellido', required: true },
  { key: 'correo', label: 'Correo', type: 'email', required: true },
  { key: 'contrasena', label: 'Contrasena', type: 'password' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'modalidad', label: 'Modalidad', type: 'select', options: [
    { value: 'Presencial', label: 'Presencial' },
    { value: 'Virtual', label: 'Virtual' },
    { value: 'Mixta', label: 'Mixta' },
  ] },
  { key: 'idRol', label: 'ID Rol', type: 'number', min: 1 },
  { key: 'biografia', label: 'Biografia', type: 'textarea' },
  { key: 'estado', label: 'Activo', type: 'checkbox' },
];

export const eventFields: ResourceFormField[] = [
  { key: 'titulo', label: 'Titulo', required: true },
  { key: 'modalidad', label: 'Modalidad', type: 'select', required: true, options: [
    { value: 'Presencial', label: 'Presencial' },
    { value: 'Virtual', label: 'Virtual' },
    { value: 'Mixta', label: 'Mixta' },
  ] },
  { key: 'fechaHora', label: 'Fecha y hora', type: 'datetime-local', required: true },
  { key: 'cupoMaximo', label: 'Cupo maximo', type: 'number', required: true, min: 1 },
  { key: 'ubicacion', label: 'Ubicacion' },
  { key: 'enlaceVirtual', label: 'Enlace virtual' },
  { key: 'imagenReferencial', label: 'Imagen referencial', required: true },
  { key: 'nivelSugerido', label: 'Nivel sugerido', type: 'select', required: true, options: [
    { value: 'Basico', label: 'Basico' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' },
    { value: 'Todos', label: 'Todos' },
  ] },
  { key: 'estado', label: 'Estado', type: 'select', required: true, options: [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
    { value: 'Cancelado', label: 'Cancelado' },
  ] },
  { key: 'idIdioma', label: 'Idioma', type: 'number', min: 1 },
  { key: 'idOrganizador', label: 'Organizador', type: 'number', min: 1 },
  { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true },
];

export const reservationFields: ResourceFormField[] = [
  { key: 'fechaReserva', label: 'Fecha de reserva', type: 'datetime-local', required: true },
  { key: 'estadoReserva', label: 'Estado', type: 'select', required: true, options: [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Confirmada', label: 'Confirmada' },
    { value: 'Cancelada', label: 'Cancelada' },
  ] },
  { key: 'idUsuario', label: 'Usuario', type: 'number', required: true, min: 1 },
  { key: 'idEvento', label: 'Evento', type: 'number', required: true, min: 1 },
];

export const userLanguageFields: ResourceFormField[] = [
  { key: 'idUsuario', label: 'ID Usuario', type: 'number', required: true, min: 1 },
  { key: 'idIdioma', label: 'ID Idioma', type: 'number', required: true, min: 1 },
  { key: 'nivel', label: 'Nivel', type: 'select', required: true, options: [
    { value: 'Basico', label: 'Basico' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' },
    { value: 'Nativo', label: 'Nativo' },
  ] },
  { key: 'tipo', label: 'Tipo', type: 'select', required: true, options: [
    { value: 'Aprende', label: 'Aprende' },
    { value: 'Ensenia', label: 'Ensenia' },
  ] },
];

export const userInterestFields: ResourceFormField[] = [
  { key: 'idUsuario', label: 'ID Usuario', type: 'number', required: true, min: 1 },
  { key: 'idInteres', label: 'ID Interes', type: 'number', required: true, min: 1 },
];

export const toUserLanguagePayload = (value: ResourceFormValue): ResourceFormValue => ({
  nivel: value['nivel'],
  tipo: value['tipo'],
  usuario: { idUsuario: Number(value['idUsuario']) },
  idioma: { idIdioma: Number(value['idIdioma']) },
});

export const fromUserLanguageResource = (value: ResourceFormValue): ResourceFormValue => ({
  nivel: value['nivel'],
  tipo: value['tipo'],
  idUsuario: (value['usuario'] as ResourceFormValue | undefined)?.['idUsuario'],
  idIdioma: (value['idioma'] as ResourceFormValue | undefined)?.['idIdioma'],
});

export const toUserInterestPayload = (value: ResourceFormValue): ResourceFormValue => ({
  usuario: { idUsuario: Number(value['idUsuario']) },
  interes: { idInteres: Number(value['idInteres']) },
});

export const fromUserInterestResource = (value: ResourceFormValue): ResourceFormValue => ({
  idUsuario: (value['usuario'] as ResourceFormValue | undefined)?.['idUsuario'],
  idInteres: (value['interes'] as ResourceFormValue | undefined)?.['idInteres'],
});
