# Test Data Documentation - Heroku Login Tests

## Overview
This folder contains test data files for the Heroku application login feature tests. Data is provided in CSV format for easy integration with data-driven testing.

## Files

### login_test_data.csv
Main test data file containing all test scenarios and data for login tests.

#### CSV Structure

**Headers:**
- `TestCaseID`: Unique identifier linking to test case file (e.g., TC_LOGIN_001)
- `Scenario`: Human-readable description of the test scenario
- `Username`: Username value to use in the test
- `Password`: Password value to use in the test
- `ExpectedError`: Expected error message (empty if no error expected)
- `ExpectedURL`: Expected URL after test action
- `ExpectedMessage`: Expected message displayed on the page
- `TestType`: Category of test (Happy Path, Negative, Security, Validation, Integration)

#### Test Data Rows

| TestCaseID | Scenario | Username | Password | ExpectedError | ExpectedURL | ExpectedMessage | TestType |
|---|---|---|---|---|---|---|---|
| TC_LOGIN_001 | Valid Credentials | tomsmith | SuperSecretPassword! | (empty) | /secure | Welcome to the Secure Area | Happy Path |
| TC_LOGIN_002 | Invalid Username | invaliduser | SuperSecretPassword! | Your username is invalid! | /login | (empty) | Negative |
| TC_LOGIN_003 | Invalid Password | tomsmith | wrongpassword | Your password is invalid! | /login | (empty) | Negative |
| TC_LOGIN_004 | Empty Username | (empty) | SuperSecretPassword! | (empty) | /login | (empty) | Negative |
| TC_LOGIN_005 | Empty Password | tomsmith | (empty) | (empty) | /login | (empty) | Negative |
| TC_LOGIN_006a | SQL Injection - Single Quote OR | '' OR '1''='1 | '' OR '1''='1 | Your username is invalid! | /login | (empty) | Security |
| TC_LOGIN_006b | SQL Injection - Comment | admin'-- | password123 | Your username is invalid! | /login | (empty) | Security |
| TC_LOGIN_006c | XSS - Script Tag | <script>alert('XSS')</script> | password123 | Your username is invalid! | /login | (empty) | Security |
| TC_LOGIN_006d | XSS - Img Onerror | <img src=x onerror='alert("XSS")'> | password123 | Your username is invalid! | /login | (empty) | Security |
| TC_LOGIN_007a | Error Message - Invalid Username | baduser | SuperSecretPassword! | Your username is invalid! | /login | (empty) | Validation |
| TC_LOGIN_007b | Error Message - Invalid Password | tomsmith | badpass | Your password is invalid! | /login | (empty) | Validation |
| TC_LOGIN_008 | Session Management - Logout | tomsmith | SuperSecretPassword! | (empty) | /secure | Welcome to the Secure Area | Integration |

## Data Usage in Tests

### CSV Loading
The test framework automatically loads CSV data during the `before` hook:

```javascript
async function loadTestData() {
  const csvPath = path.join(__dirname, '../../qa/test-data/herokuapp-selenium-tests/login_test_data.csv');
  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    // Parse CSV and create test case objects
  }
}
```

### Accessing Test Data in Tests
Test data can be accessed via the loaded `testData` array:

```javascript
// Data is available in tests for parameterized testing
testData.forEach(data => {
  // Use data.Username, data.Password, etc.
});
```

## Valid Test Credentials

### Standard Valid Credentials
- **Username**: tomsmith
- **Password**: SuperSecretPassword!
- **Expected Result**: Successful login to /secure page

### Invalid Test Credentials
- **Username**: invaliduser
- **Password**: wrongpassword
- **Expected Result**: Login fails with error message

## Security Test Payloads

### SQL Injection Payloads
1. `' OR '1'='1` - Classic SQL injection
2. `admin'--` - Comment-based SQL injection
3. `" OR "1"="1` - Variant with double quotes

### XSS Payloads
1. `<script>alert('XSS')</script>` - Basic script injection
2. `<img src=x onerror='alert("XSS")'>` - Event handler injection
3. `javascript:alert('XSS')` - Protocol-based injection
4. `<svg onload=alert('XSS')>` - SVG-based injection

**Note**: These payloads are used to verify that the application properly sanitizes and rejects malicious input without exposing sensitive information.

## Test Data Variations

### By Test Type

**Happy Path (1 test)**
- Valid credentials that successfully authenticate user

**Negative Tests (3 tests)**
- Invalid username with valid password
- Valid username with invalid password
- Empty username and password fields

**Security Tests (4 tests)**
- SQL injection in username field (2 variations)
- XSS in username field (2 variations)

**Validation Tests (2 tests)**
- Error message for invalid username
- Error message for invalid password

**Integration Tests (1 test)**
- Session management with logout

## Adding New Test Data

To add new test data rows:

1. Add a new row to `login_test_data.csv`
2. Ensure all required columns are filled
3. Use appropriate TestCaseID linking to test case file
4. Update this documentation file
5. Update test case file if needed

### Example New Row:
```csv
TC_LOGIN_009,Unicode Characters,tomsmith,pässwörd,,,Welcome to the Secure Area,Validation
```

## Notes

- **Empty Values**: Represented by empty strings between commas (e.g., `,,` means field is empty)
- **Special Characters**: Characters like quotes are escaped in CSV format
- **Whitespace**: Leading/trailing spaces in values are preserved
- **Character Encoding**: CSV file uses UTF-8 encoding for international character support

## Integration with Test Framework

The test framework uses Node.js native `fs` module to read and parse CSV data:

```javascript
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  const testCase = {};
  
  for (let j = 0; j < headers.length; j++) {
    testCase[headers[j].trim()] = values[j] ? values[j].trim() : '';
  }
  
  testData.push(testCase);
}
```

This allows direct access to test data within test cases for parameterized testing scenarios.
