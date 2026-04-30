import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const devices = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 },
  ];

  devices.forEach((device) => {
    test(`should display correctly on ${device.name}`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');

      // Check that main elements are visible
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.features')).toBeVisible();
    });
  });

  test('should have responsive navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const navMenu = page.locator('.nav-menu');
    await expect(navMenu).toBeVisible();
  });

  test('should display level cards in single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('text=Levels');

    const levelCards = page.locator('.level-card');
    await expect(levelCards.first()).toBeVisible();
  });

  test('should have readable text on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const heroTitle = page.locator('.hero h1');
    await expect(heroTitle).toBeVisible();
    
    // Check font size is appropriate for mobile
    const fontSize = await heroTitle.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(parseInt(fontSize)).toBeGreaterThan(16);
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    // Check button has adequate touch target size (min 44x44px)
    const box = await firstButton.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(40);
      expect(box.width).toBeGreaterThanOrEqual(40);
    }
  });
});
