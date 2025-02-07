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

})