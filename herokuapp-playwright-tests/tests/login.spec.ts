import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { validCredentials, invalidCredentials } from '../test-data/loginTestData';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login(validCredentials.username, validCredentials.password);
    const successMessage = await loginPage.getSuccessMessage();
    expect(successMessage).toContain('You logged into a secure area!');
  });

  test('should show error message with invalid credentials', async () => {
    await loginPage.login(invalidCredentials.username, invalidCredentials.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Your username is invalid!');
  });
});
