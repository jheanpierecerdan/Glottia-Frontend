export interface GoogleCalendarEvent {
  titulo?: unknown;
  descripcion?: unknown;
  fechaHora?: unknown;
  ubicacion?: unknown;
  enlaceVirtual?: unknown;
  modalidad?: unknown;
}

const DEFAULT_DURATION_MINUTES = 90;
const TIMEZONE = 'America/Lima';

export function buildGoogleCalendarUrl(event: GoogleCalendarEvent): string {
  const start = parseDate(event.fechaHora);
  const end = new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60_000);
  const details = [
    stringValue(event.descripcion),
    stringValue(event.modalidad) ? `Modalidad: ${stringValue(event.modalidad)}` : '',
    stringValue(event.enlaceVirtual) ? `Enlace virtual: ${stringValue(event.enlaceVirtual)}` : '',
    'Agendado desde Glottia.',
  ].filter(Boolean).join('\n\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: stringValue(event.titulo) || 'Evento Glottia',
    dates: `${formatForGoogle(start)}/${formatForGoogle(end)}`,
    details,
    location: stringValue(event.ubicacion) || stringValue(event.enlaceVirtual) || 'Glottia',
    ctz: TIMEZONE,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function openGoogleCalendarEvent(event: GoogleCalendarEvent): void {
  if (typeof window === 'undefined') return;
  window.open(buildGoogleCalendarUrl(event), '_blank', 'noopener,noreferrer');
}

function parseDate(value: unknown): Date {
  if (typeof value === 'string' && value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

function formatForGoogle(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  return `${year}${month}${day}T${hour}${minute}${second}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function stringValue(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}
