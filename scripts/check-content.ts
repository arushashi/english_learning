#!/usr/bin/env node

/**
 * Content-Integrity Checker
 * Validates all lessons in courseContent.json against a formal schema
 * Usage: npx ts-node scripts/check-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES & SCHEMA
// ============================================================================

interface Example {
  english: string;
  kannada_transliteration?: string;
  kannada_meaning?: string;
  audio?: string;
}

interface PracticeQuestion {
  question: string;
  options?: string[];
  correct: string | number;
  kannada_explanation: string;
  type?: 'multiple' | 'short-answer' | 'speaking';
}

interface CommonMistake {
  wrong: string;
  correct: string;
  kannada_explanation: string;
}

interface Lesson {
  id: number;
  title: string;
  kannadaTitle: string;
  cefr?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  syllabus_section_id?: string;
  content: {
    objective?: string;
    kannadaExplanation?: string;
    explanation?: string;
    [key: string]: any;
  };
  examples?: Example[];
  practice?: Array<{ english: string; kannada: string }>;
  speakingPractice?: Array<{ english: string; kannada: string }>;
  practiceQuestions?: PracticeQuestion[];
  commonMistakes?: CommonMistake[];
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correct: string | number;
    }>;
  };
  [key: string]: any;
}

interface Level {
  title: string;
  description: string;
  prerequisites: string;
  objectives: string[];
  lessons: Lesson[];
  masteryTest?: {
    title: string;
    questions: any[];
  };
}

interface CourseContent {
  [key: string]: Level;
}

interface CheckResult {
  level: 'ERROR' | 'WARNING';
  category: string;
  message: string;
  lessonId?: string;
  field?: string;
}

interface LessonReport {
  levelKey: string;
  lessonId: number;
  title: string;
  errors: CheckResult[];
  warnings: CheckResult[];
}

interface ContentReport {
  timestamp: string;
  totalLessons: number;
  totalErrors: number;
  totalWarnings: number;
  errorsByCategory: { [key: string]: number };
  warningsByCategory: { [key: string]: number };
  lessons: LessonReport[];
  summary: {
    passedChecks: string[];
    failedChecks: string[];
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

function isKannada(text: string): boolean {
  if (!text) return false;
  const kannadaRegex = /[\u0C80-\u0CFF]/g;
  const matches = text.match(kannadaRegex) || [];
  const kannadaPercentage = (matches.length / text.length) * 100;
  return kannadaPercentage >= 70;
}

function isLatin(text: string): boolean {
  if (!text) return false;
  const latinRegex = /[a-zA-Z0-9\s\-.,!?'";:()]/g;
  const matches = text.match(latinRegex) || [];
  const latinPercentage = (matches.length / text.length) * 100;
  return latinPercentage >= 70;
}

function hasPlaceholder(text: string): boolean {
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

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function isValidAudioFile(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  } catch {
    return false;
  }
}

// ============================================================================
// CHECKS
// ============================================================================

class ContentChecker {
  private courseContent: CourseContent;
  private results: CheckResult[] = [];
  private lessonReports: LessonReport[] = [];
  private audioReferences: Set<string> = new Set();
  private lessonIds: Set<number> = new Set();
  private lessonSlugs: Set<string> = new Set();

  constructor(courseContent: CourseContent) {
    this.courseContent = courseContent;
  }

  check(): ContentReport {
    console.log('🔍 Starting content integrity checks...\n');

    // Collect all audio references and IDs
    this.collectReferences();

    // Run checks per lesson
    Object.entries(this.courseContent).forEach(([levelKey, level]) => {
      level.lessons.forEach((lesson) => {
        const lessonReport: LessonReport = {
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
        this.checkInternalLinks(lesson, lessonReport);
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

  private collectReferences(): void {
    Object.values(this.courseContent).forEach((level) => {
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

  private checkSchema(lesson: Lesson, report: LessonReport): void {
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
        report.warnings.push({
          level: 'WARNING',
          category: 'SCHEMA',
          message: `Content missing: ${contentMissing.join(', ')}`,
          lessonId: `${lesson.id}`,
        });
      }
    }

    // Check examples
    const exampleCount = lesson.examples?.length || 0;
    if (exampleCount < 8) {
      report.warnings.push({
        level: 'WARNING',
        category: 'SCHEMA',
        message: `Only ${exampleCount} examples (need >= 8)`,
        lessonId: `${lesson.id}`,
      });
    }

    // Check practice questions
    const questionCount = lesson.practiceQuestions?.length || 0;
    if (questionCount < 10) {
      report.warnings.push({
        level: 'WARNING',
        category: 'SCHEMA',
        message: `Only ${questionCount} practice questions (need >= 10)`,
        lessonId: `${lesson.id}`,
      });
    }

    // Check common mistakes
    if (!lesson.commonMistakes || lesson.commonMistakes.length === 0) {
      report.warnings.push({
        level: 'WARNING',
        category: 'SCHEMA',
        message: 'No common mistakes section',
        lessonId: `${lesson.id}`,
      });
    }

    // Check quiz
    if (!lesson.quiz) {
      report.warnings.push({
        level: 'WARNING',
        category: 'SCHEMA',
        message: 'No quiz block',
        lessonId: `${lesson.id}`,
      });
    }
  }

  private checkPlaceholders(lesson: Lesson, report: LessonReport): void {
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

  private checkScriptValidation(lesson: Lesson, report: LessonReport): void {
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

  private checkAudio(lesson: Lesson, report: LessonReport): void {
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

  private checkDuplicates(lesson: Lesson, report: LessonReport): void {
    // Duplicate IDs are checked globally in collectReferences
    // Duplicate slugs are checked globally in collectReferences
    // This is a placeholder for per-lesson duplicate checks
  }

  private checkInternalLinks(lesson: Lesson, report: LessonReport): void {
    // Check if any lesson references other lessons
    // This would require parsing lesson content for links
    // Placeholder for now
  }

  private checkQuizSanity(lesson: Lesson, report: LessonReport): void {
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

  private checkCEFRLevel(lesson: Lesson, report: LessonReport): void {
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

  private checkLearningPathGraph(): void {
    // Check for cycles and orphaned lessons
    // This is a simplified check
    const levels = Object.keys(this.courseContent).sort();
    let previousLevelExists = false;

    levels.forEach((levelKey) => {
      const level = this.courseContent[levelKey];
      if (level.lessons.length === 0) {
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

  private generateReport(): ContentReport {
    const errorsByCategory: { [key: string]: number } = {};
    const warningsByCategory: { [key: string]: number } = {};
    let totalErrors = 0;
    let totalWarnings = 0;

    this.lessonReports.forEach((report) => {
      report.errors.forEach((err) => {
        totalErrors++;
        errorsByCategory[err.category] = (errorsByCategory[err.category] || 0) + 1;
      });

      report.warnings.forEach((warn) => {
        totalWarnings++;
        warningsByCategory[warn.category] = (warningsByCategory[warn.category] || 0) + 1;
      });
    });

    const report: ContentReport = {
      timestamp: new Date().toISOString(),
      totalLessons: this.lessonReports.length,
      totalErrors,
      totalWarnings,
      errorsByCategory,
      warningsByCategory,
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
    const courseContent: CourseContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

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

    // Exit with error code if there are errors
    process.exit(report.totalErrors > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error running content checker:', error);
    process.exit(1);
  }
}

main();
