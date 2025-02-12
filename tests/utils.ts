import { expect } from "@playwright/test";

// Acepta las cookies de la página (Si se muestra alerta)
export async function aceptarCookies(page) {
    // Elimina dialogo aceptación de cookies
    await page.waitForLoadState("domcontentloaded");
    const dialogCookies = await page.locator('body > div > div.fc-dialog-container');

    // No se  muestra al ususario
    if (await dialogCookies.count() < 1) {
        return;
    }

    const buttonConsentCookies = await page.locator('body > div > div.fc-dialog-container > div.fc-dialog.fc-choice-dialog > div.fc-footer-buttons-container > div.fc-footer-buttons > button.fc-button.fc-cta-consent.fc-primary-button > p');
    await expect(dialogCookies).toBeVisible();
    await buttonConsentCookies.click();
    await expect(dialogCookies).not.toBeVisible();

    return true;
}

export class cuenta {
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

export async function checkPaginaInicio(page) {
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('#slider')).toBeVisible();
}

// Registra un usuario de pruebas
export async function registrarUsuarioPruebas(page, usuario: cuenta, logout: boolean = true) {
    await page.waitForLoadState("domcontentloaded");

    // Navega si no esta en página de registro
    if (!(await page.url()).includes('/login')) {
        await expect(page.locator('#slider')).toBeVisible();
        await page.getByRole('link', { name: ' Signup / Login' }).click();
    }

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
    await page.locator('#first_name').fill(usuario.name);
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

    if (logout) {
        await page.getByRole('link', { name: ' Logout' }).click();
    }

    return true;
};

// Elimina un ususario de pruebas
export async function eliminarUsuarioPruebas(page, usuario: cuenta, isLogged = false) {
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