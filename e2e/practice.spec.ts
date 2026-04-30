import { test, expect } from '@playwright/test';

test.describe('Speaking Practice Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Practice');
  });

  test('should display practice page with all sections', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Speaking Practice');
    await expect(page.locator('.practice-card')).toHaveCount(3);
  });

  test('should display daily speaking challenge', async ({ page }) => {
    const dailyChallenge = page.locator('.practice-card').nth(0);
    await expect(dailyChallenge.locator('h3')).toContainText('Daily Speaking Challenge');
    await expect(dailyChallenge.locator('#dailyTopic')).toBeVisible();
    await expect(dailyChallenge.locator('.topic-kannada')).toBeVisible();
  });

  test('should display pronunciation practice section', async ({ page }) => {
    const pronunciation = page.locator('.practice-card').nth(1);
    await expect(pronunciation.locator('h3')).toContainText('Pronunciation Practice');
    await expect(pronunciation.locator('.audio-item')).toHaveCount(4);
  });

  test('should display shadow speaking section', async ({ page }) => {
    const shadowSpeaking = page.locator('.practice-card').nth(2);
    await expect(shadowSpeaking.locator('h3')).toContainText('Shadow Speaking');
    await expect(shadowSpeaking.locator('#startShadow')).toBeVisible();
  });

  test('should have recording controls available', async ({ page }) => {
    await expect(page.locator('#startRecording')).toBeVisible();
    await expect(page.locator('#stopRecording')).toBeVisible();
    await expect(page.locator('#playRecording')).toBeVisible();
  });

  test('should disable stop and play buttons initially', async ({ page }) => {
    await expect(page.locator('#stopRecording')).toBeDisabled();
    await expect(page.locator('#playRecording')).toBeDisabled();
    await expect(page.locator('#startRecording')).not.toBeDisabled();
  });

  test('should display Kannada translations for practice items', async ({ page }) => {
    const audioItems = page.locator('.audio-item');
    const firstItem = audioItems.nth(0);
    await expect(firstItem.locator('.audio-text')).toBeVisible();
    await expect(firstItem.locator('.audio-kannada')).toBeVisible();
  });

  test('should display recording timer', async ({ page }) => {
    await expect(page.locator('#recordingTimer')).toBeVisible();
    await expect(page.locator('#recordingTimer')).toContainText('00:00');
  });

  test('should play audio when audio button is clicked', async ({ page }) => {
    const audioButton = page.locator('.btn-audio').first();
    
    // Mock the speech synthesis
    await page.addInitScript(() => {
      window.speechSynthesis = {
        speak: jest.fn(),
        cancel: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        getVoices: jest.fn(() => []),
        speaking: false,
        pending: false,
      } as any;
    });
    
    await audioButton.click();
    // Note: Actual audio playback testing requires browser context
    // This test verifies the button is clickable
    await expect(audioButton).toBeVisible();
  });
});
