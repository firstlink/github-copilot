---
description: Use this selenium instructions while writing selenium tests in JavaScript to ensure consistency and best practices.
applyTo: **/tests/**/*.js
---

## Coding standards
- Use JavaScript with CommonJS modules.
- Prefer Page Object Model for page interactions.
- Keep tests focused and readable.
- Use clear test names that describe business intent.

## Selenium standards
- Avoid `driver.sleep()` unless the lesson is explicitly teaching static waits.
- Prefer explicit waits with `until` and shared wait helpers.
- Prefer stable locators: id, name, CSS, then XPath only if necessary.
- Put page-specific locators and actions inside page objects.

## Test design
- Keep assertions easy for beginners to understand.
- Preserve the original scenario intent when improving tests.
- Prefer small, teachable changes over heavy refactoring.