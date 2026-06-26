import { expect, test } from '@playwright/test';

test('registers a role from the frontend and shows it in the detail list', async ({ page }) => {
  const stamp = Date.now();
  const roleName = `TEST_FRONTEND_ROLE_${stamp}`;

  await page.goto('/roles');
  await expect(page.getByRole('heading', { name: 'Roles' })).toBeVisible();

  await page.getByRole('link', { name: 'Registrar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Registrar rol' })).toBeVisible();

  await page.getByLabel('Nombre').fill(roleName);
  await page.getByLabel('Descripcion').fill('Creado desde prueba Playwright del frontend');
  await page.getByRole('button', { name: 'Guardar' }).click();

  await expect(page).toHaveURL(/\/roles$/);
  await expect(page.getByText('Guardado exitosamente.')).toBeVisible();
  await expect(page.getByText('Cargando datos...')).toBeHidden({ timeout: 15_000 });
  const createdCard = page.locator('mat-card').filter({ hasText: roleName });
  await expect(createdCard).toBeVisible();
  await expect(createdCard.getByText('Creado desde prueba Playwright del frontend')).toBeVisible();

  await createdCard.getByRole('link', { name: 'Modificar' }).click();
  await expect(page.getByRole('heading', { name: 'Actualizar rol' })).toBeVisible();
  await page.getByLabel('Descripcion').fill('Modificado desde prueba Playwright del frontend');
  await page.getByRole('button', { name: 'Modificar' }).click();

  await expect(page).toHaveURL(/\/roles$/);
  await expect(page.getByText('Modificado exitosamente.')).toBeVisible();
  await expect(page.getByText('Cargando datos...')).toBeHidden({ timeout: 15_000 });
  await expect(createdCard).toBeVisible();
  await expect(createdCard.getByText('Modificado desde prueba Playwright del frontend')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await createdCard.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page).toHaveURL(/\/roles$/);
  await expect(page.getByText('Eliminado exitosamente.')).toBeVisible();
  await expect(page.getByText(roleName)).toBeHidden({ timeout: 15_000 });
});

test('opens reservation form from event reserve button with the event prefilled', async ({ page, request }) => {
  const stamp = Date.now();
  const eventTitle = `TEST_EVENT_RESERVE_${stamp}`;

  const role = await request.post('http://localhost:8080/api/roles', {
    data: { nombre: `TEST_ROLE_RESERVE_${stamp}`, descripcion: 'Rol para prueba de reserva' },
  });
  const roleBody = await role.json();

  const user = await request.post('http://localhost:8080/api/users', {
    data: {
      nombre: 'TEST',
      apellido: `Reserva ${stamp}`,
      correo: `test.reserva.${stamp}@glottia.com`,
      contrasena: '123456',
      ciudad: 'Lima',
      modalidad: 'Virtual',
      estado: true,
      idRol: roleBody.idRol,
    },
  });
  const userBody = await user.json();

  const language = await request.post('http://localhost:8080/api/languages', {
    data: { nombre: `TEST Idioma Reserva ${stamp}`, codigoIso: `r${String(stamp).slice(-2)}`, descripcion: 'Idioma para prueba de reserva' },
  });
  const languageBody = await language.json();

  const event = await request.post('http://localhost:8080/api/events', {
    data: {
      titulo: eventTitle,
      descripcion: 'Evento para probar reservar cupo',
      modalidad: 'Virtual',
      fechaHora: '2026-12-30T18:00:00',
      cupoMaximo: 10,
      ubicacion: 'Lima',
      enlaceVirtual: 'https://meet.example/reserva',
      estado: 'Activo',
      idIdioma: languageBody.idIdioma,
      idOrganizador: userBody.idUsuario,
    },
  });
  const eventBody = await event.json();

  await page.goto('/eventos');
  await expect(page.getByText('Cargando datos...')).toBeHidden({ timeout: 15_000 });

  const eventCard = page.locator('mat-card').filter({ hasText: eventTitle });
  await expect(eventCard).toBeVisible();
  await eventCard.getByRole('link', { name: 'Reservar cupo' }).click();

  await expect(page).toHaveURL(new RegExp(`/reservas/insert\\?idEvento=${eventBody.idEvento}`));
  await expect(page.getByRole('heading', { name: 'Reservar cupo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reservar cupo' })).toBeVisible();
  await expect(page.getByLabel('ID Evento')).toHaveValue(String(eventBody.idEvento));
});
