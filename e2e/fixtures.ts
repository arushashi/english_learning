import { test as base, expect } from '@playwright/test';

/**
 * Fixtures for E2E tests
 * Provides fresh user and mid-progress user with seeded LocalStorage
 */

export const test = base.extend({
  freshUser: async ({ page }, use) => {
    // Navigate to home first - localStorage/sessionStorage can't be
    // accessed on about:blank (throws SecurityError in Chromium)
    await page.goto('/');

    // Clear all storage
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload so the app re-initializes against the cleared storage
    await page.reload();

    await use(page);
  },

  midProgressUser: async ({ page }, use) => {
    // Navigate to home first - localStorage can't be accessed on
    // about:blank (throws SecurityError in Chromium)
    await page.goto('/');

    // Clear all storage
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Seed progress data
    const progress = {
      currentLevel: 2,
      completedLessons: [0, 1, 2, 3, 4, 5],
      practiceScores: {
        0: 85,
        1: 90,
        2: 78,
        3: 92,
        4: 88,
        5: 81,
      },
      quizResults: {
        0: { score: 8, total: 10 },
        1: { score: 9, total: 10 },
        2: { score: 7, total: 10 },
      },
      streak: 7,
      lastActivityDate: new Date().toISOString(),
    };

    await page.evaluate((data) => {
      localStorage.setItem('progress', JSON.stringify(data));
    }, progress);

    // Reload so the app picks up the seeded progress
    await page.reload();

    await use(page);
  },
});

export { expect };
