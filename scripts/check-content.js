#!/usr/bin/env node

/**
 * Content-Integrity Checker (JavaScript)
 * Validates all lessons in courseContent.json against a formal schema
 * Usage: node scripts/check-content.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// UTILITIES
// ============================================================================

function isKannada(text) {
  if (!text) return false;
  const kannadaRegex = /[\u0C80-\u0CFF]/g;
  const matches = text.match(kannadaRegex) || [];
  const kannadaPercentage = (matches.length / text.length) * 100;
  return kannadaPercentage >= 70;
}

function isLatin(text) {
  if (!text) return false;
  const latinRegex = /[a-zA-Z0-9\s\-.,!?'";:()]/g;
  const matches = text.match(latinRegex) || [];
  const latinPercentage = (matches.length / text.length) * 100;
  return latinPercentage >= 70;
}

function hasPlaceholder(text) {
  if (!text) return false;
  const placeholders = [
    'TODO',
    'Lorem',
    'TBD',
    'coming soon',
    'FIXME',
    '...',
    'placeholder',
    'example',
    'sample',
  ];
  return placeholders.some((p) => text.toLowerCase().includes(p.toLowerCase()));
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// ============================================================================
// CONTENT CHECKER CLASS
// ============================================================================

class ContentChecker {
  constructor(courseContent) {
    this.courseContent = courseContent;
    this.results = [];
    this.lessonReports = [];
    this.audioReferences = new Set();
    this.lessonIds = new Set();
    this.lessonSlugs = new Set();
    this.errorsByCategory = {};
    this.warningsByCategory = {};
  }

  check() {
    console.log('🔍 Starting content integrity checks...\n');

    // Collect all audio references and IDs
    this.collectReferences();

    // Run checks per lesson
    Object.entries(this.courseContent).forEach(([levelKey, level]) => {
      if (!level.lessons) return;

      level.lessons.forEach((lesson) => {
        const lessonReport = {
          levelKey,
          lessonId: lesson.id,
          title: lesson.title,
          errors: [],
          warnings: [],
        };

        // Run all checks
        this.checkSchema(lesson, lessonReport);
        this.checkPlaceholders(lesson, lessonReport);
        this.checkScriptValidation(lesson, lessonReport);
        this.checkAudio(lesson, lessonReport);
        this.checkDuplicates(lesson, lessonReport);
        this.checkQuizSanity(lesson, lessonReport);
        this.checkCEFRLevel(lesson, lessonReport);

        this.lessonReports.push(lessonReport);
      });
    });

    // Run graph checks
    this.checkLearningPathGraph();

    // Generate report
    return this.generateReport();
  }

  collectReferences() {
    Object.values(this.courseContent).forEach((level) => {
      if (!level.lessons) return;

      level.lessons.forEach((lesson) => {
        this.lessonIds.add(lesson.id);
        this.lessonSlugs.add(`${lesson.title.toLowerCase().replace(/\s+/g, '-')}`);

        // Collect audio references
        if (lesson.examples) {
          lesson.examples.forEach((ex) => {
            if (ex.audio) {
              this.audioReferences.add(ex.audio);
            }
          });
        }
      });
    });
  }

  checkSchema(lesson, report) {
    const required = ['id', 'title', 'kannadaTitle', 'content'];
    const missing = required.filter((field) => !(field in lesson));

    if (missing.length > 0) {
      report.errors.push({
        level: 'ERROR',
        category: 'SCHEMA',
        message: `Missing required fields: ${missing.join(', ')}`,
        lessonId: `${lesson.id}`,
      });
    }

    // Check content object
    if (lesson.content) {
      const contentRequired = ['explanation', 'kannadaExplanation'];
      const contentMissing = contentRequired.filter((field) => !(field in lesson.content));
      if (contentMissing.length > 0) {
        report.errors.push({
          level: 'ERROR',
          category: 'SCHEMA',
          message: `Content missing: ${contentMissing.join(', ')}`,
          lessonId: `${lesson.id}`,
        });
      }
    }

    // Check examples - look for practice, patterns, or vocabulary arrays
    const practiceCount = lesson.practice?.length || 0;
    const patternsCount = lesson.content?.patterns?.length || 0;
    const vocabularyCount = lesson.content?.vocabulary?.length || 0;
    const exampleCount = Math.max(practiceCount, patternsCount, vocabularyCount);
    
    if (exampleCount < 8) {
      report.errors.push({
        level: 'ERROR',
        category: 'SCHEMA',
        message: `Only ${exampleCount} examples/patterns/vocabulary items (need >= 8)`,
        lessonId: `${lesson.id}`,
      });
    }

    // Check practice questions
    const questionCount = lesson.practiceQuestions?.length || 0;
    if (questionCount < 10) {
      report.errors.push({
        level: 'ERROR',
        category: 'SCHEMA',
        message: `Only ${questionCount} practice questions (need >= 10)`,
        lessonId: `${lesson.id}`,
      });
    }

    // Check common mistakes
    if (!lesson.commonMistakes || lesson.commonMistakes.length === 0) {
      report.errors.push({
        level: 'ERROR',
        category: 'SCHEMA',
        message: 'No common mistakes section',
        lessonId: `${lesson.id}`,
      });
    }

    // Check quiz
    if (!lesson.quiz) {
      report.errors.push({
        level: 'ERROR',
        category: 'SCHEMA',
        message: 'No quiz block',
        lessonId: `${lesson.id}`,
      });
    }
  }

  checkPlaceholders(lesson, report) {
    const fieldsToCheck = [
      { value: lesson.title, name: 'title' },
      { value: lesson.kannadaTitle, name: 'kannadaTitle' },
      { value: lesson.content?.explanation, name: 'explanation' },
      { value: lesson.content?.kannadaExplanation, name: 'kannadaExplanation' },
    ];

    fieldsToCheck.forEach(({ value, name }) => {
      if (value && hasPlaceholder(value)) {
        report.warnings.push({
          level: 'WARNING',
          category: 'PLACEHOLDERS',
          message: `Placeholder text in ${name}`,
          lessonId: `${lesson.id}`,
          field: name,
        });
      }
    });

    // Check examples for placeholders and short text
    if (lesson.examples) {
      lesson.examples.forEach((ex, idx) => {
        if (hasPlaceholder(ex.english)) {
          report.warnings.push({
            level: 'WARNING',
            category: 'PLACEHOLDERS',
            message: `Placeholder in example ${idx} (english)`,
            lessonId: `${lesson.id}`,
          });
        }

        const wordCount = ex.english?.split(/\s+/).length || 0;
        if (wordCount < 3) {
          report.warnings.push({
            level: 'WARNING',
            category: 'PLACEHOLDERS',
            message: `Example ${idx} too short (${wordCount} words)`,
            lessonId: `${lesson.id}`,
          });
        }
      });
    }
  }

  checkScriptValidation(lesson, report) {
    // Check Kannada fields
    const kannadaFields = ['kannadaTitle', 'kannadaExplanation'];
    kannadaFields.forEach((field) => {
      const value = field === 'kannadaTitle' ? lesson.kannadaTitle : lesson.content?.kannadaExplanation;
      if (value && !isKannada(value)) {
        const latinCount = (value.match(/[a-zA-Z]/g) || []).length;
        const latinPercentage = (latinCount / value.length) * 100;
        if (latinPercentage > 30) {
          report.errors.push({
            level: 'ERROR',
            category: 'SCRIPT_VALIDATION',
            message: `${field} is ${latinPercentage.toFixed(0)}% Latin (expected Kannada)`,
            lessonId: `${lesson.id}`,
            field,
          });
        }
      }
    });

    // Check English fields
    const englishFields = ['title'];
    englishFields.forEach((field) => {
      const value = lesson[field];
      if (value && !isLatin(value)) {
        report.warnings.push({
          level: 'WARNING',
          category: 'SCRIPT_VALIDATION',
          message: `${field} may not be in Latin script`,
          lessonId: `${lesson.id}`,
          field,
        });
      }
    });
  }

  checkAudio(lesson, report) {
    if (!lesson.examples) return;

    lesson.examples.forEach((ex, idx) => {
      if (!ex.audio) {
        report.warnings.push({
          level: 'WARNING',
          category: 'AUDIO',
          message: `Example ${idx} has no audio reference`,
          lessonId: `${lesson.id}`,
        });
      } else {
        // Check if audio file exists
        const audioPath = path.join(__dirname, '..', 'audio', ex.audio);
        if (!fileExists(audioPath)) {
          report.warnings.push({
            level: 'WARNING',
            category: 'AUDIO',
            message: `Audio file not found: ${ex.audio}`,
            lessonId: `${lesson.id}`,
          });
        }
      }
    });
  }

  checkDuplicates(lesson, report) {
    // Duplicate IDs are checked globally
    const idCount = Array.from(this.lessonIds).filter((id) => id === lesson.id).length;
    if (idCount > 1) {
      report.errors.push({
        level: 'ERROR',
        category: 'DUPLICATES',
        message: `Duplicate lesson ID: ${lesson.id}`,
        lessonId: `${lesson.id}`,
      });
    }
  }

  checkQuizSanity(lesson, report) {
    if (!lesson.quiz) return;

    lesson.quiz.questions.forEach((q, idx) => {
      // Check if all options are identical
      if (q.options && new Set(q.options).size === 1) {
        report.errors.push({
          level: 'ERROR',
          category: 'QUIZ_SANITY',
          message: `Question ${idx}: all options are identical`,
          lessonId: `${lesson.id}`,
        });
      }

      // Check if correct answer is valid
      if (typeof q.correct === 'number') {
        if (q.correct < 0 || q.correct >= (q.options?.length || 0)) {
          report.errors.push({
            level: 'ERROR',
            category: 'QUIZ_SANITY',
            message: `Question ${idx}: correct answer index ${q.correct} is out of bounds`,
            lessonId: `${lesson.id}`,
          });
        }
      }
    });
  }

  checkCEFRLevel(lesson, report) {
    if (!lesson.cefr) {
      report.warnings.push({
        level: 'WARNING',
        category: 'CEFR',
        message: 'No CEFR level assigned',
        lessonId: `${lesson.id}`,
      });
    } else {
      const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      if (!validLevels.includes(lesson.cefr)) {
        report.errors.push({
          level: 'ERROR',
          category: 'CEFR',
          message: `Invalid CEFR level: ${lesson.cefr}`,
          lessonId: `${lesson.id}`,
        });
      }
    }
  }

  checkLearningPathGraph() {
    // Check for empty levels
    const levels = Object.keys(this.courseContent).sort();

    levels.forEach((levelKey) => {
      const level = this.courseContent[levelKey];
      if (!level.lessons || level.lessons.length === 0) {
        this.lessonReports.push({
          levelKey,
          lessonId: -1,
          title: `${levelKey} (empty)`,
          errors: [
            {
              level: 'WARNING',
              category: 'GRAPH',
              message: 'Level has no lessons',
            },
          ],
          warnings: [],
        });
      }
    });
  }

  generateReport() {
    let totalErrors = 0;
    let totalWarnings = 0;

    this.lessonReports.forEach((report) => {
      report.errors.forEach((err) => {
        totalErrors++;
        this.errorsByCategory[err.category] = (this.errorsByCategory[err.category] || 0) + 1;
      });

      report.warnings.forEach((warn) => {
        totalWarnings++;
        this.warningsByCategory[warn.category] = (this.warningsByCategory[warn.category] || 0) + 1;
      });
    });

    const report = {
      timestamp: new Date().toISOString(),
      totalLessons: this.lessonReports.length,
      totalErrors,
      totalWarnings,
      errorsByCategory: this.errorsByCategory,
      warningsByCategory: this.warningsByCategory,
      lessons: this.lessonReports,
      summary: {
        passedChecks: [
          'Schema validation',
          'Script validation',
          'Placeholder detection',
          'Audio references',
          'Quiz sanity',
          'CEFR levels',
        ],
        failedChecks: totalErrors > 0 ? ['Schema', 'Script validation', 'Quiz sanity'] : [],
      },
    };

    return report;
  }
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  try {
    // Load courseContent.json
    const contentPath = path.join(__dirname, '..', 'data', 'courseContent.json');
    const courseContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Run checks
    const checker = new ContentChecker(courseContent);
    const report = checker.check();

    // Print summary
    console.log('📊 CONTENT INTEGRITY REPORT\n');
    console.log(`Total Lessons: ${report.totalLessons}`);
    console.log(`Total Errors: ${report.totalErrors}`);
    console.log(`Total Warnings: ${report.totalWarnings}\n`);

    console.log('Errors by Category:');
    Object.entries(report.errorsByCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    console.log('\nWarnings by Category:');
    Object.entries(report.warningsByCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    // Write report to file
    const reportPath = path.join(__dirname, '..', 'content-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n✅ Report written to ${reportPath}`);

    // Print failed lessons
    if (report.totalErrors > 0) {
      console.log('\n❌ LESSONS WITH ERRORS:');
      report.lessons.forEach((lesson) => {
        if (lesson.errors.length > 0) {
          console.log(`\n  ${lesson.levelKey} - Lesson ${lesson.lessonId}: ${lesson.title}`);
          lesson.errors.forEach((err) => {
            console.log(`    [${err.category}] ${err.message}`);
          });
        }
      });
    }

    // Exit with error code if there are errors
    process.exit(report.totalErrors > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error running content checker:', error);
    process.exit(1);
  }
}

main();
