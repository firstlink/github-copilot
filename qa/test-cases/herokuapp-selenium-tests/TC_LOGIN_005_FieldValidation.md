# TC_LOGIN_005: Field Validation and Data Input

## Test ID
TC_LOGIN_005

## Test Title
Username and Password Field Input Validation

## Description
Verify that the username and password fields accept input correctly and validate various input scenarios including special characters, whitespace, and field limits.

## Preconditions
- Browser is open and navigated to the login page: https://the-internet.herokuapp.com/login

## Test Steps
1. Verify login page is displayed
2. Test username field with valid characters and special characters
3. Verify username field accepts and displays entered text
4. Test password field with various character types
5. Verify password field masks password characters (shows dots/asterisks)
6. Clear username field using standard clear mechanism
7. Verify field is cleared properly
8. Clear password field
9. Verify field is cleared properly
10. Test entering whitespace-only values
11. Verify validation handles whitespace appropriately

## Expected Results
- Login page displays all form elements correctly
- Username field accepts alphanumeric characters
- Username field accepts special characters where applicable
- Username input is displayed as regular text
- Password field accepts various character types
- Password field masks input with dots or asterisks (not readable)
- Fields can be cleared properly
- Clearing removes all entered text
- Whitespace-only input is handled appropriately
- Fields retain focus after input operations
- Tab navigation between fields works correctly

## Test Data
- Valid characters: a-z, A-Z, 0-9
- Special characters for testing: @, #, $, !, %
- Password test characters: uppercase, lowercase, numbers, special characters
- Whitespace test: spaces, tabs

## Priority
Medium

## Test Type
Functional, Validation

## Category
Input Validation, UI Behavior
