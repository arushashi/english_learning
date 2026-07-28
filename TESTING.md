# TESTING ARCHITECTURE & STACK DETECTION

**Date:** 2024  
**Project:** Kannada Spoken English Learning Website  
**Stack Detection Status:** ✅ COMPLETE

---

## STACK DETECTION FINDINGS

### Frontend Stack
- **Framework:** Vanilla HTML5 + CSS3 + JavaScript (no React/Vue/Angular)
- **Build Tool:** None (static files served directly)
- **Server:** Python HTTP server (`python -m http.server 8000`)
- **Testing Framework:** Playwright (configured in `playwright.config.ts`)

### Content Storage
- **Format:** JSON (not MDX, CMS, or database)
- **Location:** `data/courseContent.json`
- **Structure:** Nested object with keys `level0` through `level9`
- **Lesson Schema:** Each lesson has:
  - `id` (number)
  - `title` (English string)
  - `kannadaTitle` (Kannada string)
  - `content` (object with explanation, kannadaExplanation, and lesson-specific fields)
  - `speakingPractice` (array of {english, kannada} objects)
  - Optional: `masteryTest` (for level completion tests)

### Audio Files
- **Storage:** Not yet implemented in repo
- **References:** Currently hardcoded in HTML/JS (e.g., `audio/lesson-{id}.mp3`)
- **Status:** Audio infrastructure is specified in design but files are not present
- **Impact:** Audio checks will WARN (not ERROR) if files don't exist

### Authentication & Session Management
- **Auth:** None (no login/signup)
- **Session Persistence:** LocalStorage (`localStorage.getItem('progress')`)
- **Progress Storage:** JSON object in LocalStorage with keys:
  - `currentLevel`
  - `completedLessons`
  - `practiceScores`
  - `quizResults`
  - `streak`

### Routing & Navigation
- **Type:** Single-Page Application (SPA)
- **Router:** Custom (no React Router, Vue Router, etc.)
- **Navigation:** `data-page` attributes on links
- **Pages:** home, levels, practice, progress, resources, about
- **Lesson Navigation:** Not yet implemented (lessons are not routable)

### Database
- **Type:** None (static content only)
- **Persistence:** LocalStorage only
- **Implication:** No server-side validation, all progress is client-side

### Kannada Support
- **Font:** Noto Sans Kannada (via CSS, not yet explicitly loaded)
- **Unicode Range:** U+0C80–U+0CFF (Kannada script)
- **Rendering:** Verified in courseContent.json (Kannada text is present)

---

## TESTING CONSTRAINTS & IMPLICATIONS

### What CAN be tested:
1. ✅ JSON schema validation (courseContent.json)
2. ✅ Kannada script presence (Unicode validation)
3. ✅ Placeholder text detection
4. ✅ Learning path graph (prerequisite chains)
5. ✅ Duplicate IDs and slugs
6. ✅ Internal link resolution (lesson-to-lesson)
7. ✅ UI rendering (Playwright)
8. ✅ LocalStorage persistence (Playwright)
9. ✅ Navigation flows (Playwright)
10. ✅ Accessibility (axe-core)
11. ✅ Visual regression (Playwright snapshots)
12. ✅ Lighthouse performance (Playwright)

### What CANNOT be tested (not implemented):
1. ❌ Audio file validation (files don't exist yet)
2. ❌ Authentication flows (no auth system)
3. ❌ Lesson-level routing (lessons are not routable)
4. ❌ Quiz scoring logic (not fully implemented in UI)
5. ❌ AI Tutor (not implemented)
6. ❌ Speech recognition (not implemented)
7. ❌ Spaced repetition (not implemented)
8. ❌ PDF worksheet download (not implemented)
9. ❌ Placement test (not implemented)
10. ❌ Offline mode (not implemented)

### Workarounds for missing features:
- Audio checks will WARN instead of ERROR
- Lesson routing tests will be skipped with comments
- AI tutor tests will be skipped
- Speech recognition tests will be skipped
- Placement test will be skipped

---

## CONTENT STRUCTURE ANALYSIS

### courseContent.json Structure
```
{
  "level0": {
    "title": "Absolute Foundation",
    "description": "...",
    "prerequisites": "None - This is where everyone starts",
    "objectives": ["..."],
    "lessons": [
      {
        "id": 0,
        "title": "Mindset and Tips for Learning English",
        "kannadaTitle": "ಇಂಗ್ಲಿಷ್ ಕಲಿಯಲು ಮನೋವೃತ್ತಿ ಮತ್ತು ಸೂಚನೆಗಳು",
        "content": {
          "explanation": "...",
          "kannadaExplanation": "...",
          // Lesson-specific fields vary by lesson
        },
        "speakingPractice": [
          {
            "english": "...",
            "kannada": "..."
          }
        ]
      }
    ],
    "masteryTest": {
      "title": "...",
      "questions": [...]
    }
  }
}
```

### Lesson Schema Variations
- **Level 0, Lesson 0:** mindsetPoints, tipsToImprove
- **Level 0, Lesson 1:** capitalLetters, smallLetters, practice
- **Level 1, Lesson 0:** patterns (with pattern, kannada, examples)
- **Level 2+:** patterns, examples, commonMistakes

**Issue:** Lesson schema is inconsistent. Some lessons have `examples`, others have `practice`. Some have `patterns`, others don't.

---

## CEFR LEVEL MAPPING

**Current Status:** CEFR levels are NOT in courseContent.json

**Expected:** Each lesson should have a `cefr` field with values: A1, A2, B1, B2, C1, C2

**Implication:** Content-integrity checker will WARN if CEFR levels are missing.

---

## MASTER SYLLABUS MAPPING

**Current Status:** No master syllabus is embedded in the code

**Expected:** A `syllabus.json` file with structure:
```json
{
  "sections": [
    {
      "id": "articles",
      "title": "Articles (a/an/the)",
      "lessons": [...]
    }
  ]
}
```

**Implication:** Coverage checks will be skipped (no syllabus to check against).

---

## PLAYWRIGHT CONFIGURATION

**File:** `playwright.config.ts`

**Projects:**
- Desktop Chrome
- Desktop Firefox
- Desktop Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

**Web Server:** Python HTTP server on port 8000

**Base URL:** `http://localhost:8000`

**Trace:** on-first-retry

**Screenshot:** only-on-failure

**Retries:** 2 (in CI), 0 (locally)

---

## TESTING STRATEGY

### A. Content-Integrity Checker
- **Type:** Standalone Node.js script
- **Input:** `data/courseContent.json`
- **Output:** Console summary + `content-report.json`
- **Exit Code:** 1 if ERROR-severity checks fail
- **Severity Levels:**
  - ERROR: Schema violations, duplicate IDs, broken graph, missing audio
  - WARNING: Placeholder text, short examples, missing CEFR levels, missing coverage

### B. E2E Test Suite
- **Type:** Playwright tests in TypeScript
- **Location:** `e2e/` directory
- **Fixtures:** Fresh user, mid-progress user (via seeded LocalStorage)
- **Page Object Model:** Yes (no selector strings in tests)
- **Data-testid:** Will be added to fragile selectors
- **Coverage:**
  - Navigation flows
  - Lesson rendering
  - Practice questions
  - Quiz completion
  - Progress persistence
  - Accessibility
  - Visual regression
  - Performance

### C. CI/CD Integration
- **GitHub Actions:** Run content checker on every PR
- **E2E Tests:** Run on PR to main and nightly
- **Artifacts:** Traces, screenshots, videos, content-report.json

---

## KNOWN ISSUES & LIMITATIONS

1. **No Audio Files:** Audio checks will WARN, not ERROR
2. **Inconsistent Lesson Schema:** Some lessons have `examples`, others `practice`
3. **No CEFR Levels:** Lessons don't have CEFR level assignments
4. **No Master Syllabus:** Can't validate coverage against syllabus
5. **No Lesson Routing:** Lessons are not routable (can't navigate directly to a lesson)
6. **No Quiz Scoring:** Quiz logic is not fully implemented
7. **No AI Tutor:** AI tutor is not implemented
8. **No Speech Recognition:** Speech recognition is not implemented
9. **No Spaced Repetition:** Spaced repetition is not implemented
10. **No Offline Mode:** Offline caching is not implemented

---

## RECOMMENDATIONS

### Before Testing:
1. Add CEFR level to every lesson in courseContent.json
2. Standardize lesson schema (all lessons should have same fields)
3. Create master syllabus (syllabus.json)
4. Add data-testid attributes to fragile selectors
5. Implement lesson routing (so lessons are directly accessible)
6. Add audio files (or mock them for testing)

### For Testing:
1. Use seeded LocalStorage for test fixtures
2. Mock audio files (or use placeholder audio)
3. Skip tests for unimplemented features (with comments)
4. Run content checker on every PR
5. Run E2E tests on PR to main and nightly

---

## TESTING CHECKLIST

- [ ] Content-integrity checker implemented
- [ ] Content-report.json generated
- [ ] E2E test suite implemented
- [ ] Playwright fixtures created
- [ ] Page Object Model implemented
- [ ] Data-testid attributes added
- [ ] Accessibility tests implemented
- [ ] Visual regression tests implemented
- [ ] Performance tests implemented
- [ ] GitHub Actions workflow created
- [ ] CI/CD integration complete

---

**Last Updated:** 2024  
**Status:** Ready for implementation

