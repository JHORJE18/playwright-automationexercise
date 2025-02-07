import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';
import { aceptarCookies, checkPaginaInicio } from './utils';

test.describe('Casos de prueba [8-24] - Pruebas de gestión de usuario', () => {

    test.beforeEach(async ({ page }) => {
        // Go to await expect(page.locator('#slider')).toBeVisible();
        await page.goto('/');
        await aceptarCookies(page);
        await checkPaginaInicio(page);
    })

    test('Caso de prueba #8 - Verificar todos los productos y página de detalles del producto', async ({ page }) => {
        await page.getByRole('link', { name: ' Products' }).click();
        await expect(page).toHaveURL(/\/products$/);
        await expect(page).toHaveTitle(/.*All Products.*/);

        await expect(page.getByText('All Products  Added! Your')).toBeVisible();
        await page.locator('.product-image-wrapper').first().getByText('View Product').click();
        await expect(page.getByRole('heading', { name: 'Blue Top' })).toBeVisible();
        await expect(page.getByText('Category: Women > Tops')).toBeVisible();
        await expect(page.getByText('Rs.')).toBeVisible();
        await expect(page.getByText('Availability: In Stock')).toBeVisible();
        await expect(page.getByText('Condition: New')).toBeVisible();
        await expect(page.getByText('Brand: Polo')).toBeVisible();
    })

    test('Caso de prueba #9 - Buscar producto', async ({ page }) => {

    })
})