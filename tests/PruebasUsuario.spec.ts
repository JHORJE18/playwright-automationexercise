import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';

test.describe('Casos de prueba [1-5] - Pruebas de gestión de usuario', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('Caso de prueba #1 - Registrar ususario', async ({ page }) => {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('#slider')).toBeVisible();
        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await page.getByRole('heading', { name: 'New User Signup!' }).isVisible();;

        // Formulario de registro
        const inputName = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name')
        const inputEmail = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')

        // Ingresa nombre y correo
        await inputName.fill('Nombre de prueba');
        await inputEmail.fill('email@deprueba.com');

        await page.locator('form').filter({ hasText: 'Signup' }).locator('button').click();

        /* Formulario completo de registro  */
        // Verifica información de la cuenta - Visible ✅
        await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toHaveValue('Nombre de prueba')
        await expect(page.getByRole('textbox', { name: 'Email *', exact: true })).toHaveValue('email@deprueba.com');

        await page.getByRole('radio', { name: 'Mr.' }).click();
        await page.getByRole('textbox', { name: 'Password *' }).fill('123456789');

        // Fecha de nacimiento
        await page.locator('#days').selectOption('18');
        await page.locator('#months').selectOption('December');
        await page.locator('#years').selectOption('1997');

        // Marca casillas de verficiación
        await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
        await page.getByRole('checkbox', { name: 'Receive special offers from' }).check();

        // Rellena formulario completo
        await page.locator('#first_name').fill('Nombre');
        await page.locator('#last_name').fill('Apellido');
        await page.locator('#company').fill('Empresa SL');
        await page.locator('#address1').fill('Calle de prueba 10');
        await page.locator('#country').selectOption('United States');
        await page.locator('#state').fill('Estado EEUU');
        await page.locator('#city').fill('Nueva York');
        await page.locator('#zipcode').fill('20000');
        await page.locator('#mobile_number').fill('20000');
        await page.getByRole('button', { name: 'Create Account' }).click();

        // Verifica que la cuenta se ha creado
        await expect(page.locator('b')).toContainText('Account Created!');
        await page.getByRole('link', { name: 'Continue' }).click();

        // Verifica que se ha iniciado sesión
        await expect(page.locator('#header')).toContainText('Logged in as Nombre de prueba');

        // Elimina la cuenta
        await page.getByRole('link', { name: ' Delete Account' }).click();
        await expect(page.locator('b')).toContainText('Account Deleted!');
        await page.getByRole('link', { name: 'Continue' }).click();
    });

    test('Caso de prueba #2 - Inicio sesión con datos correctos ✅', async ({ page }) => {
        // TODO: Ususario registrado no existe ya que se elimina
    });

    test('Caso de prueba #3 - Inicio sesión con datos incorrectos ❌', async ({ page }) => {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('#slider')).toBeVisible();

        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').click();
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('email@deprueba.com');
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').press('Tab');
        await page.getByRole('textbox', { name: 'Password' }).fill('123456789');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });

    test('Caso de prueba #4 - Cerrar sesión de usuario', async ({ page }) => {
        // TODO: Ususario registrado no existe ya que se elimina
    });

    test('Caso de prueba #5 - Registrar usuario con correo electrónico existente', async ({ page }) => {
        // TODO: Implementar caso de prueba
    });
});