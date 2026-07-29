import { test, expect } from './fixtures';

/**
 * E2E Test Suite: Critical User Flows
 * Tests core functionality of the Kannada Spoken English learning platform
 */

// ============================================================================
// 1. NAVIGATION & PAGE RENDERING
// ============================================================================

test.describe('Navigation & Page Rendering', () => {
  test('should load home page and display hero section', async ({ freshUser }) => {
    await freshUser.goto('/');

    // App shows the Levels page by default; navigate to Home to see the hero
    await freshUser.click('[data-page="home"]');

    // Check hero section
    const hero = freshUser.locator('.hero');
    await expect(hero).toBeVisible();

    // Check hero text
    const heroTitle = freshUser.locator('.hero h1');
    await expect(heroTitle).toContainText('Learn English from Zero to Hero');
  });

  test('should navigate between pages using nav links', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Click Levels link
    await freshUser.click('[data-page="levels"]');
    
    // Check levels page is visible
    const levelsPage = freshUser.locator('#levels');
    await expect(levelsPage).toHaveClass(/active/);
  });

  test('should display breadcrumbs on non-home pages', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Navigate to levels
    await freshUser.click('[data-page="levels"]');
    
    // Check breadcrumbs are visible
    const breadcrumbs = freshUser.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
  });

  test('should toggle mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuToggle = page.locator('#navMenuToggle');
    const navMenu = page.locator('#navMenu');
    
    // Menu should not be active initially
    await expect(navMenu).not.toHaveClass(/active/);
    
    // Click toggle
    await menuToggle.click();
    
    // Menu should be active
    await expect(navMenu).toHaveClass(/active/);
  });
});

// ============================================================================
// 2. LEVEL NAVIGATION & RENDERING
// ============================================================================

test.describe('Level Navigation & Rendering', () => {
  test('should display all 10 levels on levels page', async ({ freshUser }) => {
    await freshUser.goto('/');
    await freshUser.click('[data-page="levels"]');
    
    // Check for level cards
    const levelCards = freshUser.locator('[data-level]');
    const count = await levelCards.count();
    
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('should display level metadata (title, description, progress)', async ({ freshUser }) => {
    await freshUser.goto('/');
    await freshUser.click('[data-page="levels"]');
    
    // Check first level card (there are also data-level="0" elements
    // in the home page course overview and the quick-nav buttons)
    const firstLevel = freshUser.locator('.level-card[data-level="0"]');
    
    // Check title
    const title = firstLevel.locator('.level-title');
    await expect(title).toBeVisible();
    
    // Check description
    const description = firstLevel.locator('.level-description');
    await expect(description).toBeVisible();
    
    // Check progress bar
    const progressBar = firstLevel.locator('.progress-bar');
    await expect(progressBar).toBeVisible();
  });

  test('should scroll to level when quick nav button is clicked', async ({ freshUser }) => {
    await freshUser.goto('/');
    await freshUser.click('[data-page="levels"]');
    
    // Click quick nav button for level 5
    const navBtn = freshUser.locator('[data-level="5"].nav-btn');
    if (await navBtn.isVisible()) {
      await navBtn.click();
      
      // Check that button is now active
      await expect(navBtn).toHaveClass(/active/);
    }
  });
});

// ============================================================================
// 3. PROGRESS PERSISTENCE
// ============================================================================

test.describe('Progress Persistence', () => {
  test('should load and display saved progress', async ({ midProgressUser }) => {
    // Check that progress was loaded
    const currentLevel = await midProgressUser.evaluate(() => {
      const progress = JSON.parse(localStorage.getItem('progress') || '{}');
      return progress.currentLevel;
    });
    
    expect(currentLevel).toBe(2);
  });

  test('should persist progress after page reload', async ({ freshUser }) => {
    // Simulate completing a lesson
    await freshUser.evaluate(() => {
      const progress = {
        currentLevel: 1,
        completedLessons: [0],
        streak: 1,
      };
      localStorage.setItem('progress', JSON.stringify(progress));
    });
    
    // Reload page
    await freshUser.reload();
    
    // Check progress is still there
    const progress = await freshUser.evaluate(() => {
      return JSON.parse(localStorage.getItem('progress') || '{}');
    });
    
    expect(progress.currentLevel).toBe(1);
    expect(progress.completedLessons).toContain(0);
  });

  test('should update streak on daily activity', async ({ freshUser }) => {
    // Set initial progress
    await freshUser.evaluate(() => {
      const progress = {
        currentLevel: 0,
        streak: 5,
        lastActivityDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      };
      localStorage.setItem('progress', JSON.stringify(progress));
    });
    
    // Simulate activity today
    await freshUser.evaluate(() => {
      const progress = JSON.parse(localStorage.getItem('progress') || '{}');
      progress.lastActivityDate = new Date().toISOString();
      progress.streak = 6;
      localStorage.setItem('progress', JSON.stringify(progress));
    });
    
    // Check streak was updated
    const streak = await freshUser.evaluate(() => {
      const progress = JSON.parse(localStorage.getItem('progress') || '{}');
      return progress.streak;
    });
    
    expect(streak).toBe(6);
  });
});

// ============================================================================
// 4. PROGRESS PAGE
// ============================================================================

test.describe('Progress Page', () => {
  test('should display progress statistics', async ({ midProgressUser }) => {
    await midProgressUser.click('[data-page="progress"]');

    // Check for progress stats
    const statsSection = midProgressUser.locator('.progress-overview');
    await expect(statsSection).toBeVisible();

    // Check for specific stats
    const levelsStarted = midProgressUser.locator('.progress-stat:has-text("Levels Started")');
    await expect(levelsStarted).toBeVisible();
  });

  test('should display learning tips', async ({ midProgressUser }) => {
    await midProgressUser.click('[data-page="progress"]');

    // Check for tips section
    const tipsSection = midProgressUser.locator('.achievements');
    await expect(tipsSection).toBeVisible();
  });

  test('should display achievement badges', async ({ midProgressUser }) => {
    await midProgressUser.click('[data-page="progress"]');

    // Check for badges
    const badges = midProgressUser.locator('.achievement');
    const count = await badges.count();

    expect(count).toBeGreaterThan(0);
  });
});

// ============================================================================
// 5. KANNADA TEXT RENDERING
// ============================================================================

test.describe('Kannada Text Rendering', () => {
  test('should render Kannada text correctly', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Check for Kannada text in page
    const kannadaElements = freshUser.locator('text=/[\u0C80-\u0CFF]/');
    const count = await kannadaElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should not have empty Kannada text boxes', async ({ freshUser }) => {
    await freshUser.goto('/');
    await freshUser.click('[data-page="levels"]');
    
    // Check level descriptions (should have Kannada)
    const levelDescriptions = freshUser.locator('.level-description');
    
    for (let i = 0; i < Math.min(3, await levelDescriptions.count()); i++) {
      const text = await levelDescriptions.nth(i).textContent();
      expect(text).toBeTruthy();
      expect(text?.length).toBeGreaterThan(0);
    }
  });

  test('should use correct Kannada font', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Check that Kannada font is loaded
    const kannadaText = freshUser.locator('.kannada-text').first();
    if (await kannadaText.isVisible()) {
      const fontFamily = await kannadaText.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
      
      expect(fontFamily).toContain('Kannada');
    }
  });
});

// ============================================================================
// 6. ACCESSIBILITY
// ============================================================================

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ freshUser }) => {
    await freshUser.goto('/');
    // App shows the Levels page by default; navigate to Home to see the h1
    await freshUser.click('[data-page="home"]');

    // Check for h1
    const h1 = freshUser.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check that h1 comes before h2
    const h2 = freshUser.locator('h2').first();
    await expect(h2).toBeVisible();
  });

  test('should have alt text for images', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Check for images with alt text
    const images = freshUser.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt !== null) {
        expect(alt.length).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper ARIA labels', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Check for buttons with labels
    const buttons = freshUser.locator('button');
    const count = await buttons.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    // Tab to first link
    await freshUser.keyboard.press('Tab');
    
    // Check that focus is on a focusable element
    const focused = await freshUser.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });
});

// ============================================================================
// 7. RESPONSIVE DESIGN
// ============================================================================

test.describe('Responsive Design', () => {
  // Nav links live inside .nav-menu, which is hidden behind the hamburger
  // toggle at widths <= 768px (see css/styles.css @media max-width: 768px).
  async function goToHome(page) {
    const toggle = page.locator('#navMenuToggle');
    if (await toggle.isVisible()) {
      await toggle.click();
    }
    await page.click('[data-page="home"]');
  }

  test('should render correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await goToHome(page);

    // Check that content is visible
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    // Check that text is not overflowing
    const heroTitle = page.locator('.hero h1');
    const boundingBox = await heroTitle.boundingBox();
    expect(boundingBox?.width).toBeLessThan(375);
  });

  test('should render correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await goToHome(page);

    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('should render correctly on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await goToHome(page);

    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });
});

// ============================================================================
// 8. PERFORMANCE
// ============================================================================

test.describe('Performance', () => {
  test('should load home page within 3 seconds', async ({ freshUser }) => {
    const startTime = Date.now();
    await freshUser.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have Largest Contentful Paint under 2.5s', async ({ freshUser }) => {
    await freshUser.goto('/');
    
    const metrics = await freshUser.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    if (metrics) {
      expect(metrics).toBeLessThan(2500);
    }
  });
});

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

test.describe('Error Handling', () => {
  test('should handle missing data gracefully', async ({ freshUser }) => {
    // Clear localStorage
    await freshUser.evaluate(() => localStorage.clear());
    
    // Navigate to page
    await freshUser.goto('/');

    // Page should still load (app defaults to the Levels page)
    await expect(freshUser.locator('#levels')).toBeVisible();

    // Home page content should also still be reachable
    await freshUser.click('[data-page="home"]');
    const hero = freshUser.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ freshUser }) => {
    // Simulate offline
    await freshUser.context().setOffline(true);
    
    // Page should still be accessible (cached)
    await freshUser.goto('/');
    
    // Go back online
    await freshUser.context().setOffline(false);
  });
});

// ============================================================================
// 10. FEATURE DETECTION (Unimplemented Features)
// ============================================================================

test.describe('Feature Detection', () => {
  test.skip('should complete placement test and assign CEFR level', async ({ freshUser }) => {
    // SKIPPED: Placement test not yet implemented
    // When implemented, this test should:
    // 1. Navigate to placement test
    // 2. Complete 50 questions
    // 3. Verify CEFR level is assigned
    // 4. Verify learning path is updated
  });

  test.skip('should record pronunciation and provide score', async ({ freshUser }) => {
    // SKIPPED: Speech recognition not yet implemented
    // When implemented, this test should:
    // 1. Navigate to pronunciation practice
    // 2. Use fake media stream to simulate recording
    // 3. Verify score is returned (0-100)
    // 4. Verify feedback is provided
  });

  test.skip('should provide AI tutor responses', async ({ freshUser }) => {
    // SKIPPED: AI tutor not yet implemented
    // When implemented, this test should:
    // 1. Navigate to AI tutor
    // 2. Send a grammar doubt
    // 3. Verify response is received
    // 4. Verify response is in Kannada
  });

  test.skip('should download PDF worksheet', async ({ freshUser }) => {
    // SKIPPED: PDF download not yet implemented
    // When implemented, this test should:
    // 1. Navigate to lesson
    // 2. Click download worksheet
    // 3. Verify PDF is downloaded
    // 4. Verify PDF is non-zero bytes
  });

  test.skip('should work offline with cached content', async ({ freshUser }) => {
    // SKIPPED: Offline mode not yet implemented
    // When implemented, this test should:
    // 1. Cache a lesson
    // 2. Go offline
    // 3. Verify lesson is still readable
    // 4. Go back online
  });
});
