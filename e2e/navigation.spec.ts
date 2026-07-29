import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the site with the Levels page shown by default', async ({ page }) => {
    await expect(page).toHaveTitle('Kannada Spoken English - Zero to Hero');
    // The app shows the Levels page directly on load (see js/app.js init()),
    // not the Home page, so the level cards should be visible immediately.
    await expect(page.locator('#levels')).toBeVisible();
    await expect(page.locator('.level-card').first()).toBeVisible();
  });

  test('should navigate to Levels page', async ({ page }) => {
    await page.click('text=Levels');
    await expect(page.locator('#levels')).toBeVisible();
    await expect(page.locator('#levels h2')).toContainText('Learning Levels');
  });

  test('should navigate to Practice page', async ({ page }) => {
    await page.click('[data-page="practice"]');
    await expect(page.locator('#practice')).toBeVisible();
    await expect(page.locator('#practice h2')).toContainText('Speaking Practice');
  });

  test('should navigate to Progress page', async ({ page }) => {
    await page.click('text=My Progress');
    await expect(page.locator('#progress')).toBeVisible();
    await expect(page.locator('#progress h2')).toContainText('My Learning Progress');
  });

  test('should navigate back to Home page', async ({ page }) => {
    await page.click('text=Levels');
    await page.click('text=Home');
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('.hero h1')).toContainText('Learn English from Zero to Hero');
  });

  test('should update active nav link on navigation', async ({ page }) => {
    // Scope to the header nav - the footer also has a "All Levels" link
    // with data-page="levels", so an unscoped selector matches both.
    const homeLink = page.locator('.nav-menu .nav-link[data-page="home"]');
    const levelsLink = page.locator('.nav-menu .nav-link[data-page="levels"]');

    await homeLink.click();
    await expect(homeLink).toHaveClass(/active/);

    await levelsLink.click();
    await expect(levelsLink).toHaveClass(/active/);
    await expect(homeLink).not.toHaveClass(/active/);
  });

  test('should show all 10 level cards on Levels page', async ({ page }) => {
    await page.click('text=Levels');
    const levelCards = page.locator('.level-card');
    await expect(levelCards).toHaveCount(10);
  });

  test('should display course overview on home page', async ({ page }) => {
    await page.click('text=Home');
    await expect(page.locator('.level-summary')).toHaveCount(10);
    await expect(page.locator('.feature-card')).toHaveCount(6);
  });
});
