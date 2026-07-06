const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    await page.goto('http://localhost:5174/promo', { waitUntil: 'networkidle' });
    await page.screenshot({ path: '/tmp/promo_page.png', fullPage: true });
    console.log('✓ Screenshot saved: /tmp/promo_page.png');
    
    const title = await page.locator('h1').first().textContent();
    console.log('✓ Page title:', title?.trim());
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
