import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';
import { aceptarCookies, checkPaginaInicio } from './utils';

test.describe('Casos de prueba [12-24] - Pruebas de gestión de usuario', () => {

    test.beforeEach(async ({ page }) => {
        // Go to https://automationexercise.com
        await page.goto('/');
        await aceptarCookies(page);
        await checkPaginaInicio(page);
    })

    test('Caso de prueba #12 - Agregar productos al carrito', async ({ page }) => {
        await page.getByRole('link', { name: ' Products' }).click();
        const listadoProductos = await page.locator('.product-image-wrapper');

        // Añadir al carrito primer producto
        const primerProducto = await listadoProductos.nth(0).locator('.productinfo');
        const precioPrimerProducto = await primerProducto.locator('h2').textContent();
        await primerProducto.getByText('Add to cart').click();

        await page.getByRole('button', { name: 'Continue Shopping' }).click();

        // Añadir segundo producto
        const segundoProducto = await listadoProductos.nth(1).locator('.productinfo');
        const precioSegundoProducto = await segundoProducto.locator('h2').textContent();
        await segundoProducto.getByText('Add to cart').click();

        await page.getByRole('link', { name: 'View Cart' }).click();

        // Verificar productos añadidos
        const listadoProductosCarrito = await page.locator('tbody').getByRole('row');
        await expect(await listadoProductosCarrito.count()).toBe(2);

        // Verifica producto #1
        await expect(listadoProductosCarrito.first().locator('.cart_price p')).toContainText(precioPrimerProducto!)
        await expect(listadoProductosCarrito.first().locator('.cart_quantity button')).toContainText('1');
        await expect(listadoProductosCarrito.first().locator('.cart_total p')).toContainText(precioPrimerProducto!);

        // Verifica producto #2
        await expect(listadoProductosCarrito.last().locator('.cart_price p')).toContainText(precioSegundoProducto!)
        await expect(listadoProductosCarrito.last().locator('.cart_quantity button')).toContainText('1');
        await expect(listadoProductosCarrito.last().locator('.cart_total p')).toContainText(precioSegundoProducto!);
    })

    test('Caso de prueba #13 - Verificar cantidad de productos en el carrito', async ({ page }) => {
        const listadoProductos = await page.locator('.product-image-wrapper');
        const indiceAleatorio = Math.floor(Math.random() * await listadoProductos.count())
        const productoAleatorio = listadoProductos.nth(indiceAleatorio)

        await productoAleatorio.getByText('View Product').click();

        // Ficha del producto
        const productInfo = await page.locator('.product-information');

        // Verifica visibilidad de detalles del producto
        await expect(productInfo).toBeVisible();
        await expect(productInfo.getByText('Category:')).toBeVisible();
        await expect(productInfo.getByText('Rs.')).toBeVisible();
        await expect(productInfo.getByText('Availability:')).toBeVisible();
        await expect(productInfo.getByText('Condition:')).toBeVisible();
        await expect(productInfo.getByText('Brand:')).toBeVisible();

        // Añade a 4 unidades y verifica desde el carrito
        await page.locator('#quantity').fill('4');
        await page.getByRole('button', { name: ' Add to cart' }).click();
        await page.getByRole('link', { name: 'View Cart' }).click();

        const listadoProductosCarrito = await page.locator('tbody').getByRole('row');
        await expect(listadoProductosCarrito.first().locator('.cart_quantity button')).toContainText('4');
    })
})