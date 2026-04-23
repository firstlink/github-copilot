# TC_LOGIN_008: Session Management and Logout

## Test ID
TC_LOGIN_008

## Test Title
Session Management, Logout, and Session Termination

## Description
Verify that sessions are properly created upon successful login and properly terminated upon logout. Verify that users cannot access protected pages without authentication.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login

## Test Steps
1. Verify login page is displayed
2. Enter valid credentials (tomsmith / SuperSecretPassword!)
3. Click Login button
4. Verify user is redirected to secure page (/secure)
5. Verify session is established (logout button visible)
6. Verify secure page content is accessible
7. Open new tab/window and navigate to secure page directly
8. Verify user is still authenticated (no redirect to login)
9. Return to original tab
10. Click Logout button
11. Verify user is redirected to login page
12. Verify logout message is displayed ("You logged out of the secure area!")
13. Attempt to navigate to secure page URL directly
14. Verify user is redirected back to login page
15. Verify session is completely terminated

## Expected Results
- Login page is accessible and displays properly
- Valid credentials are accepted
- User is redirected to /secure page after successful login
- Logout button is visible on secure page
- Secure page content displays "Welcome to the Secure Area"
- Session persists across new tabs/windows (same browser)
- User can navigate secure pages without re-authentication
- Logout button is clickable and functional
- User is redirected to login page after logout
- Logout confirmation message is displayed
- Secure page redirects to login when accessed without authentication
- Session cookie is cleared after logout
- Attempting to access secure page via URL requires re-authentication
- Session timeout works as expected

## Test Data
- Valid Username: tomsmith
- Valid Password: SuperSecretPassword!
- Secure Page URL: https://the-internet.herokuapp.com/secure
- Login Page URL: https://the-internet.herokuapp.com/login
- Expected Logout Message: "You logged out of the secure area!"

## Priority
High

## Test Type
Functional, Integration

## Category
Session Management, Authentication
