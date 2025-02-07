import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';
import path from 'path';
import { aceptarCookies } from './utils';

test.describe('Casos de prueba [6,7,25,26] - Pruebas de gestión de usuario', () => {

    test.beforeEach(async ({ page }) => {
        // Go To -> https://www.automationexercise.com/
        await page.goto('/');
        await aceptarCookies(page);
    })

    test('Caso de prueba #6 - Formulario de contacto', async ({ page }) => {
        // Prepara archivo para subir
        const filePath = path.resolve(__dirname, '../resources/logo.png');

        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('#slider')).toBeVisible();

        await page.getByRole('link', { name: ' Contact us' }).click();
        await page.getByRole('textbox', { name: 'Name' }).click();
        await page.getByRole('textbox', { name: 'Name' }).fill('Manuel');
        await page.getByRole('textbox', { name: 'Email', exact: true }).click();
        await page.getByRole('textbox', { name: 'Email', exact: true }).fill('email@pruebacontacto.com');
        await page.getByRole('textbox', { name: 'Subject' }).click();
        await page.getByRole('textbox', { name: 'Subject' }).fill('Solicitud de contacto');
        await page.getByRole('textbox', { name: 'Your Message Here' }).click();
        await page.getByRole('textbox', { name: 'Your Message Here' }).fill('Hola, me pongo en contacto con ustedes para verificar que este formulario funciona correctamente.');
        await page.locator('input[name="upload_file"]').setInputFiles(filePath);

        // Aceptar próximo alert
        await page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.locator('#contact-page')).toContainText('Success! Your details have been submitted successfully.');
        await page.getByRole('link', { name: ' Home' }).click();

        // Verifica página principal
        await expect(page).toHaveURL(/.*automationexercise\.com.*/);
    })
});