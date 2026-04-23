# TC_LOGIN_006: Security Cases (SQL Injection, XSS Prevention)

## Test ID
TC_LOGIN_006

## Test Title
Login Security Testing - SQL Injection and XSS Prevention

## Description
Verify that the login form is protected against common security attacks including SQL injection and cross-site scripting (XSS) attacks.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login

## Test Steps
1. Verify login page is displayed
2. Enter SQL injection payload in username field
3. Enter SQL injection payload in password field
4. Click Login button
5. Verify SQL injection is not executed (safe error message shown)
6. Verify user remains on login page
7. Clear fields
8. Enter XSS payload in username field
9. Enter valid password in password field
10. Click Login button
11. Verify XSS payload is not executed as script
12. Verify payload is treated as literal text or safely escaped
13. Verify no JavaScript alert boxes appear
14. Verify user remains on login page

## Expected Results
- Login page loads without security vulnerabilities
- SQL injection attempts are rejected safely
- Error message displayed is generic (not revealing database structure)
- XSS payloads are not executed
- Malicious scripts do not run in the browser
- No alert boxes triggered by injected XSS code
- Payloads are treated as harmless text input
- Application remains stable after security test attempts
- User remains authenticated if already logged in
- Session is not affected by security test attempts

## Test Data
- SQL Injection Username: "' OR '1'='1"
- SQL Injection Password: "' OR '1'='1"
- XSS Username: "<script>alert('XSS')</script>"
- XSS Password: "<img src=x onerror='alert(\"XSS\")'>"
- Alternative XSS: "javascript:alert('XSS')"

## Priority
Critical

## Test Type
Security, Negative

## Category
Security, Vulnerability Prevention
