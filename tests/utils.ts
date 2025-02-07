import { expect } from "@playwright/test";

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