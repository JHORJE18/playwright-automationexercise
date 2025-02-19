import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';
import { aceptarCookies, checkPaginaInicio, cuenta, eliminarUsuarioPruebas, extraerNombreMarca, loginUsuario, registrarUsuarioPruebas } from './utils';

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

        // Ejecuta proceso de registro
        await page.getByRole('link', { name: 'Register / Login' }).click();
        await registrarUsuarioPruebas(page, usuarioPrueba, false);

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

    test('Caso de prueba #15 - Realizar pedido: Registrarse antes del pago', async ({ page, browserName }) => {
        const usuarioPrueba: cuenta = new cuenta('15', browserName);

        // Registrar ususario
        await registrarUsuarioPruebas(page, usuarioPrueba, false);

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
        await page.getByRole('link', { name: 'Place Order' }).click();

        // Datos de pago
        await page.locator('input[name="name_on_card"]').fill(usuarioPrueba.name);
        await page.locator('input[name="card_number"]').fill('424242424242');
        await page.getByRole('textbox', { name: 'ex.' }).fill('434');
        await page.getByRole('textbox', { name: 'MM' }).fill('12');
        await page.getByRole('textbox', { name: 'YYYY' }).fill('2025');
        await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
        await expect(page.getByText('Congratulations! Your order')).toBeVisible();

        // Eliminar ususario
        await eliminarUsuarioPruebas(page, usuarioPrueba, true)
    })

    test('Caso de prueba #16 - Realizar pedido: Iniciar sesión antes del pago', async ({ page, browserName }) => {
        const usuarioPrueba: cuenta = new cuenta('16', browserName);

        // Registrar ususario de pruebas
        await registrarUsuarioPruebas(page, usuarioPrueba, true);

        // Iniciar sesión
        await loginUsuario(page, usuarioPrueba);

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
        await page.getByRole('link', { name: 'Place Order' }).click();

        // Datos de pago
        await page.locator('input[name="name_on_card"]').fill(usuarioPrueba.name);
        await page.locator('input[name="card_number"]').fill('424242424242');
        await page.getByRole('textbox', { name: 'ex.' }).fill('434');
        await page.getByRole('textbox', { name: 'MM' }).fill('12');
        await page.getByRole('textbox', { name: 'YYYY' }).fill('2025');
        await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
        await expect(page.getByText('Congratulations! Your order')).toBeVisible();

        // Eliminar ususario
        await eliminarUsuarioPruebas(page, usuarioPrueba, true)
    })

    test('Caso de prueba #17 - Eliminar productos del carrito', async ({ page }) => {
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
        var listadoProductosCarrito = await page.locator('tbody').getByRole('row');
        await expect(await listadoProductosCarrito.count()).toBe(3);

        await listadoProductosCarrito.nth(0).locator('.cart_delete a').click();
        await listadoProductosCarrito.nth(1).locator('.cart_delete a').click();
        await listadoProductosCarrito.nth(2).locator('.cart_delete a').click();

        await expect(page.locator('#empty_cart')).toBeVisible();
    })

    test('Caso de prueba #18 - Ver productos de la categoria', async ({ page }) => {
        await expect(page.locator('.category-products')).toBeVisible();

        // Categoria Mujer
        await page.getByRole('link', { name: ' Women' }).click();
        const subCategoriasMujer = await page.locator('#Women').getByRole('link');
        const indiceAleatorioMujer = Math.floor(Math.random() * await subCategoriasMujer.count())
        const txtSubCategoriaMujer = await subCategoriasMujer.nth(indiceAleatorioMujer).textContent()
        await subCategoriasMujer.nth(indiceAleatorioMujer).click();
        await expect(page.getByText(`WOMEN - ${txtSubCategoriaMujer} PRODUCTS`)).toBeVisible();

        // Categoria Hombre
        await page.getByRole('link', { name: ' Men' }).click();
        const subCategoriaHombre = await page.locator('#Men').getByRole('link');
        const indiceAleatorioHombre = Math.floor(Math.random() * await subCategoriaHombre.count())
        const txtSubCategoriaHombre = await subCategoriaHombre.nth(indiceAleatorioHombre).textContent();
        await subCategoriaHombre.nth(indiceAleatorioHombre).click();
        await expect(page.getByText(`MEN - ${txtSubCategoriaHombre} PRODUCTS`)).toBeVisible();
    })

    test('Caso de prueba #19 - Ver y agregar marca al carrito Productos', async ({ page }) => {
        await page.getByRole('link', { name: ' Products' }).click();
        await expect(page.locator('.brands_products')).toBeVisible();

        // Selecciona 1º Marca
        const listadoMarcas = await page.locator('.brands-name').getByRole('link');
        const indiceAleatorio = Math.floor(Math.random() * await listadoMarcas.count())
        const txtMarca = await listadoMarcas.nth(indiceAleatorio).textContent()
        const nombreMarca = await extraerNombreMarca(txtMarca)

        await listadoMarcas.nth(indiceAleatorio).click();
        await expect(page.getByText(`BRAND - ${nombreMarca} PRODUCTS`)).toBeVisible();

        var listadoProductos = await page.locator('.product-image-wrapper').all();
        for (const producto of listadoProductos) {
            await expect(producto).toBeVisible();
        }

        // Selecciona otra marca
        const indiceAleatorio2 = Math.floor(Math.random() * await listadoMarcas.count())
        const txtMarca2 = await listadoMarcas.nth(indiceAleatorio2).textContent()
        const nombreMarca2 = extraerNombreMarca(txtMarca2);
        await listadoMarcas.nth(indiceAleatorio2).click();
        await expect(page.getByText(`BRAND - ${nombreMarca2} PRODUCTS`)).toBeVisible();

        listadoProductos = await page.locator('.product-image-wrapper').all();
        for (const producto of listadoProductos) {
            await expect(producto).toBeVisible();
        }

    })

    test('Caso de prueba #20 - Buscar productos y verificar carrito después de iniciar sesión', async ({ page, browserName }) => {
        const palabraBusqueda = 'Blue';
        const ususarioPrueba = new cuenta('20', browserName);
        await registrarUsuarioPruebas(page, ususarioPrueba, true);

        await page.getByRole('link', { name: ' Products' }).click();
        await expect(page).toHaveURL(/\/products$/);
        await expect(page).toHaveTitle(/.*All Products.*/);
        await expect(page.getByText('All Products')).toBeVisible();

        // Realizar busqueda
        await page.getByRole('textbox', { name: 'Search Product' }).fill(palabraBusqueda);
        await page.locator('#submit_search').click();

        await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
        const listaResultados = await page.locator('.product-image-wrapper').all();

        for (const producto of listaResultados) {
            // Verifica nombre producto correcto de la busqueda
            const nombreProducto = await producto.locator('.productinfo p').textContent();
            await expect(nombreProducto?.toLowerCase()).toContain(palabraBusqueda.toLowerCase());

            // Añade el producto al carrito
            await producto.locator('.productinfo a').click();
            await expect(page.locator('.modal-confirm')).toBeVisible();
            await page.getByRole('button', { name: 'Continue Shopping' }).click();
        }

        await page.getByRole('link', { name: ' Cart' }).click();

        // Verificar proudctos carrito
        var carrito = await page.locator('#cart_info_table tbody tr').all();
        for (const producto of carrito) {
            expect(producto).toBeVisible();
            const nombreProducto = await producto.locator('.cart_description a').textContent();
            await expect(nombreProducto?.toLowerCase()).toContain(palabraBusqueda.toLowerCase());
        }

        await loginUsuario(page, ususarioPrueba);

        await page.getByRole('link', { name: ' Cart' }).click();

        // Verificar proudctos carrito
        carrito = await page.locator('#cart_info_table tbody tr').all();
        for (const producto of carrito) {
            expect(producto).toBeVisible();
            const nombreProducto = await producto.locator('.cart_description a').textContent();
            await expect(nombreProducto?.toLowerCase()).toContain(palabraBusqueda.toLowerCase());
        }
    })

    test('Caso de prueba #21 - Agregar una reseña sobre el producto', async ({ page, browserName }) => {
        const ususarioPrueba = new cuenta('21', browserName);

        await page.getByRole('link', { name: ' Products' }).click();
        await expect(page).toHaveURL(/\/products$/);
        await expect(page).toHaveTitle(/.*All Products.*/);
        await expect(page.getByText('All Products')).toBeVisible();

        await page.getByText('View product').first().click();
        await expect(page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Your Name' }).fill(ususarioPrueba.name);
        await page.getByRole('textbox', { name: 'Email Address', exact: true }).fill(ususarioPrueba.email);
        await page.getByRole('textbox', { name: 'Add Review Here!' }).fill('Reseña de prueba desde ' + browserName);

        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByText('Thank you for your review.')).toBeVisible();
    })
})