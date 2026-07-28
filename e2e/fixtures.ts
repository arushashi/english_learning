import { test as base, expect } from '@playwright/test';

/**
 * Fixtures for E2E tests
 * Provides fresh user and mid-progress user with seeded LocalStorage
 */

export const test = base.extend({
  freshUser: async ({ page }, use) => {
    // Clear all storage
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(() => sessionStorage.clear());

    // Navigate to home
    await page.goto('/');

    await use(page);
  },

  midProgressUser: async ({ page }, use) => {
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

    // Navigate to home
    await page.goto('/');

    await use(page);
  },
});

export { expect };
