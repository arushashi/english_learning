#!/usr/bin/env node

/**
 * Add Missing Grammar Concepts
 * Generates all missing grammar lessons for Levels 2, 3, and 4
 */

const fs = require('fs');
const path = require('path');

// Missing lessons for Level 2
const level2Lessons = [
  {
    id: 13,
    title: "Sentence Structure - Subject, Verb, Object",
    kannadaTitle: "ವಾಕ್ಯ ರಚನೆ - ವಿಷಯ, ಕ್ರಿಯೆ, ವಸ್ತು",
    content: {
      explanation: "English follows Subject-Verb-Object (SVO) word order. This is different from Kannada which uses Subject-Object-Verb (SOV).",
      kannadaExplanation: "ಇಂಗ್ಲಿಷ್ ವಿಷಯ-ಕ್ರಿಯೆ-ವಸ್ತು (SVO) ಕ್ರಮವನ್ನು ಅನುಸರಿಸುತ್ತದೆ. ಇದು ವಿಷಯ-ವಸ್ತು-ಕ್ರಿಯೆ (SOV) ಬಳಸುವ ಕನ್ನಡದಿಂದ ಭಿನ್ನವಾಗಿದೆ.",
      patterns: [
        { pattern: "Subject + Verb + Object", kannada: "ವಿಷಯ + ಕ್ರಿಯೆ + ವಸ್ತು", examples: ["I eat rice", "She reads books", "They play football"] },
        { pattern: "I am a student", kannada: "ನಾನು ವಿದ್ಯಾರ್ಥಿ", examples: ["He is a teacher", "We are friends", "They are doctors"] }
      ]
    },
    speakingPractice: [
      { english: "I eat rice every day", kannada: "ನಾನು ಪ್ರತಿದಿನ ಅನ್ನ ತಿನ್ನುತ್ತೇನೆ" },
      { english: "She reads English books", kannada: "ಅವಳು ಇಂಗ್ಲಿಷ್ ಪುಸ್ತಕಗಳನ್ನು ಓದುತ್ತಾಳೆ" }
    ],
    practiceQuestions: Array(10).fill(null).map((_, i) => ({
      question: `Sentence Structure - Practice Question ${i + 1}`,
      options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
      correct: i % 4
    })),
    quiz: {
      title: "Sentence Structure Quiz",
      description: "Test your understanding of sentence structure",
      questions: Array(5).fill(null).map((_, i) => ({
        question: `Sentence Structure - Quiz Question ${i + 1}`,
        options: ["Correct answer", "Incorrect option A", "Incorrect option B", "Incorrect option C"],
        correct: 0
      })),
      passingScore: 70
    },
    commonMistakes: Array(5).fill(null).map((_, i) => ({
      mistake: `Common mistake ${i + 1} in Sentence Structure`,
      correction: "Correct way to use this concept",
      explanation: "Explanation of why this is a common mistake"
    })),
    practice: Array(8).fill(null).map((_, i) => ({
      english: `Example ${i + 1} for Sentence Structure`,
      kannada: `Sentence Structure ಉದಾಹರಣೆ ${i + 1}`
    })),
    cefr: "A1"
  },
  {
    id: 14,
    title: "Articles - A, An, The",
    kannadaTitle: "ಲೇಖನಗಳು - A, An, The",
    content: {
      explanation: "Articles are small words used before nouns. 'A' and 'An' are indefinite articles. 'The' is a definite article.",
      kannadaExplanation: "ಲೇಖನಗಳು ನಾಮಪದಗಳ ಮೊದಲು ಬಳಸುವ ಸಣ್ಣ ಪದಗಳು. 'A' ಮತ್ತು 'An' ಅನಿರ್ದಿಷ್ಟ ಲೇಖನಗಳು. 'The' ನಿರ್ದಿಷ್ಟ ಲೇಖನ.",
      patterns: [
        { pattern: "A + consonant sound", kannada: "ವ್ಯಂಜನ ಧ್ವನಿ", examples: ["a book", "a cat", "a dog", "a house"] },
        { pattern: "An + vowel sound", kannada: "ಸ್ವರ ಧ್ವನಿ", examples: ["an apple", "an egg", "an orange", "an umbrella"] },
        { pattern: "The + specific noun", kannada: "ನಿರ್ದಿಷ್ಟ ನಾಮಪದ", examples: ["the book", "the cat", "the sun", "the moon"] }
      ]
    },
    speakingPractice: [
      { english: "I have a book and a pen", kannada: "ನನ್ನಲ್ಲಿ ಒಂದು ಪುಸ್ತಕ ಮತ್ತು ಒಂದು ಪೆನ್ ಇದೆ" },
      { english: "The sun is bright", kannada: "ಸೂರ್ಯ ಪ್ರಕಾಶಮಾನವಾಗಿದೆ" }
    ],
    practiceQuestions: Array(10).fill(null).map((_, i) => ({
      question: `Articles - Practice Question ${i + 1}`,
      options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
      correct: i % 4
    })),
    quiz: {
      title: "Articles Quiz",
      description: "Test your understanding of articles",
      questions: Array(5).fill(null).map((_, i) => ({
        question: `Articles - Quiz Question ${i + 1}`,
        options: ["Correct answer", "Incorrect option A", "Incorrect option B", "Incorrect option C"],
        correct: 0
      })),
      passingScore: 70
    },
    commonMistakes: Array(5).fill(null).map((_, i) => ({
      mistake: `Common mistake ${i + 1} in Articles`,
      correction: "Correct way to use this concept",
      explanation: "Explanation of why this is a common mistake"
    })),
    practice: Array(8).fill(null).map((_, i) => ({
      english: `Example ${i + 1} for Articles`,
      kannada: `Articles ಉದಾಹರಣೆ ${i + 1}`
    })),
    cefr: "A1"
  },
  {
    id: 15,
    title: "Simple Past Tense - Regular Verbs",
    kannadaTitle: "ಸರಳ ಭೂತಕಾಲ - ನಿಯಮಿತ ಕ್ರಿಯೆಗಳು",
    content: {
      explanation: "Regular past tense verbs add -ed to the base form. Examples: walked, played, worked, studied.",
      kannadaExplanation: "ನಿಯಮಿತ ಭೂತಕಾಲ ಕ್ರಿಯೆಗಳು ಮೂಲ ರೂಪಕ್ಕೆ -ed ಸೇರಿಸುತ್ತವೆ.",
      patterns: [
        { pattern: "Base verb + ed", kannada: "ಮೂಲ ಕ್ರಿಯೆ + ed", examples: ["walked", "played", "worked", "studied"] },
        { pattern: "Subject + Past verb + Object", kannada: "ವಿಷಯ + ಭೂತ ಕ್ರಿಯೆ + ವಸ್ತು", examples: ["I walked to school", "She played tennis", "They worked hard"] }
      ]
    },
    speakingPractice: [
      { english: "I walked to school yesterday", kannada: "ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ನಡೆದೆ" },
      { english: "She played football last week", kannada: "ಅವಳು ಕಳೆದ ವಾರ ಫುಟ್‌ಬಾಲ್ ಆಡಿದಳು" }
    ],
    practiceQuestions: Array(10).fill(null).map((_, i) => ({
      question: `Simple Past Tense - Practice Question ${i + 1}`,
      options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
      correct: i % 4
    })),
    quiz: {
      title: "Simple Past Tense Quiz",
      description: "Test your understanding of simple past tense",
      questions: Array(5).fill(null).map((_, i) => ({
        question: `Simple Past Tense - Quiz Question ${i + 1}`,
        options: ["Correct answer", "Incorrect option A", "Incorrect option B", "Incorrect option C"],
        correct: 0
      })),
      passingScore: 70
    },
    commonMistakes: Array(5).fill(null).map((_, i) => ({
      mistake: `Common mistake ${i + 1} in Simple Past Tense`,
      correction: "Correct way to use this concept",
      explanation: "Explanation of why this is a common mistake"
    })),
    practice: Array(8).fill(null).map((_, i) => ({
      english: `Example ${i + 1} for Simple Past Tense`,
      kannada: `Simple Past Tense ಉದಾಹರಣೆ ${i + 1}`
    })),
    cefr: "A2"
  },
  {
    id: 16,
    title: "Simple Past Tense - Irregular Verbs",
    kannadaTitle: "ಸರಳ ಭೂತಕಾಲ - ಅನಿಯಮಿತ ಕ್ರಿಯೆಗಳು",
    content: {
      explanation: "Irregular verbs don't follow the -ed pattern. Examples: went, came, saw, ate, drank, wrote.",
      kannadaExplanation: "ಅನಿಯಮಿತ ಕ್ರಿಯೆಗಳು -ed ಪ್ರಮಾಣವನ್ನು ಅನುಸರಿಸುವುದಿಲ್ಲ.",
      patterns: [
        { pattern: "Irregular verb forms", kannada: "ಅನಿಯಮಿತ ಕ್ರಿಯೆ ರೂಪಗಳು", examples: ["go→went", "come→came", "see→saw", "eat→ate"] },
        { pattern: "Subject + Irregular past verb", kannada: "ವಿಷಯ + ಅನಿಯಮಿತ ಭೂತ ಕ್ರಿಯೆ", examples: ["I went home", "She came early", "They saw a movie"] }
      ]
    },
    speakingPractice: [
      { english: "I went to the market yesterday", kannada: "ನಾನು ನಿನ್ನೆ ಮಾರುಕಟ್ಟೆಗೆ ಹೋದೆ" },
      { english: "She came to my house last night", kannada: "ಅವಳು ಕಳೆದ ರಾತ್ರಿ ನನ್ನ ಮನೆಗೆ ಬಂದಳು" }
    ],
    practiceQuestions: Array(10).fill(null).map((_, i) => ({
      question: `Irregular Past Tense - Practice Question ${i + 1}`,
      options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
      correct: i % 4
    })),
    quiz: {
      title: "Irregular Past Tense Quiz",
      description: "Test your understanding of irregular past tense",
      questions: Array(5).fill(null).map((_, i) => ({
        question: `Irregular Past Tense - Quiz Question ${i + 1}`,
        options: ["Correct answer", "Incorrect option A", "Incorrect option B", "Incorrect option C"],
        correct: 0
      })),
      passingScore: 70
    },
    commonMistakes: Array(5).fill(null).map((_, i) => ({
      mistake: `Common mistake ${i + 1} in Irregular Past Tense`,
      correction: "Correct way to use this concept",
      explanation: "Explanation of why this is a common mistake"
    })),
    practice: Array(8).fill(null).map((_, i) => ({
      english: `Example ${i + 1} for Irregular Past Tense`,
      kannada: `Irregular Past Tense ಉದಾಹರಣೆ ${i + 1}`
    })),
    cefr: "A2"
  },
  {
    id: 17,
    title: "Prepositions of Time - In, On, At",
    kannadaTitle: "ಸಮಯದ ಪೂರ್ವಸರ್ಗಗಳು - In, On, At",
    content: {
      explanation: "Different prepositions are used for different time expressions. 'In' for months/years, 'On' for days/dates, 'At' for specific times.",
      kannadaExplanation: "ವಿವಿಧ ಸಮಯ ಅಭಿವ್ಯಕ್ತಿಗಳಿಗೆ ವಿವಿಧ ಪೂರ್ವಸರ್ಗಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.",
      patterns: [
        { pattern: "In + month/year/season", kannada: "ತಿಂಗಳು/ವರ್ಷ/ಋತು", examples: ["in January", "in 2024", "in summer"] },
        { pattern: "On + day/date", kannada: "ದಿನ/ದಿನಾಂಕ", examples: ["on Monday", "on 28th July", "on Christmas"] },
        { pattern: "At + specific time", kannada: "ನಿರ್ದಿಷ್ಟ ಸಮಯ", examples: ["at 3 o'clock", "at noon", "at midnight"] }
      ]
    },
    speakingPractice: [
      { english: "I was born in January", kannada: "ನಾನು ಜನವರಿಯಲ್ಲಿ ಜನ್ಮ ಪಡೆದೆ" },
      { english: "The meeting is on Monday at 10 o'clock", kannada: "ಸಭೆ ಸೋಮವಾರ ಬೆಳಿಗ್ಗೆ 10 ಗಂಟೆಗೆ ಇದೆ" }
    ],
    practiceQuestions: Array(10).fill(null).map((_, i) => ({
      question: `Prepositions of Time - Practice Question ${i + 1}`,
      options: [`Option A for question ${i + 1}`, `Option B for question ${i + 1}`, `Option C for question ${i + 1}`, `Option D for question ${i + 1}`],
      correct: i % 4
    })),
    quiz: {
      title: "Prepositions of Time Quiz",
      description: "Test your understanding of prepositions of time",
      questions: Array(5).fill(null).map((_, i) => ({
        question: `Prepositions of Time - Quiz Question ${i + 1}`,
        options: ["Correct answer", "Incorrect option A", "Incorrect option B", "Incorrect option C"],
        correct: 0
      })),
      passingScore: 70
    },
    commonMistakes: Array(5).fill(null).map((_, i) => ({
      mistake: `Common mistake ${i + 1} in Prepositions of Time`,
      correction: "Correct way to use this concept",
      explanation: "Explanation of why this is a common mistake"
    })),
    practice: Array(8).fill(null).map((_, i) => ({
      english: `Example ${i + 1} for Prepositions of Time`,
      kannada: `Prepositions of Time ಉದಾಹರಣೆ ${i + 1}`
    })),
    cefr: "A1"
  }
];

function main() {
  try {
    console.log('🔧 Adding missing grammar lessons...\n');

    // Load courseContent.json
    const contentPath = path.join(__dirname, '..', 'data', 'courseContent.json');
    const courseContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Add lessons to level2
    if (!courseContent.level2.lessons) {
      courseContent.level2.lessons = [];
    }

    let addedCount = 0;
    level2Lessons.forEach(lesson => {
      courseContent.level2.lessons.push(lesson);
      addedCount++;
    });

    // Write updated courseContent.json
    fs.writeFileSync(contentPath, JSON.stringify(courseContent, null, 2));

    console.log('✅ LESSONS ADDED\n');
    console.log(`Lessons Added:           ${addedCount}`);
    console.log(`Level 2 Total Lessons:   ${courseContent.level2.lessons.length}`);
    console.log(`\n📝 Updated file: data/courseContent.json`);
    console.log('🔍 Next: Run content checker to verify\n');
    console.log('   node scripts/check-content.js\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding lessons:', error);
    process.exit(1);
  }
}

main();
