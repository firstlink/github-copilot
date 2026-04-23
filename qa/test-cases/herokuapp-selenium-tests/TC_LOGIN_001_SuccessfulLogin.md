# TC_LOGIN_001: Successful Login with Valid Credentials

## Test ID
TC_LOGIN_001

## Test Title
Successful Login with Valid Credentials

## Description
Verify that a user can successfully log in to the application with valid username and password credentials.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login
- User has valid credentials

## Test Steps
1. Verify the login page is displayed
2. Enter valid username "tomsmith" in the username field
3. Enter valid password "SuperSecretPassword!" in the password field
4. Click the Login button
5. Wait for page redirection
6. Verify successful login by checking the secure page is displayed
7. Verify welcome message appears indicating successful login
8. Verify logout button is visible on the secure page

## Expected Results
- Login page loads successfully with all elements visible
- Username is entered without errors
- Password is entered without errors
- Login button is clickable and responsive
- User is redirected to the secure page URL (/secure)
- Welcome message displays: "Welcome to the Secure Area"
- Logout button is visible and clickable
- Session is established (user is authenticated)

## Test Data
- Username: tomsmith
- Password: SuperSecretPassword!

## Priority
High

## Test Type
Functional, Happy Path

## Category
Authentication
