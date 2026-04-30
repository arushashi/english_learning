import { test, expect } from '@playwright/test';

test.describe('Level System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Levels');
  });

  test('should display all 10 levels with correct information', async ({ page }) => {
    const levelCards = page.locator('.level-card');
    await expect(levelCards).toHaveCount(10);

    // Check Level 0
    const level0 = page.locator('.level-card[data-level="0"]');
    await expect(level0.locator('h3')).toContainText('Absolute Foundation');
    await expect(level0.locator('.level-status')).toContainText('Start Here');

    // Check Level 1
    const level1 = page.locator('.level-card[data-level="1"]');
    await expect(level1.locator('h3')).toContainText('Survival English');
  });

  test('should open level when Start Level button is clicked', async ({ page }) => {
    const level0 = page.locator('.level-card[data-level="0"]');
    await level0.locator('.btn-level').click();
    
    await expect(page.locator('h2')).toContainText('Level 0');
    await expect(page.locator('.btn-back')).toBeVisible();
  });

  test('should display lesson list when level is opened', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    
    const lessonsList = page.locator('#lessonsList');
    await expect(lessonsList).toBeVisible();
    const lessonItems = page.locator('.lesson-item');
    await expect(lessonItems).toHaveCount(10); // Level 0 has 10 lessons
  });

  test('should display lesson content when lesson is clicked', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('.lesson-item[data-lesson="1"]').click();
    
    await expect(page.locator('.lesson-detail')).toBeVisible();
    await expect(page.locator('.lesson-detail h3')).toBeVisible();
  });

  test('should mark lesson as complete', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('.lesson-item[data-lesson="1"]').click();
    
    await page.locator('.btn-complete-lesson').click();
    
    // Check for notification or completion indicator
    const lessonItem = page.locator('.lesson-item[data-lesson="1"]');
    await expect(lessonItem).toHaveClass(/completed/);
  });

  test('should navigate to next lesson', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('.lesson-item[data-lesson="1"]').click();
    
    await page.locator('.btn-next-lesson').click();
    
    const activeLesson = page.locator('.lesson-item.active');
    await expect(activeLesson).toHaveAttribute('data-lesson', '2');
  });

  test('should display level progress', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    
    const progressDisplay = page.locator('.level-progress-display');
    await expect(progressDisplay).toBeVisible();
    await expect(progressDisplay.locator('.progress-text')).toContainText('complete');
  });

  test('should navigate back to levels from level view', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('.btn-back').click();
    
    await expect(page.locator('#levels')).toBeVisible();
    await expect(page.locator('.level-card')).toHaveCount(10);
  });

  test('should open quiz modal', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('text=Take Level Quiz').click();
    
    const quizModal = page.locator('#quizModal');
    await expect(quizModal).toBeVisible();
    await expect(quizModal.locator('h2')).toContainText('Level 0 Quiz');
  });

  test('should submit quiz and show score', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('text=Take Level Quiz').click();
    
    // Select answers
    await page.locator('input[name="q1"][value="b"]').check();
    await page.locator('input[name="q2"][value="b"]').check();
    await page.locator('input[name="q3"][value="b"]').check();
    
    await page.locator('.btn-submit').click();
    
    // Modal should close
    await expect(page.locator('#quizModal')).not.toBeVisible();
  });

  test('should navigate to practice from level view', async ({ page }) => {
    await page.locator('.level-card[data-level="0"] .btn-level').click();
    await page.locator('text=Practice Speaking').click();
    
    await expect(page.locator('#practice')).toBeVisible();
  });
});
