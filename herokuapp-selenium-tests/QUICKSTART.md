# Quick Start Guide - Login Test Suite

## 5-Minute Setup & Execution

### 1. Install Dependencies (1 minute)

```bash
cd herokuapp-selenium-tests
npm install
```

### 2. Run Tests (2 minutes)

```bash
# Run all login tests
npm run test:login

# Or run all tests
npm test
```

### 3. View Results (2 minutes)

You'll see output like:

```
Login Feature Tests
  TC_LOGIN_001: Successful Login
    ✓ should successfully log in with valid credentials (2.3s)
  
  TC_LOGIN_002: Login with Invalid Username
    ✓ should reject login with invalid username (1.8s)
  
  ... (more tests)
  
19 passing (45s)
```

## Test Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Successful Login | 1 | ✓ |
| Invalid Username | 1 | ✓ |
| Invalid Password | 1 | ✓ |
| Empty Fields | 1 | ✓ |
| Field Validation | 3 | ✓ |
| Security (SQL/XSS) | 3 | ✓ |
| Error Messages | 4 | ✓ |
| Session & Logout | 4 | ✓ |
| **TOTAL** | **19** | **✓** |

## Test Data

Valid test credentials:
- **Username**: tomsmith
- **Password**: SuperSecretPassword!

Additional test scenarios included for:
- Invalid credentials
- Empty fields
- Security attacks (SQL injection, XSS)
- Error message verification
- Session management

## Key Test Files

### Test Specifications
- [qa/test-cases/herokuapp-selenium-tests/](qa/test-cases/herokuapp-selenium-tests/) - 8 test case documents

### Test Implementation
- [src/tests/loginTest.js](src/tests/loginTest.js) - 19 test cases
- [src/pages/loginPage.js](src/pages/loginPage.js) - Page object model

### Test Data
- [qa/test-data/herokuapp-selenium-tests/login_test_data.csv](qa/test-data/herokuapp-selenium-tests/login_test_data.csv) - Test scenarios

## Documentation

- [TESTING.md](TESTING.md) - Complete testing guide (500+ lines)
- [qa/test-cases/herokuapp-selenium-tests/_INDEX.md](qa/test-cases/herokuapp-selenium-tests/_INDEX.md) - Test case summary
- [qa/test-data/herokuapp-selenium-tests/README.md](qa/test-data/herokuapp-selenium-tests/README.md) - Test data reference

## Common Commands

```bash
# Run all login tests
npm run test:login

# Run specific test
npx mocha src/tests/loginTest.js --grep "TC_LOGIN_001"

# Run with watch mode (auto-rerun on changes)
npm run test:watch

# Run with longer timeout (for slow systems)
npx mocha src/tests/loginTest.js --timeout 120000
```

## What Gets Tested

✓ **Successful Login** - User can log in with valid credentials
✓ **Invalid Credentials** - System rejects invalid username/password
✓ **Empty Fields** - Form prevents submission with empty fields
✓ **Field Behavior** - Fields accept input, mask password, handle special characters
✓ **Security** - SQL injection and XSS attempts are safely handled
✓ **Error Messages** - Clear, appropriate error messages without technical leaks
✓ **Session Management** - Sessions created, maintained, and properly terminated
✓ **Logout** - Users can log out and session is cleared

## Architecture

### Page Object Model
All page interactions are encapsulated in `LoginPage` class with 20+ methods:
- Navigation methods
- Form interaction methods
- Field verification methods
- Session/authentication methods
- Error handling methods

### Test Framework
- **Framework**: Mocha (mocha.js.org)
- **WebDriver**: Selenium WebDriver 4.x
- **Assertions**: Native JavaScript with descriptive errors
- **Test Data**: CSV format for easy management

### Best Practices
✓ Explicit waits (no sleep)
✓ Stable locators (id > css > xpath)
✓ Independent tests
✓ Clear test names
✓ Comprehensive error messages
✓ Proper setup/teardown
✓ Security testing included

## Next Steps

1. **Run Tests**: Execute `npm run test:login`
2. **Review Results**: Check test output for pass/fail
3. **Explore Tests**: Look at [src/tests/loginTest.js](src/tests/loginTest.js)
4. **Add Tests**: Use test specifications as template
5. **Integrate**: Add to CI/CD pipeline

## System Requirements

- Node.js 14+ 
- npm 6+
- Chrome browser (latest)
- 100MB disk space for dependencies

## Troubleshooting

**Q: Tests hang or timeout?**
A: Increase timeout or check Chrome/ChromeDriver versions

**Q: ChromeDriver not found?**
A: Selenium WebDriver automatically downloads it

**Q: Tests fail on first run?**
A: Wait for npm install to complete, check internet connection

## Support

See [TESTING.md](TESTING.md) for:
- Detailed test descriptions
- Debugging guidelines
- CI/CD integration examples
- Performance optimization tips
- Complete API documentation
