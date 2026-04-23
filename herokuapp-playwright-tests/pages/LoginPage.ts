import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use getByLabel for semantic HTML form inputs
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    // Use getByRole for button
    this.loginButton = page.getByRole('button', { name: /login/i });
    // Success message appears after successful login
    this.successMessage = page.getByText('You logged into a secure area!');
    // Error message appears after invalid login
    this.errorMessage = page.getByText('Your username is invalid!');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/login');
  }

  /**
   * Perform login with provided credentials
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Get the success message text after successful login
   */
  async getSuccessMessage(): Promise<string | null> {
    return await this.successMessage.textContent();
  }

  /**
   * Get the error message text after failed login
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }
}
