import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';
import { aceptarCookies, checkPaginaInicio, cuenta, eliminarUsuarioPruebas } from './utils';

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

    test('Caso de prueba #14 - Realizar pedido: Registrarse durante el pago', async ({ page, browserName }) => {
        const usuarioPrueba: cuenta = new cuenta('14', browserName);

        // Añadir varios productos {3}
        const listadoProductos = await page.locator('.product-image-wrapper');
        await listadoProductos.nth(0).getByText('Add to cart').first().click();
        await page.getByRole('button', { name: 'Continue Shopping' }).click();
        await listadoProductos.nth(1).getByText('Add to cart').first().click();
        await page.getByRole('button', { name: 'Continue Shopping' }).click();
        await listadoProductos.nth(2).getByText('Add to cart').first().click();
        await page.getByRole('button', { name: 'Continue Shopping' }).click();

        // Verificar productos en el carrito
        await page.getByRole('link', { name: ' Cart' }).click();
        const listadoProductosCarrito = await page.locator('tbody').getByRole('row');
        await expect(await listadoProductosCarrito.count()).toBe(3);

        await page.getByText('Proceed To Checkout').click();

        // Proceso de registro
        await page.getByRole('link', { name: 'Register / Login' }).click();

        const inputName = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name')
        const inputEmail = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')

        await inputName.fill(usuarioPrueba.name);
        await inputEmail.fill(usuarioPrueba.email);

        await page.getByRole('button', { name: 'Signup' }).click();

        /* Si la cuenta ya existe, elimina y provoca error para reiniciar la prueba */
        if (await page.getByText('Email Address already exist!').isVisible()) {
            await eliminarUsuarioPruebas(page, usuarioPrueba, false);
            throw new Error('🔄 Reintentando prueba porque la cuenta ya existía.');
        }

        /* Formulario completo de registro  */
        await page.getByRole('radio', { name: 'Mr.' }).click();
        await page.getByRole('textbox', { name: 'Password *' }).fill(usuarioPrueba.password);
        await page.locator('#days').selectOption('18');
        await page.locator('#months').selectOption('December');
        await page.locator('#years').selectOption('1997');
        await page.locator('#first_name').fill(usuarioPrueba.name);
        await page.locator('#last_name').fill('Apellido');
        await page.locator('#company').fill('Empresa SL');
        await page.locator('#address1').fill('Calle de prueba 10');
        await page.locator('#country').selectOption('United States');
        await page.locator('#state').fill('Estado EEUU');
        await page.locator('#city').fill('Nueva York');
        await page.locator('#zipcode').fill('20000');
        await page.locator('#mobile_number').fill('666666666');
        await page.getByRole('button', { name: 'Create Account' }).click();

        // Verifica que la cuenta se ha creado
        await expect(page.locator('b')).toContainText('Account Created!');
        await page.getByRole('link', { name: 'Continue' }).click();

        // Verifica que se ha iniciado sesión
        await expect(page.locator('#header')).toContainText(`Logged in as ${usuarioPrueba.name}`);

        await page.getByRole('link', { name: ' Cart' }).click();
        await page.getByText('Proceed To Checkout').click();

        // Verificar detalles dirección
        const fichaDireccionEnvio = await page.locator('#address_delivery');
        await expect(fichaDireccionEnvio.getByText(usuarioPrueba.name)).toBeVisible();
        await expect(fichaDireccionEnvio.getByText('Calle de prueba 10')).toBeVisible();
        await expect(fichaDireccionEnvio.getByText('Estado EEUU')).toBeVisible();
        await expect(fichaDireccionEnvio.getByText('United States')).toBeVisible();
        await expect(fichaDireccionEnvio.getByText('20000')).toBeVisible();
        await expect(fichaDireccionEnvio.getByText('666666666')).toBeVisible();

        // Veritifcar productos
        await expect(await page.locator('tr[id]').count()).toBe(3);

        // Ingresar comentarios y realizar pedido
        await page.locator('textarea[name="message"]').fill('Comentarios adicionales del pedido');
        await page.getByRole('link', { name: 'Place Order' }).click();

        await page.locator('input[name="name_on_card"]').fill(usuarioPrueba.name);
        await page.locator('input[name="card_number"]').fill('424242424242');
        await page.getByRole('textbox', { name: 'ex.' }).fill('434');
        await page.getByRole('textbox', { name: 'MM' }).fill('12');
        await page.getByRole('textbox', { name: 'YYYY' }).fill('2025');
        await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
        await expect(page.getByText('Congratulations! Your order')).toBeVisible();

        // Elimina cuenta usuario
        await eliminarUsuarioPruebas(page, usuarioPrueba, true);
    })
})