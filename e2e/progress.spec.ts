import { test, expect } from '@playwright/test';

test.describe('Progress Tracking Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display progress page with statistics', async ({ page }) => {
    await page.click('text=My Progress');
    await expect(page.locator('h2')).toContainText('My Learning Progress');
    await expect(page.locator('.progress-stat')).toHaveCount(4);
  });

  test('should show initial progress as zero', async ({ page }) => {
    await page.click('text=My Progress');
    
    await expect(page.locator('#totalLevelsCompleted')).toContainText('0');
    await expect(page.locator('#totalLessonsCompleted')).toContainText('0');
    await expect(page.locator('#totalSpeakingMinutes')).toContainText('0');
    await expect(page.locator('#quizAverage')).toContainText('0%');
  });

  test('should update levels started when level is opened', async ({ page }) => {
    await page.click('text=Levels');
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    
    await page.click('text=My Progress');
    await expect(page.locator('#totalLevelsCompleted')).toContainText('1');
  });

  test('should update lessons completed when lesson is marked complete', async ({ page }) => {
    await page.click('text=Levels');
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('.lesson-item[data-lesson="1"]').click();
    await page.locator('.btn-complete-lesson').click();
    
    await page.click('text=My Progress');
    await expect(page.locator('#totalLessonsCompleted')).toContainText('1');
  });

  test('should display learning tips', async ({ page }) => {
    await page.click('text=My Progress');
    await expect(page.locator('.achievements')).toBeVisible();
    await expect(page.locator('.achievement')).toHaveCount(5);
  });

  test('should display achievement badges as unlocked', async ({ page }) => {
    await page.click('text=My Progress');
    const achievements = page.locator('.achievement');
    await expect(achievements).toHaveCount(5);
    
    for (let i = 0; i < 5; i++) {
      await expect(achievements.nth(i)).toHaveClass(/unlocked/);
    }
  });

  test('should save progress to localStorage', async ({ page }) => {
    await page.click('text=Levels');
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('.lesson-item[data-lesson="1"]').click();
    await page.locator('.btn-complete-lesson').click();
    
    // Reload page
    await page.reload();
    await page.click('text=My Progress');
    
    // Progress should persist
    await expect(page.locator('#totalLessonsCompleted')).toContainText('1');
  });

  test('should display progress message', async ({ page }) => {
    await page.click('text=My Progress');
    await expect(page.locator('.progress-message')).toBeVisible();
    await expect(page.locator('.progress-message p')).toHaveCount(3);
  });
});
