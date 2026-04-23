# TC_LOGIN_004: Login with Empty Fields

## Test ID
TC_LOGIN_004

## Test Title
Login Attempt with Empty Username and Password Fields

## Description
Verify that the system validates empty fields and prevents login when both username and password fields are empty.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login

## Test Steps
1. Verify the login page is displayed
2. Verify username field is empty
3. Verify password field is empty
4. Click the Login button without entering any data
5. Wait for validation response
6. Verify appropriate error message is displayed
7. Verify user remains on the login page
8. Verify both fields remain empty

## Expected Results
- Login page loads successfully
- Both username and password fields are empty
- Login button is clickable
- Validation occurs and prevents login
- Error message is displayed (either in-line validation or general error)
- User remains on login page (URL unchanged)
- Fields maintain their empty state
- Login attempt is rejected

## Test Data
- Username: (empty)
- Password: (empty)

## Priority
High

## Test Type
Functional, Negative, Validation

## Category
Input Validation, Edge Cases
