# Herokuapp Playwright Tests

A minimal, teachable Playwright + TypeScript test automation project targeting [The Internet](https://the-internet.herokuapp.com).

## Project Structure

```
herokuapp-playwright-tests/
├── tests/              # Test specifications
├── pages/              # Page Object Model classes
├── test-data/          # Test input data
├── playwright.config.ts # Playwright configuration
├── package.json        # npm dependencies
└── tsconfig.json       # TypeScript configuration
```

## Setup

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests in headed mode (browser visible):
```bash
npm run test:headed
```

Debug tests:
```bash
npm run test:debug
```

## Test Credentials

Valid credentials for login testing:
- **Username**: `tomsmith`
- **Password**: `SuperSecretPassword!`

## Configuration

### Playwright Config (`playwright.config.ts`)

- **baseURL**: `https://the-internet.herokuapp.com`
- **Reporters**: HTML report (auto-generated in `playwright-report/`)
- **Screenshots**: Captured only on test failure
- **Videos**: Captured only on test failure
- **Browsers**: Chromium, Firefox, WebKit

### Test Data (`test-data/`)

- `loginTestData.ts` - Contains valid and invalid login credentials

## Pages

### LoginPage (`pages/LoginPage.ts`)

Page Object for the login page with the following methods:

- `goto()` - Navigate to the login page
- `login(username, password)` - Fill credentials and submit the form
- `getSuccessMessage()` - Get the success message after successful login
- `getErrorMessage()` - Get the error message after failed login

All locators use Playwright-native selectors:
- `getByLabel()` - For form inputs (username, password)
- `getByRole()` - For buttons
- `getByText()` - For messages

## Tests

### login.spec.ts

Two test cases:

1. **Valid Login** - Tests successful login with correct credentials
   - Logs in with `tomsmith` / `SuperSecretPassword!`
   - Verifies success message is displayed

2. **Invalid Login** - Tests login failure with incorrect credentials
   - Logs in with invalid credentials
   - Verifies error message is displayed

## Key Features

- ✅ Page Object Model for maintainability
- ✅ Playwright-native locators (getByRole, getByLabel, getByText)
- ✅ HTML reporting with screenshots/videos on failure
- ✅ TypeScript for type safety
- ✅ Minimal, readable code with teaching comments
- ✅ Separated test data for easy management

## Troubleshooting

### Tests failing due to network issues
- Check your internet connection
- Verify `https://the-internet.herokuapp.com` is accessible

### Locators not found
- Run with `--debug` flag to inspect element locators
- Use Playwright Inspector: `npm run test:debug`

## Further Reading

- [Playwright Documentation](https://playwright.dev)
- [The Internet - Test Application](https://the-internet.herokuapp.com)
