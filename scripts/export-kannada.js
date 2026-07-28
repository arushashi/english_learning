#!/usr/bin/env node

/**
 * Export Kannada Text for Human Review
 * Exports all kannadaTitle and kannadaExplanation fields to CSV
 */

const fs = require('fs');
const path = require('path');

function main() {
  try {
    // Load courseContent.json
    const contentPath = path.join(__dirname, '..', 'data', 'courseContent.json');
    const courseContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Collect all Kannada text
    const rows = [];
    rows.push(['Lesson ID', 'Level', 'English Title', 'Field', 'Kannada Text']);

    Object.entries(courseContent).forEach(([levelKey, level]) => {
      if (!level.lessons) return;

      level.lessons.forEach((lesson) => {
        // Export kannadaTitle
        rows.push([
          lesson.id,
          levelKey,
          lesson.title,
          'kannadaTitle',
          lesson.kannadaTitle || '',
        ]);

        // Export kannadaExplanation
        if (lesson.content?.kannadaExplanation) {
          rows.push([
            lesson.id,
            levelKey,
            lesson.title,
            'kannadaExplanation',
            lesson.content.kannadaExplanation,
          ]);
        }
      });
    });

    // Write CSV
    const csvPath = path.join(__dirname, '..', 'kannada-text-review.csv');
    const csvContent = rows.map((row) => {
      return row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(cell).replace(/"/g, '""');
          return escaped.includes(',') ? `"${escaped}"` : escaped;
        })
        .join(',');
    }).join('\n');

    fs.writeFileSync(csvPath, csvContent, 'utf-8');
    console.log(`✅ Kannada text exported to ${csvPath}`);
    console.log(`Total rows: ${rows.length - 1} (excluding header)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting Kannada text:', error);
    process.exit(1);
  }
}

main();
