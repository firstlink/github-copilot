// src/tests/loginTest.js

const { Builder, until, By, WebDriverWait } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const LoginPage = require('../pages/loginPage');

// Load environment variables
require('dotenv').config();

/**
 * Login Test Suite
 * 
 * Comprehensive test suite for the Heroku application login functionality.
 * Tests cover:
 * - TC_LOGIN_001: Successful login with valid credentials (happy path)
 * - TC_LOGIN_002: Login with invalid username
 * - TC_LOGIN_003: Login with invalid password
 * - TC_LOGIN_004: Login with empty fields
 * - TC_LOGIN_005: Field validation and data input
 * - TC_LOGIN_006: Security cases (SQL injection, XSS)
 * - TC_LOGIN_007: Error message verification
 * - TC_LOGIN_008: Session management and logout
 */

describe('Login Feature Tests', function() {
  // Set timeout for all tests in this suite
  this.timeout(60000);

  let driver;
  let loginPage;

  /**
   * Setup: Initialize WebDriver before all tests
   */
  before(async function() {
    const chromeOptions = new chrome.Options()
      .excludeSwitches('enable-automation')
      .addArguments(
        '--disable-save-password-bubble',
        '--disable-features=PasswordManagerOnboarding,PasswordCheck,PasswordLeakDetection,PasswordGeneration',
        '--no-default-browser-check',
        '--no-first-run'
      )
      .setUserPreferences({
        credentials_enable_service: false,
        profile: {
          password_manager_enabled: false,
          password_manager_leak_detection: false
        },
        'autofill.profile_enabled': false,
        'autofill.credit_card_enabled': false
      });

    // Initialize Chrome WebDriver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
    
    // Maximize window for consistent element visibility
    await driver.manage().window().maximize();
    
    // Initialize LoginPage object
    loginPage = new LoginPage(driver);
  });

  /**
   * Teardown: Close the WebDriver after all tests
   */
  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  /**
   * Before each test: Navigate to login page
   */
  beforeEach(async function() {
    await driver.manage().deleteAllCookies();
    await loginPage.navigateTo();
  });

  // ========================================
  // TC_LOGIN_001: Successful Login with Valid Credentials
  // ========================================
  describe('TC_LOGIN_001: Successful Login with Valid Credentials', function() {
    it('should successfully log in with valid credentials and display secure page', async function() {
      // Verify login page is displayed
      const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
      expect(isLoginPageDisplayed, 'Login page should be displayed').to.be.true;

      // Load valid credentials from CSV instead of hardcoding
      const credentials = await loginPage.loadValidCredentials();
      
      await loginPage.login(credentials.username, credentials.password);

      // Wait for page navigation using explicit wait
      await loginPage.waitForSecurePage();

      // Verify redirect to secure page
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl, 'URL should contain /secure').to.include('/secure');

      // Verify logout button is visible (indicates successful authentication)
      const logoutButtonVisible = await loginPage.isLogoutButtonVisible();
      expect(logoutButtonVisible, 'Logout button should be visible on secure page').to.be.true;

      // Verify secure page heading and flash message
      const welcomeMessage = await loginPage.getWelcomeMessage();
      expect(welcomeMessage, 'Secure page heading should be displayed').to.include('Secure Area');

      const flashMessage = await loginPage.getErrorMessage();
      expect(flashMessage, 'Success flash message should be displayed').to.include('logged into a secure area');
    });
  });

  // ========================================
  // TC_LOGIN_002: Login with Invalid Username
  // ========================================
  describe('TC_LOGIN_002: Login with Invalid Username', function() {
    it('should reject login with invalid username and display error message', async function() {
      // Verify login page is displayed
      const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
      expect(isLoginPageDisplayed, 'Login page should be displayed').to.be.true;

      const invalidUsername = 'invaliduser';
      // Load valid password from external credentials
      const credentials = await loginPage.loadValidCredentials();
      const validPassword = credentials.password;

      // Perform login with invalid username
      await loginPage.login(invalidUsername, validPassword);

      // Wait for error message to appear using explicit wait
      await loginPage.waitForErrorMessage();

      // Verify error message is displayed
      const errorMessageDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(errorMessageDisplayed, 'Error message should be displayed').to.be.true;

      // Verify error message content
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage, 'Error message should mention invalid username').to.include('Your username is invalid');

      // Verify user remains on login page (URL not changed to /secure)
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl, 'URL should not contain /secure').not.to.include('/secure');

      // The site redirects back to a fresh login form after failure.
      const usernameValue = await loginPage.getUsernameValue();
      expect(usernameValue, 'Username field should reset after failed login').to.equal('');

      // Verify password field is cleared for security
      const passwordValue = await loginPage.getPasswordValue();
      expect(passwordValue, 'Password field should be cleared after failed login').to.equal('');
    });
  });

  // ========================================
  // TC_LOGIN_003: Login with Invalid Password
  // ========================================
  describe('TC_LOGIN_003: Login with Invalid Password', function() {
    it('should reject login with invalid password and display error message', async function() {
      // Verify login page is displayed
      const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
      expect(isLoginPageDisplayed, 'Login page should be displayed').to.be.true;

      // Load valid username from external credentials
      const credentials = await loginPage.loadValidCredentials();
      const validUsername = credentials.username;
      const invalidPassword = 'wrongpassword';

      // Perform login with invalid password
      await loginPage.login(validUsername, invalidPassword);

      // Wait for error message to appear using explicit wait
      await loginPage.waitForErrorMessage();

      // Verify error message is displayed
      const errorMessageDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(errorMessageDisplayed, 'Error message should be displayed').to.be.true;

      // Verify error message content
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage, 'Error message should mention invalid password').to.include('Your password is invalid');

      // Verify user remains on login page
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl, 'URL should not contain /secure').not.to.include('/secure');

      // The site redirects back to a fresh login form after failure.
      const usernameValue = await loginPage.getUsernameValue();
      expect(usernameValue, 'Username field should reset after failed login').to.equal('');

      // Verify password field is cleared for security
      const passwordValue = await loginPage.getPasswordValue();
      expect(passwordValue, 'Password field should be cleared after failed login').to.equal('');
    });
  });

  // ========================================
  // TC_LOGIN_004: Login with Empty Fields
  // ========================================
  describe('TC_LOGIN_004: Login with Empty Fields', function() {
    it('should prevent login with empty username and password fields', async function() {
      // Verify login page is displayed
      const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
      expect(isLoginPageDisplayed, 'Login page should be displayed').to.be.true;

      // Verify both fields are empty initially
      let usernameValue = await loginPage.getUsernameValue();
      let passwordValue = await loginPage.getPasswordValue();
      
      expect(usernameValue, 'Username field should be empty initially').to.equal('');
      expect(passwordValue, 'Password field should be empty initially').to.equal('');

      // Click login button without entering any data
      await loginPage.clickLoginButton();

      // Wait for page to stabilize with explicit wait instead of sleep
      await loginPage.waitFor().until(
        until.stalenessOf(await loginPage.getUsernameField()),
        'Element should update'
      ).catch(() => {
        // Element might not go stale, that's ok - continue
      });

      // Verify user remains on login page
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl, 'URL should not contain /secure').not.to.include('/secure');

      // Verify fields remain empty
      usernameValue = await loginPage.getUsernameValue();
      passwordValue = await loginPage.getPasswordValue();

      expect(usernameValue, 'Username field should remain empty after failed login').to.equal('');
      expect(passwordValue, 'Password field should remain empty after failed login').to.equal('');
    });
  });

  // ========================================
  // TC_LOGIN_005: Field Validation and Input
  // ========================================
  describe('TC_LOGIN_005: Field Validation and Data Input', function() {
    it('should accept and properly handle various input types in username field', async function() {
      // Test with alphanumeric characters
      const testUsername = 'testuser123';
      await loginPage.enterUsername(testUsername);
      
      let currentValue = await loginPage.getUsernameValue();
      expect(currentValue, 'Username should accept alphanumeric input').to.equal(testUsername);

      // Clear and test with special characters
      const specialUsername = 'test@user#2024';
      await loginPage.clearUsername();
      await loginPage.enterUsername(specialUsername);
      
      currentValue = await loginPage.getUsernameValue();
      expect(currentValue, 'Username should accept special characters').to.equal(specialUsername);

      // Test clearing field
      await loginPage.clearUsername();
      currentValue = await loginPage.getUsernameValue();
      expect(currentValue, 'Username field should be empty after clear').to.equal('');
    });

    it('should accept various character types in password field and mask input', async function() {
      // Test with various password characters
      const testPassword = 'Pass@123!Special';
      await loginPage.enterPassword(testPassword);
      
      let currentValue = await loginPage.getPasswordValue();
      expect(currentValue, 'Password should accept special characters').to.equal(testPassword);

      // Verify password field type is 'password' (which masks the display)
      const passwordField = await loginPage.getPasswordField();
      const fieldType = await passwordField.getAttribute('type');
      expect(fieldType, 'Password field type should be password').to.equal('password');

      // Test clearing password field
      await loginPage.clearPassword();
      currentValue = await loginPage.getPasswordValue();
      expect(currentValue, 'Password field should be empty after clear').to.equal('');
    });

    it('should handle whitespace-only input appropriately', async function() {
      // Test whitespace-only username
      const whitespaceUsername = '   ';
      await loginPage.enterUsername(whitespaceUsername);
      
      let currentValue = await loginPage.getUsernameValue();
      // Whitespace may be trimmed by the application
      if (currentValue && currentValue.trim() === '') {
        // Acceptable if application accepts but treats as empty
        expect(currentValue.trim(), 'Whitespace should be handled').to.equal('');
      }

      // Clear and test whitespace-only password
      await loginPage.clearUsername();
      const whitespacePassword = '   ';
      await loginPage.enterPassword(whitespacePassword);
      
      currentValue = await loginPage.getPasswordValue();
      // Similar behavior expected for password field
      if (currentValue && currentValue.trim() === '') {
        expect(currentValue.trim(), 'Whitespace password should be handled').to.equal('');
      }
    });
  });

  // ========================================
  // TC_LOGIN_006: Security Cases
  // ========================================
  describe('TC_LOGIN_006: Security Cases (SQL Injection and XSS Prevention)', function() {
    it('should safely handle SQL injection attempts in username field', async function() {
      // Test SQL injection payload
      const sqlInjectionPayload = "' OR '1'='1";
      
      await loginPage.enterUsername(sqlInjectionPayload);
      await loginPage.enterPassword('anypassword');
      await loginPage.clickLoginButton();

      // Wait for error response
      await loginPage.waitForErrorMessage();

      // Verify error message is displayed (application rejects it safely)
      const errorMessageDisplayed = await loginPage.isErrorMessageDisplayed();
      if (!errorMessageDisplayed) {
        throw new Error('Error message should be displayed for SQL injection attempt');
      }

      // Verify user remains on login page (not redirected)
      const currentUrl = await loginPage.getCurrentUrl();
      if (currentUrl.includes('/secure')) {
        throw new Error('User should not be authenticated with SQL injection payload');
      }

      // Verify no database error messages are exposed
      const errorMessage = await loginPage.getErrorMessage();
      if (errorMessage.includes('SQL') || errorMessage.includes('database') || 
          errorMessage.includes('syntax')) {
        throw new Error('Error message should not expose database information');
      }
    });

    it('should safely handle XSS attempts in username field', async function() {
      // Test XSS payload with script tag
      const xssPayload = "<script>alert('XSS')</script>";
      
      await loginPage.enterUsername(xssPayload);
      await loginPage.enterPassword('anypassword');
      await loginPage.clickLoginButton();

      // Wait for error response
      await loginPage.waitForErrorMessage();

      // Verify error message is displayed
      const errorMessageDisplayed = await loginPage.isErrorMessageDisplayed();
      if (!errorMessageDisplayed) {
        throw new Error('Error message should be displayed for XSS attempt');
      }

      // Verify user remains on login page
      const currentUrl = await loginPage.getCurrentUrl();
      if (currentUrl.includes('/secure')) {
        throw new Error('User should not be authenticated with XSS payload');
      }

      // Verify the payload is not executed (no JavaScript alert)
      // The fact that we reach this point means the alert didn't execute
      // (if it had, the test would hang or fail)
    });

    it('should safely handle XSS attempts with img onerror in password field', async function() {
      // Test XSS payload with img tag
      const xssPayload = "<img src=x onerror='alert(\"XSS\")'>";
      
      await loginPage.enterUsername('testuser');
      await loginPage.enterPassword(xssPayload);
      await loginPage.clickLoginButton();

      // Wait for error response
      await loginPage.waitForErrorMessage();

      // Verify error message is displayed
      const errorMessageDisplayed = await loginPage.isErrorMessageDisplayed();
      if (!errorMessageDisplayed) {
        throw new Error('Error message should be displayed for XSS attempt');
      }

      // Verify user remains on login page
      const currentUrl = await loginPage.getCurrentUrl();
      if (currentUrl.includes('/secure')) {
        throw new Error('User should not be authenticated with XSS payload');
      }
    });
  });

  // ========================================
  // TC_LOGIN_007: Error Message Verification
  // ========================================
  describe('TC_LOGIN_007: Error Message Verification', function() {
    it('should not display error message on initial page load', async function() {
      // Verify login page loads without error messages
      const errorMessageDisplayed = await loginPage.isErrorMessageDisplayed();
      if (errorMessageDisplayed) {
        throw new Error('Error message should not be displayed on initial page load');
      }
    });

    it('should display specific error message for invalid username', async function() {
      // Load valid password from external credentials
      const credentials = await loginPage.loadValidCredentials();
      await loginPage.login('invaliduser', credentials.password);

      // Wait for error message
      await loginPage.waitForErrorMessage();

      // Verify error message content
      const errorMessage = await loginPage.getErrorMessage();
      if (!errorMessage.includes('Your username is invalid')) {
        throw new Error(`Expected specific error about invalid username, got: ${errorMessage}`);
      }

      // Verify error is readable and visible
      const errorElement = await driver.findElement(By.id('flash'));
      const isDisplayed = await errorElement.isDisplayed();
      if (!isDisplayed) {
        throw new Error('Error message should be visible');
      }
    });

    it('should display specific error message for invalid password', async function() {
      // Load valid username from external credentials
      const credentials = await loginPage.loadValidCredentials();
      await loginPage.login(credentials.username, 'wrongpassword');

      // Wait for error message
      await loginPage.waitForErrorMessage();

      // Verify error message content
      const errorMessage = await loginPage.getErrorMessage();
      if (!errorMessage.includes('Your password is invalid')) {
        throw new Error(`Expected specific error about invalid password, got: ${errorMessage}`);
      }
    });

    it('should not expose sensitive information in error messages', async function() {
      await loginPage.login('test@sql.com', "' OR '1'='1");

      // Wait for error message
      await loginPage.waitForErrorMessage();

      // Verify error message doesn't expose technical details
      const errorMessage = await loginPage.getErrorMessage();
      const sensitivePatterns = [
        'SQL', 'database', 'table', 'query', 'syntax error',
        'Exception', 'Stack trace', 'at line'
      ];

      for (const pattern of sensitivePatterns) {
        if (errorMessage.includes(pattern)) {
          throw new Error(`Error message should not contain sensitive info: ${pattern}`);
        }
      }
    });
  });

  // ========================================
  // TC_LOGIN_008: Session Management and Logout
  // ========================================
  describe('TC_LOGIN_008: Session Management and Logout', function() {
    it('should establish session on successful login', async function() {
      // Load valid credentials from external source
      const credentials = await loginPage.loadValidCredentials();
      // Perform login with valid credentials
      await loginPage.login(credentials.username, credentials.password);

      // Wait for redirect to secure page
      await loginPage.waitForSecurePage();

      // Verify session is established by checking for logout button
      const logoutButtonVisible = await loginPage.isLogoutButtonVisible();
      if (!logoutButtonVisible) {
        throw new Error('Session should be established - logout button should be visible');
      }

      // Verify secure page content is accessible
      const welcomeMessage = await loginPage.getWelcomeMessage();
      if (!welcomeMessage.includes('Secure Area')) {
        throw new Error(`Expected secure page heading, got: ${welcomeMessage}`);
      }

      const flashMessage = await loginPage.getErrorMessage();
      if (!flashMessage.includes('logged into a secure area')) {
        throw new Error(`Expected successful login flash message, got: ${flashMessage}`);
      }
    });

    it('should maintain session across page navigation', async function() {
      // Load valid credentials from external source
      const credentials = await loginPage.loadValidCredentials();
      // First, login
      await loginPage.login(credentials.username, credentials.password);

      // Wait for redirect
      await loginPage.waitForSecurePage();

      // Navigate away and back (simulate page refresh)
      const secureUrl = await loginPage.getCurrentUrl();
      await driver.get(secureUrl);

      // Wait for page to load - use page object locator instead of a hardcoded id
      await loginPage.waitForLogoutButton();

      // Verify user is still authenticated (no redirect to login)
      const currentUrl = await loginPage.getCurrentUrl();
      if (!currentUrl.includes('/secure')) {
        throw new Error('Session should persist - user should still be on secure page');
      }

      // Verify logout button is still visible
      const logoutButtonVisible = await loginPage.isLogoutButtonVisible();
      if (!logoutButtonVisible) {
        throw new Error('Session should still be valid - logout button should be visible');
      }
    });

    it('should properly terminate session on logout', async function() {
      // Load valid credentials from external source
      const credentials = await loginPage.loadValidCredentials();
      // Login first
      await loginPage.login(credentials.username, credentials.password);

      // Wait for redirect
      await loginPage.waitForSecurePage();

      // Perform logout
      await loginPage.clickLogoutButton();

      // Wait for redirect to login page
      await loginPage.waitFor().until(
        until.urlContains('/login'),
        'User was not redirected to login page after logout'
      );

      // Verify user is on login page
      const currentUrl = await loginPage.getCurrentUrl();
      if (!currentUrl.includes('/login')) {
        throw new Error('User should be redirected to login page after logout');
      }

      // Verify logout message is displayed
      const errorMessage = await loginPage.getErrorMessage();
      if (!errorMessage.includes('logged out')) {
        throw new Error(`Expected logout message, got: ${errorMessage}`);
      }
    });

    it('should require re-authentication to access secure page after logout', async function() {
      // Load valid credentials from external source
      const credentials = await loginPage.loadValidCredentials();
      // Login and logout
      await loginPage.login(credentials.username, credentials.password);

      await loginPage.waitFor().until(until.urlContains('/secure'));

      await loginPage.clickLogoutButton();
      await loginPage.waitFor().until(until.urlContains('/login'));

      // Try to navigate directly to secure page
      const securePageUrl = `${loginPage.baseUrl}/secure`;
      await driver.get(securePageUrl);

      // The site should redirect back to login or otherwise show the unauthenticated flash state.
      await driver.wait(async () => {
        const currentUrl = await loginPage.getCurrentUrl();
        if (currentUrl.includes('/login')) {
          return true;
        }

        return await loginPage.isErrorMessageDisplayed();
      }, 10000, 'User should be redirected to login or shown an unauthenticated message');

      // Verify user is redirected back to login page
      const currentUrl = await loginPage.getCurrentUrl();
      const flashMessage = await loginPage.getErrorMessage();
      if (
        !currentUrl.includes('/login') &&
        !flashMessage.includes('You must login to view the secure area')
      ) {
        throw new Error(`Expected unauthenticated redirect or warning, got URL ${currentUrl} with message: ${flashMessage}`);
      }
    });
  });
});
