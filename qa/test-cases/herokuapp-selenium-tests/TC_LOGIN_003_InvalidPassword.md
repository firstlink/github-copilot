# TC_LOGIN_003: Login with Invalid Password

## Test ID
TC_LOGIN_003

## Test Title
Login Failure with Invalid Password

## Description
Verify that the system properly rejects login attempts with an invalid password and displays an appropriate error message.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login
- Valid username is used with incorrect password

## Test Steps
1. Verify the login page is displayed
2. Enter valid username "tomsmith" in the username field
3. Enter invalid password in the password field
4. Click the Login button
5. Wait for error message to appear
6. Verify error message is displayed
7. Verify user remains on the login page (not redirected)
8. Verify username field still contains the entered username
9. Verify password field is cleared for security

## Expected Results
- Login page loads successfully
- Valid username is entered without errors
- Invalid password is entered without errors
- Login button click triggers validation
- Error message is displayed indicating invalid password
- Error message contains relevant information
- User remains on login page (URL unchanged)
- Username field retains entered value
- Password field is cleared
- Login attempt is rejected

## Test Data
- Username: tomsmith
- Password: wrongpassword
- Expected Error: "Your password is invalid!"

## Priority
High

## Test Type
Functional, Negative

## Category
Authentication, Input Validation
