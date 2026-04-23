const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const path = require('path');

describe('File Upload Test', function() {
  this.timeout(30000);
  let browser;
  let context;
  let page;

  before(async function() {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('http://the-internet.herokuapp.com/upload');
  });

  it('should upload a file and verify the upload success', async function() {
    // File path to the test file
    const filePath = path.join(__dirname, 'example.txt');

    // Locate the file input and upload button
    const fileInput = page.locator('#file-upload');
    const uploadButton = page.locator('#file-submit');

    // Upload the file using Playwright's setInputFiles method
    await fileInput.setInputFiles(filePath);
    
    // Click the upload button
    await uploadButton.click();

    // Wait for the uploaded files element to contain the filename
    // Playwright's auto-waiting handles the visibility and stability
    const uploadedFiles = page.locator('#uploaded-files');
    await expect(uploadedFiles).toContainText('example.txt');
    
    // Verify the exact uploaded filename
    const uploadedFileName = await uploadedFiles.textContent();
    expect(uploadedFileName).toBe('example.txt');
  });

  after(async function() {
    await context.close();
    await browser.close();
  });
});