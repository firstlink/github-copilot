# TC_LOGIN_002: Login with Invalid Username

## Test ID
TC_LOGIN_002

## Test Title
Login Failure with Invalid Username

## Description
Verify that the system properly rejects login attempts with an invalid username and displays an appropriate error message.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login
- Invalid username is available in test data

## Test Steps
1. Verify the login page is displayed
2. Enter invalid username in the username field
3. Enter valid password "SuperSecretPassword!" in the password field
4. Click the Login button
5. Wait for error message to appear
6. Verify error message is displayed
7. Verify user remains on the login page (not redirected)
8. Verify username field still contains the entered invalid username
9. Verify password field is cleared for security

## Expected Results
- Login page loads successfully
- Invalid username is entered without errors
- Login button click triggers validation
- Error message is displayed indicating invalid username
- Error message contains relevant information
- User remains on login page (URL unchanged)
- Username field retains entered value
- Password field is cleared
- Login attempt is rejected

## Test Data
- Username: invaliduser
- Password: SuperSecretPassword!
- Expected Error: "Your username is invalid!"

## Priority
High

## Test Type
Functional, Negative

## Category
Authentication, Input Validation
