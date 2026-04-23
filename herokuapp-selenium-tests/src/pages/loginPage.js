// src/pages/loginPage.js

const { By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * LoginPage object representing the login page of the Heroku application
 * Follows Page Object Model pattern for maintainability and reusability
 */
class LoginPage {
  constructor(driver) {
    this.driver = driver;
    // Use environment variable for base URL, fallback to default
    this.baseUrl = process.env.BASE_URL || 'https://the-internet.herokuapp.com';
    this.url = `${this.baseUrl}/login`;
    
    // Locators - prefer id/name, then CSS selectors, XPath only if necessary
    this.usernameInputLocator = By.id('username');
    this.passwordInputLocator = By.id('password');
    this.loginButtonLocator = By.css('button[type="submit"]');
    this.errorMessageLocator = By.id('flash');
    this.logoutButtonLocator = By.css('a[href="/logout"]'); // CSS selector instead of XPath
    this.securePageHeaderLocator = By.css('#content .example h2'); // Current secure-page heading
    this.welcomeMessageLocator = By.css('#content .example h2'); // Reused by existing tests
    
    // Default wait timeout
    this.defaultWaitTimeout = 10000;
  }

  /**
   * Helper method to wait for a condition using Selenium 4 WebDriver.wait()
   * Provides backward compatibility with Selenium 3 style waitFor().until() pattern
   * @returns {Object} Object with until method compatible with Selenium 3 tests
   */
  waitFor() {
    const driver = this.driver;
    const defaultWaitTimeout = this.defaultWaitTimeout;
    return {
      until: (condition) => {
        return driver.wait(condition, defaultWaitTimeout);
      }
    };
  }

  /**
   * Load valid credentials from CSV file
   * Provides externalized credential management instead of hardcoding
   * @returns {Promise<Object>} Object with username and password
   */
  async loadValidCredentials() {
    return new Promise((resolve, reject) => {
      const csvPath = process.env.CREDENTIALS_PATH || 
        path.join(__dirname, '../tests/credentials.csv');
      
      if (!fs.existsSync(csvPath)) {
        reject(new Error(`Credentials file not found at: ${csvPath}`));
        return;
      }

      const credentials = [];
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Accept the real site success copy as well as small wording variants.
          const normalizedResult = String(row.result || '').trim().toLowerCase();
          if (
            normalizedResult.includes('logged into a secure area') ||
            normalizedResult.includes('logged in') ||
            normalizedResult.includes('success')
          ) {
            credentials.push({ username: row.username, password: row.password });
          }
        })
        .on('end', () => {
          if (credentials.length > 0) {
            resolve(credentials[0]);
          } else {
            reject(new Error('Valid credentials not found in CSV'));
          }
        })
        .on('error', (error) => {
          reject(new Error(`Failed to parse credentials CSV: ${error.message}`));
        });
    });
  }

  /**
   * Navigate to the login page
   */
  async navigateTo() {
    await this.driver.get(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the login page to load completely
   * Uses explicit wait for username input field
   */
  async waitForPageLoad() {
    await this.waitFor().until(until.elementLocated(this.usernameInputLocator));
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed() {
    try {
      await this.driver.findElement(this.usernameInputLocator);
      await this.driver.findElement(this.loginButtonLocator);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the username input field
   */
  async getUsernameField() {
    return await this.driver.findElement(this.usernameInputLocator);
  }

  /**
   * Get the password input field
   */
  async getPasswordField() {
    return await this.driver.findElement(this.passwordInputLocator);
  }

  /**
   * Enter username into the username field
   * @param {string} username - The username to enter
   */
  async enterUsername(username) {
    const usernameField = await this.getUsernameField();
    await usernameField.clear();
    if (username) {
      await usernameField.sendKeys(username);
    }
  }

  /**
   * Enter password into the password field
   * @param {string} password - The password to enter
   */
  async enterPassword(password) {
    const passwordField = await this.getPasswordField();
    await passwordField.clear();
    if (password) {
      await passwordField.sendKeys(password);
    }
  }

  /**
   * Get the current value of the username field
   */
  async getUsernameValue() {
    const usernameField = await this.getUsernameField();
    return await usernameField.getAttribute('value');
  }

  /**
   * Get the current value of the password field
   */
  async getPasswordValue() {
    const passwordField = await this.getPasswordField();
    return await passwordField.getAttribute('value');
  }

  /**
   * Clear the username field
   */
  async clearUsername() {
    const usernameField = await this.getUsernameField();
    await usernameField.clear();
  }

  /**
   * Clear the password field
   */
  async clearPassword() {
    const passwordField = await this.getPasswordField();
    await passwordField.clear();
  }

  /**
   * Click the Login button
   */
  async clickLoginButton() {
    const loginButton = await this.driver.findElement(this.loginButtonLocator);
    await loginButton.click();
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed() {
    try {
      const errorElement = await this.driver.findElement(this.errorMessageLocator);
      return await errorElement.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the error message text
   */
  async getErrorMessage() {
    try {
      const errorElement = await this.driver.findElement(this.errorMessageLocator);
      return await errorElement.getText();
    } catch (error) {
      return '';
    }
  }

  /**
   * Perform a login action
   * @param {string} username - The username to use
   * @param {string} password - The password to use
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Wait for error message to appear
   * Uses explicit wait instead of sleep
   */
  async waitForErrorMessage() {
    await this.waitFor().until(
      until.elementLocated(this.errorMessageLocator),
      'Error message did not appear'
    );
  }

  /**
   * Wait for the secure page to finish loading after a successful login
   */
  async waitForSecurePage() {
    await this.waitFor().until(
      until.urlContains('/secure'),
      'User was not redirected to secure page'
    );
    await this.waitFor().until(
      until.elementLocated(this.logoutButtonLocator),
      'Logout button should be visible on secure page'
    );
  }

  /**
   * Wait for the logout button to be present and visible
   */
  async waitForLogoutButton() {
    const logoutButton = await this.waitFor().until(
      until.elementLocated(this.logoutButtonLocator),
      'Logout button did not appear'
    );
    await this.waitFor().until(
      until.elementIsVisible(logoutButton),
      'Logout button is not visible'
    );
    return logoutButton;
  }

  /**
   * Check if logout button is visible (indicates successful login)
   */
  async isLogoutButtonVisible() {
    try {
      const logoutButton = await this.driver.findElement(this.logoutButtonLocator);
      return await logoutButton.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Click the Logout button
   */
  async clickLogoutButton() {
    const logoutButton = await this.driver.findElement(this.logoutButtonLocator);
    await logoutButton.click();
  }

  /**
   * Check if secure page header is displayed
   */
  async isSecurePageHeaderDisplayed() {
    try {
      const header = await this.driver.findElement(this.securePageHeaderLocator);
      return await header.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the welcome message text
   */
  async getWelcomeMessage() {
    try {
      const welcomeElement = await this.driver.findElement(this.welcomeMessageLocator);
      return await welcomeElement.getText();
    } catch (error) {
      return '';
    }
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  /**
   * Wait for page to load after action
   * Uses explicit wait for element presence instead of sleep
   */
  async waitForPageNavigation() {
    // Wait for page to stabilize by checking element presence
    await this.waitFor().until(
      until.elementLocated(this.usernameInputLocator),
      'Page navigation failed'
    );
  }
}

module.exports = LoginPage;
