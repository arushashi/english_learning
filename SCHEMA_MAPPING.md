# SCHEMA MAPPING: CHECKER vs. ACTUAL DATA

## Task 1: Field-by-Field Mapping Table

| Checker Expected Field | Actual Key in courseContent.json | Present in How Many Lessons | Notes |
|------------------------|----------------------------------|------------------------------|-------|
| `examples` | `practice` (Level 0) | ~30 lessons | Level 0 uses `practice` array with {english, kannada} objects |
| `examples` | `patterns` (Level 1+) | ~94 lessons | Level 1+ use `patterns` array with {pattern, kannada, examples} objects |
| `examples` | `vocabulary` (some lessons) | ~10 lessons | Some lessons use `vocabulary` array instead |
| `examples` | MISSING | ~0 lessons | No lesson has `examples` field as checker expects |
| `practiceQuestions` | MISSING | 0 lessons | No lesson has `practiceQuestions` field |
| `commonMistakes` | MISSING | 0 lessons | No lesson has `commonMistakes` field |
| `quiz` | MISSING | 0 lessons | No lesson has `quiz` field |
| `cefr` | MISSING | 0 lessons | No lesson has `cefr` field |
| `speakingPractice` | `speakingPractice` | 124 lessons | Present in all lessons |
| `content.explanation` | `content.explanation` | 124 lessons | Present in all lessons |
| `content.kannadaExplanation` | `content.kannadaExplanation` | 124 lessons | Present in all lessons |
| `kannadaTitle` | `kannadaTitle` | 124 lessons | Present in all lessons |
| `title` | `title` | 124 lessons | Present in all lessons |

## Summary

**Checker Schema vs. Reality:**

1. **Examples Field:** Checker looks for `examples` array. Actual data uses:
   - `practice` (Level 0): ~30 lessons
   - `patterns` (Level 1-9): ~94 lessons
   - `vocabulary` (some lessons): ~10 lessons
   - **Result:** 0 lessons match checker's expected `examples` field

2. **Practice Questions:** Checker expects `practiceQuestions` field.
   - **Actual:** 0 lessons have this field
   - **Result:** 0/124 lessons

3. **Common Mistakes:** Checker expects `commonMistakes` field.
   - **Actual:** 0 lessons have this field
   - **Result:** 0/124 lessons

4. **Quiz:** Checker expects `quiz` field.
   - **Actual:** 0 lessons have this field
   - **Result:** 0/124 lessons

5. **CEFR Level:** Checker expects `cefr` field.
   - **Actual:** 0 lessons have this field
   - **Result:** 0/124 lessons

6. **Speaking Practice:** Checker expects `speakingPractice` field.
   - **Actual:** ALL 124 lessons have this field
   - **Result:** 124/124 lessons ✅

## Recommendation

The checker needs to be updated to:
1. Look for `practice`, `patterns`, or `vocabulary` instead of `examples`
2. Count items in these arrays instead of expecting `examples`
3. Change SCHEMA warnings from WARNING to ERROR severity (per spec)
4. Keep CEFR check as ERROR (missing from all lessons)

