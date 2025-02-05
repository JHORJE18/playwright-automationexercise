import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';

test.describe('Casos de prueba [1-5] - Pruebas de gestión de usuario', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Elimina dialogo aceptación de cookies
        await page.waitForLoadState("domcontentloaded");

        const dialogCookies = await page.locator('body > div > div.fc-dialog-container');
        const buttonConsentCookies = await page.locator('body > div > div.fc-dialog-container > div.fc-dialog.fc-choice-dialog > div.fc-footer-buttons-container > div.fc-footer-buttons > button.fc-button.fc-cta-consent.fc-primary-button > p');
        await expect(dialogCookies).toBeVisible();
        await buttonConsentCookies.click();
        await expect(dialogCookies).not.toBeVisible();
    })

    test('Caso de prueba #1 - Registrar ususario', async ({ browserName, page }) => {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('#slider')).toBeVisible();

        const usuarioPrueba = new cuenta('1', browserName)

        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await page.getByRole('heading', { name: 'New User Signup!' }).isVisible();;

        // Formulario de registro
        const inputName = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name')
        const inputEmail = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')

        // Ingresa nombre y correo
        await inputName.fill(usuarioPrueba.name);
        await inputEmail.fill(usuarioPrueba.email);

        await page.locator('form').filter({ hasText: 'Signup' }).locator('button').click();

        /* Formulario completo de registro  */
        // Verifica información de la cuenta - Visible ✅
        await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toHaveValue(usuarioPrueba.name)
        await expect(page.getByRole('textbox', { name: 'Email *', exact: true })).toHaveValue(usuarioPrueba.email);

        await page.getByRole('radio', { name: 'Mr.' }).click();
        await page.getByRole('textbox', { name: 'Password *' }).fill(usuarioPrueba.password);

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
        await expect(page.locator('#header')).toContainText(`Logged in as ${usuarioPrueba.name}`);

        // Elimina la cuenta
        await page.getByRole('link', { name: ' Delete Account' }).click();
        await expect(page.locator('b')).toContainText('Account Deleted!');
        await page.getByRole('link', { name: 'Continue' }).click();
    });

    test('Caso de prueba #2 - Inicio sesión con datos correctos ✅', async ({ browserName, page }) => {
        await expect(page.locator('#slider')).toBeVisible();

        // Registro previo usuario de prueba
        const usuarioPrueba = new cuenta('2', browserName);
        await registrarUsuarioPruebas(page, usuarioPrueba);

        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();

        // Formulario de inicio de sesión
        const inputEmail = await page.locator('form').filter({ hasText: 'login' }).getByPlaceholder('Email Address')
        const inputPassword = await page.locator('form').filter({ hasText: 'login' }).getByPlaceholder('Password')
        await inputEmail.fill(usuarioPrueba.email);
        await inputPassword.fill(usuarioPrueba.password);

        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.locator('#header')).toContainText(`Logged in as ${usuarioPrueba.name}`);

        // Elimina usuario de pruebas
        await eliminarUsuarioPruebas(page, usuarioPrueba, true);
    });

    test('Caso de prueba #3 - Inicio sesión con datos incorrectos ❌', async ({ page }) => {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('#slider')).toBeVisible();

        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').click();
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('email@notexists.com');
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').press('Tab');
        await page.getByRole('textbox', { name: 'Password' }).fill('noPassword');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });

    test('Caso de prueba #4 - Cerrar sesión de usuario', async ({ browserName, page }) => {
        await expect(page.locator('#slider')).toBeVisible();

        // Registro previo usuario de prueba
        const usuarioPrueba = new cuenta('4', browserName);
        await registrarUsuarioPruebas(page, usuarioPrueba);

        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();

        // Formulario de inicio de sesión
        const inputEmail = await page.locator('form').filter({ hasText: 'login' }).getByPlaceholder('Email Address')
        const inputPassword = await page.locator('form').filter({ hasText: 'login' }).getByPlaceholder('Password')
        await inputEmail.fill(usuarioPrueba.email);
        await inputPassword.fill(usuarioPrueba.password);

        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.locator('#header')).toContainText(`Logged in as ${usuarioPrueba.name}`);

        await page.getByRole('link', { name: ' Logout' }).click();
        await expect(page).toHaveURL(/\/login$/);

        // Elimina usuario de pruebas
        await eliminarUsuarioPruebas(page, usuarioPrueba, false);
    });

    test('Caso de prueba #5 - Registrar usuario con correo electrónico existente', async ({ browserName, page }) => {
        await expect(page.locator('#slider')).toBeVisible();

        // Registro previo usuario de prueba
        const usuarioPrueba = new cuenta('5', browserName);
        await registrarUsuarioPruebas(page, usuarioPrueba);

        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await page.getByRole('heading', { name: 'New User Signup!' }).isVisible();;

        // Formulario de registro
        const inputName = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name')
        const inputEmail = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')

        // Ingresa nombre y correo
        await inputName.fill(usuarioPrueba.name);
        await inputEmail.fill(usuarioPrueba.email);

        await page.locator('form').filter({ hasText: 'Signup' }).locator('button').click();
        await expect(page.locator('#form')).toContainText('Email Address already exist!');

        // Elimina usuario de pruebas
        await eliminarUsuarioPruebas(page, usuarioPrueba, false);
    });
});

class cuenta {
    name: string;
    email: string;
    password: string;
    numberTest: string;
    browserName: string;

    constructor(numberTest: string, browserName: string) {
        this.browserName = browserName;
        this.numberTest = numberTest;
        this.name = `Prueba ${numberTest}, ${browserName}`;
        this.email = `prueba${numberTest}@${browserName}.com`;
        this.password = '123456789';
    }
}

// Registra un usuario de pruebas para realizar pruebas
async function registrarUsuarioPruebas(page, usuario: cuenta) {
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator('#slider')).toBeVisible();
    await page.getByRole('link', { name: ' Signup / Login' }).click();
    await page.getByRole('heading', { name: 'New User Signup!' }).isVisible();;

    // Formulario de registro
    const inputName = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name')
    const inputEmail = await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')

    // Ingresa nombre y correo
    await inputName.fill(usuario.name);
    await inputEmail.fill(usuario.email);

    await page.locator('form').filter({ hasText: 'Signup' }).locator('button').click();

    // Validar si cuenta ya existe
    if (await page.getByText('Email Address already exist!').isVisible()) {
        return true;
    }

    /* Formulario completo de registro  */
    await page.getByRole('radio', { name: 'Mr.' }).click();
    await page.getByRole('textbox', { name: 'Password *' }).fill(usuario.password);

    // Fecha de nacimiento
    await page.locator('#days').selectOption('18');
    await page.locator('#months').selectOption('December');
    await page.locator('#years').selectOption('1997');

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
    await expect(page.locator('#header')).toContainText('Logged in as ' + usuario.name);
    await page.getByRole('link', { name: ' Logout' }).click();

    return true;
};

async function eliminarUsuarioPruebas(page, usuario: cuenta, isLogged = false) {
    // Realizar login
    if (!isLogged) {
        await page.getByRole('link', { name: ' Signup / Login' }).click();
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();

        // Formulario de inicio de sesión
        const inputEmail = await page.locator('form').filter({ hasText: 'login' }).getByPlaceholder('Email Address')
        const inputPassword = await page.locator('form').filter({ hasText: 'login' }).getByPlaceholder('Password')
        await inputEmail.fill(usuario.email);
        await inputPassword.fill(usuario.password);

        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.locator('#header')).toContainText('Logged in as ' + usuario.name);
    }

    await expect(page.getByText('Logged in as ' + usuario.name)).toBeVisible();
    await page.getByRole('link', { name: ' Delete Account' }).click();
    await expect(page.locator('b')).toContainText('Account Deleted!');
    await page.getByRole('link', { name: 'Continue' }).click();

    return true;
};