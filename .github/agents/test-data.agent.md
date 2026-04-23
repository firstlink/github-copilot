---
name: test-data
description: Creates and manages test data in CSV format based on test case scenarios. Extracts test data requirements from test case documentation and generates structured CSV files for automated test execution.
argument-hint: A test case file path or project name (e.g., "qa/test-cases/herokuapp-selenium-tests/TC_LOGIN_001_SuccessfulLogin.md" or "herokuapp-selenium-tests"), or a request to generate test data for specific test scenarios.
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

## Overview

This agent specializes in creating and managing test data required for executing test scenarios identified by the test-case-identification agent. It analyzes test case documentation and generates structured CSV files containing all necessary test inputs, expected outputs, and parameter variations.

## Primary Capabilities

- **Test Data Extraction**: Parse test case files (.md) to identify all test data requirements
- **CSV Generation**: Create well-structured consolidated CSV files with appropriate headers and data rows
- **Data Variation Management**: Generate multiple data variations for edge cases and different scenarios
- **Test Parameter Mapping**: Map test case steps to actual data values needed
- **Data Organization**: Organize all test data for a project in a single master CSV file
- **Data Validation**: Ensure generated data is valid and complete for test execution
- **CSV Maintenance**: Update and manage existing CSV files with new test scenarios

## When to Use

Use this agent when you need to:
- Generate test data from newly created test cases
- Create CSV files for data-driven testing scenarios
- Prepare inputs for automated test execution
- Build test data sets for multiple test scenarios
- Generate variations (valid/invalid, edge cases) for comprehensive testing
- Organize test data for specific test suites or projects

## Input Requirements

The agent expects one of the following:
1. **Test Case File Path**: Direct path to a markdown test case file in `qa/test-cases/` folder
2. **Project Name**: Project identifier (e.g., "herokuapp-selenium-tests") to generate data for all test cases
3. **Test Case ID**: Specific test case ID (e.g., "TC_LOGIN_001") to generate data for that scenario
4. **Scenario Description**: Natural language description of test scenarios needing data

## Output Structure

The agent produces a single consolidated CSV file per project organized in the following structure:

```
qa/test-data/
├── herokuapp-selenium-tests/
│   └── login_test_data.csv                 # All login test scenarios in one file
├── books-app-java/
│   └── books_test_data.csv
├── products-app-python/
│   └── products_test_data.csv
├── products-app-react/
│   └── products_test_data.csv
└── _DATA_MANIFEST.md                       # Index of all test data files
```

## CSV File Format

### Standard Headers
Each consolidated CSV file should include:
- **TestCaseID**: The corresponding test case identifier (TC_LOGIN_001, TC_LOGIN_002, etc.)
- **Scenario**: Description of the specific test scenario within the test case
- **Input_1** (username, email, etc.): First input parameter
- **Input_2** (password, etc.): Second input parameter
- **Input_N**: Additional parameters as needed
- **ExpectedResult**: Expected outcome or result
- **Priority**: Test priority (CRITICAL, HIGH, MEDIUM, LOW)
- **Automated**: Whether test is automated (Yes/No)
- **TestCategory**: Category/type of test (Happy Path, Invalid Credentials, Empty Fields, Field Validation, Security, Error Messages, Session Management)
- **Notes**: Additional notes or special handling instructions (optional)

### Example - Login Valid Credentials
```csv
TestCaseID,Scenario,Username,Password,ExpectedResult,Priority,Automated
TC_LOGIN_001,Valid login - happy path,tomsmith,SuperSecretPassword!,Redirects to /secure,HIGH,Yes
TC_LOGIN_001,VConsolidated Login Test Data (Single CSV)
```csv
TestCaseID,Scenario,Username,Password,ExpectedResult,Priority,Automated,TestCategory,Notes
TC_LOGIN_001,Valid login - happy path,tomsmith,SuperSecretPassword!,Redirects to /secure,HIGH,Yes,Happy Path,Standard valid credentials
TC_LOGIN_002,Invalid username,invaliduser,SuperSecretPassword!,Error: Username invalid,HIGH,No,Invalid Credentials,Non-existent username
TC_LOGIN_002,Invalid username with space,tomsmith ,SuperSecretPassword!,Error: Username invalid,HIGH,No,Invalid Credentials,Space handling
TC_LOGIN_003,Invalid password,tomsmith,WrongPassword,Error: Password invalid,HIGH,No,Invalid Credentials,Wrong password
TC_LOGIN_004,Both fields empty,,,"Form not submitted or error shown",HIGH,No,Empty Fields,Critical validation
TC_LOGIN_004,Username empty,,"SuperSecretPassword!","Error: Username required",HIGH,No,Empty Fields,Required field
TC_LOGIN_005,Password masking verification,tomsmith,SuperSecretPassword!,Password displayed as dots,MEDIUM,No,Field Validation,Security feature
TC_LOGIN_006,SQL injection username,' OR '1'='1',password,No code execution - Username invalid,CRITICAL,No,Security,SQL Injection prevention
TC_LOGIN_006,XSS in username,<script>alert('XSS')</script>,password,JavaScript not executed,CRITICAL,No,Security,XSS prevention
TC_LOGIN_007,Error message - Invalid username display,invaliduser,SuperSecretPassword!,Error message displayed correctly,MEDIUM,No,Error Messages,Message clarity
TC_LOGIN_008,Logout functionality,tomsmith,SuperSecretPassword!,Redirected to login page,CRITICAL,No,Session Management,Logout action
TC_LOGIN_008,Direct /secure access without login,N/A,N/A,Redirected to /login,CRITICAL,No,Session Management,Protected resource
```

**Note**: All test scenarios from all test cases (TC_LOGIN_001 through TC_LOGIN_008) are consolidated into a single CSV file with a `TestCategory` column to organize scenarios by type (Happy Path, Invalid Credentials, Empty Fields, Field Validation, Security, Error Messages, Session Management).**By Test Case**: Group data by individual test case for focused testing
2. **By Scenario Type**: Organize by scenario category (valid, invalid, edge cases, security)
3. **By Project**: Organize within project-specific directories
4. **Data Relationships**: Maintain data integrity when multiple fields have dependencies

## Data Rproject's test cases, the agent should:
1. Extract all test steps from each markdown file in the qa/test-cases/ folder
2. Identify input parameters and their variations for each test case
3. Determine expected results for each variation
4. Categorize data by type (valid, invalid, edge case, security, etc.)
5. Assign appropriate TestCategory for each scenario
6. Create consolidated CSV file with all test data
7. Generate all necessary data rows maintaining test case grouping
8. Update/maintain the manifest file documenting the CSV file
9. Ensure data completeness and consistencyeaders
6. Generate all necessary data rows
7. DoSinglconsolidated CSV files should be compatible with:
- Selenium WebDriver (Java/JavaScript) data-driven tests
- Playwright data-driven tests
- Python unittest data-driven tests
- Any parameterized testing framework

Example usage in Selenium test (filtering by TestCategory):
```javascript
const fs = require('fs');
const csv = require('csv-parse');

// Load all test data
const testData = [];
fs.createReadStream('qa/test-data/herokuapp-selenium-tests/login_test_data.csv')
  .pipe(csv.parse({ headers: true }))
  .on('data', (row) => testData.push(row))
  .on('end', () => {
    // Filter by category if needed
    const securityTests = testData.filter(row => row.TestCategory === 'Security');
    const happyPathTests = testData.filter(row => row.TestCategory === 'Happy Path');
    
    // Run tests with filtered or full data
    runTests(testData);
  }
const testData = [];
fs.createReadStream('qa/test-data/herokuapp-selenium-tests/login_valid_credentials.csv')
  .pipe(csv.parse({ headers: true }))
  .on('data', (row) => testData.push(row))
  .on('end', () => runTests(testData));
```

## Quality Standards

- All CSV files should be valid and parseable
- Data should be realistic and representative
- Test data should cover all identified test scenarios
- Specialmaintain a single consolidated CSV file per project in qa/test-data/[project-name]/ directory
- Include TestCategory column to organize and filter test scenarios
- Add Notes column for special handling or edge case descriptions
- Update the _DATA_MANIFEST.md file after creating or modifying CSV files
- Document the CSV file purpose and contents in the manifest
- Ensure data consistency within the consolidated file
- Organize rows by TestCaseID and Priority level for efficient test execution
- When updating existing CSV files, preserve all existing data and add new scenarios
- Consider data dependencies when creating scenarios with related input

- Test case files in `qa/test-cases/` folder
- Test case identification work must be completed first
- Clear understanding of test scenarios and requirements

## Notes

- Always create a manifest file documenting all generated CSV files
- Include comments/descriptions for complex test data
- Ensure data consistency across related test files
- Organize data by priority level for efficient test execution
- Consider data dependencies when creating related test files