# Test Cases Index - Heroku Login Feature

## Overview
This document provides an index of all test cases for the Heroku application login feature.

## Test Cases

### TC_LOGIN_001: Successful Login with Valid Credentials
- **File**: [TC_LOGIN_001_SuccessfulLogin.md](TC_LOGIN_001_SuccessfulLogin.md)
- **Status**: Documented
- **Priority**: High
- **Type**: Functional, Happy Path
- **Description**: Verify that a user can successfully log in with valid username and password
- **Credentials**: tomsmith / SuperSecretPassword!
- **Expected Result**: User is redirected to /secure page, logout button visible, welcome message displayed

### TC_LOGIN_002: Login with Invalid Username
- **File**: [TC_LOGIN_002_InvalidUsername.md](TC_LOGIN_002_InvalidUsername.md)
- **Status**: Documented
- **Priority**: High
- **Type**: Functional, Negative
- **Description**: Verify that the system rejects invalid username and displays appropriate error
- **Test Data**: invaliduser / SuperSecretPassword!
- **Expected Result**: Error message "Your username is invalid!", user remains on login page, username field retains value, password field cleared

### TC_LOGIN_003: Login with Invalid Password
- **File**: [TC_LOGIN_003_InvalidPassword.md](TC_LOGIN_003_InvalidPassword.md)
- **Status**: Documented
- **Priority**: High
- **Type**: Functional, Negative
- **Description**: Verify that the system rejects invalid password and displays appropriate error
- **Test Data**: tomsmith / wrongpassword
- **Expected Result**: Error message "Your password is invalid!", user remains on login page, password field cleared for security

### TC_LOGIN_004: Login with Empty Fields
- **File**: [TC_LOGIN_004_EmptyFields.md](TC_LOGIN_004_EmptyFields.md)
- **Status**: Documented
- **Priority**: High
- **Type**: Functional, Negative, Validation
- **Description**: Verify that the system prevents login with empty username and password fields
- **Test Data**: Empty username and password
- **Expected Result**: Login is prevented, user remains on login page, fields remain empty

### TC_LOGIN_005: Field Validation and Data Input
- **File**: [TC_LOGIN_005_FieldValidation.md](TC_LOGIN_005_FieldValidation.md)
- **Status**: Documented
- **Priority**: Medium
- **Type**: Functional, Validation
- **Description**: Verify that username and password fields accept input correctly and validate various scenarios
- **Test Scenarios**:
  - Accept alphanumeric characters
  - Accept special characters
  - Mask password input
  - Clear fields properly
  - Handle whitespace appropriately
- **Expected Result**: Fields accept valid input, password is masked, fields can be cleared, whitespace handled appropriately

### TC_LOGIN_006: Security Cases (SQL Injection and XSS Prevention)
- **File**: [TC_LOGIN_006_SecurityCases.md](TC_LOGIN_006_SecurityCases.md)
- **Status**: Documented
- **Priority**: Critical
- **Type**: Security, Negative
- **Description**: Verify that the login form is protected against SQL injection and XSS attacks
- **Test Scenarios**:
  - SQL Injection: "' OR '1'='1"
  - SQL Injection: "admin'--"
  - XSS: <script>alert('XSS')</script>
  - XSS: <img src=x onerror='alert("XSS")'>
- **Expected Result**: All payloads rejected safely, no database information exposed, no JavaScript execution

### TC_LOGIN_007: Error Message Verification
- **File**: [TC_LOGIN_007_ErrorMessages.md](TC_LOGIN_007_ErrorMessages.md)
- **Status**: Documented
- **Priority**: High
- **Type**: Functional, UI/UX
- **Description**: Verify that error messages are displayed correctly, contain appropriate information, and are readable
- **Test Scenarios**:
  - No error on initial page load
  - Specific error for invalid username
  - Specific error for invalid password
  - No sensitive information exposed
  - Consistent styling
- **Expected Result**: Error messages are appropriate, visible, readable, and don't expose technical details

### TC_LOGIN_008: Session Management and Logout
- **File**: [TC_LOGIN_008_SessionManagement.md](TC_LOGIN_008_SessionManagement.md)
- **Status**: Documented
- **Priority**: High
- **Type**: Functional, Integration
- **Description**: Verify that sessions are properly created and terminated, and users cannot access protected pages without authentication
- **Test Scenarios**:
  - Session established on successful login
  - Session persists across page navigation
  - Session terminated on logout
  - Re-authentication required after logout
- **Expected Result**: Sessions properly managed, user redirected to login when accessing secure page without auth

## Test Execution

### Run All Login Tests
```bash
npm test
# or
npm run test:login
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Data

Test data is provided in CSV format: [login_test_data.csv](../../qa/test-data/herokuapp-selenium-tests/login_test_data.csv)

The CSV contains:
- TestCaseID: Unique identifier for each test
- Scenario: Description of the test scenario
- Username: Username to use in test
- Password: Password to use in test
- ExpectedError: Expected error message (if any)
- ExpectedURL: Expected URL after action
- ExpectedMessage: Expected message on page
- TestType: Type of test (Happy Path, Negative, Security, Validation, Integration)

## Implementation Details

### Page Object Model
All tests use the LoginPage page object model defined in [loginPage.js](../../herokuapp-selenium-tests/src/pages/loginPage.js)

### Test Framework
- **Testing Framework**: Mocha
- **Assertions**: Native throw statements with descriptive error messages
- **WebDriver**: Selenium WebDriver 4.x
- **Browser**: Chrome (configured in test setup)

### Best Practices Implemented
- Page Object Model pattern for maintainability
- Explicit waits instead of implicit waits
- Stable locators (id, name, CSS selectors)
- Comprehensive error messages
- Proper setup and teardown
- Test data loading from CSV
- Clear test organization by feature

## Coverage Summary

| Category | Count |
|----------|-------|
| Happy Path Tests | 1 |
| Negative Tests | 3 |
| Validation Tests | 2 |
| Security Tests | 3 |
| Integration Tests | 4 |
| **Total** | **13** |

## Notes

- All tests are designed to be independent and can run in any order
- Each test navigates to the login page before execution (beforeEach hook)
- Tests use explicit waits with 10-second timeout for page navigation
- Password field is verified to be type="password" for security
- Error messages are checked for sensitive information exposure
- Session management tests include logout and re-authentication scenarios
