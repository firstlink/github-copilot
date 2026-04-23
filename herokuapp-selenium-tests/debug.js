const { Builder, By, until } = require('selenium-webdriver');

(async function() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Navigate to login page
    await driver.get('https://the-internet.herokuapp.com/login');
    
    // Wait for page load
    await driver.wait(until.elementLocated(By.id('username')), 10000);
    
    // Login
    await driver.findElement(By.id('username')).sendKeys('tomsmith');
    await driver.findElement(By.id('password')).sendKeys('SuperSecretPassword!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for navigation
    await driver.wait(until.urlContains('/secure'), 10000);
    
    // Check current URL
    const url = await driver.getCurrentUrl();
    console.log('Current URL:', url);
    
    // Try to find welcome message
    try {
      const h2 = await driver.findElement(By.css('div.content h2'));
      const text = await h2.getText();
      console.log('H2 text:', text);
    } catch(e) {
      console.log('H2 not found');
    }
    
    // Get page source to debug
    const source = await driver.getPageSource();
    console.log('Page contains "Welcome":', source.includes('Welcome'));
    console.log('Page contains "Secure":', source.includes('Secure'));
    
    // Look for all h2 elements
    const headers = await driver.findElements(By.css('h2'));
    console.log('Found', headers.length, 'h2 elements');
    for(let h of headers) {
      console.log('H2:', await h.getText());
    }
    
  } finally {
    await driver.quit();
  }
})();
