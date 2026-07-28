// Kannada Interference Module
// Common errors Kannada speakers make when learning English
// Organized by category with tips for correction

const KANNADA_INTERFERENCE = {
    pronunciation: [
        { pattern: "Confusing /p/ and /f/", example: "'pamily' instead of 'family'", tip: "Kannada has no /f/ sound. Practice biting your lower lip gently for 'f'.", level: 0 },
        { pattern: "Confusing /v/ and /w/", example: "'vater' instead of 'water'", tip: "For /w/, round your lips. For /v/, touch your top teeth to your lower lip.", level: 0 },
        { pattern: "Adding vowels after consonant clusters", example: "'school' → 'ischool', 'station' → 'istation'", tip: "English allows consonant clusters at the start. Practice: sp-, st-, sk-, str-.", level: 0 },
        { pattern: "Silent letters not observed", example: "Pronouncing 'k' in 'knife', 'b' in 'comb'", tip: "English has many silent letters. Learn common ones: knife, know, comb, lamb, Wednesday.", level: 1 },
        { pattern: "Stress on wrong syllable", example: "'de-VE-lop' instead of 'de-VEL-op'", tip: "English is stress-timed. Practice word stress: PHO-to-graph, pho-TO-gra-pher.", level: 3 },
        { pattern: "No distinction between short and long vowels", example: "'ship' vs 'sheep', 'bit' vs 'beat'", tip: "Short /ɪ/ (ship) is relaxed. Long /iː/ (sheep) stretches. Practice pairs.", level: 2 }
    ],
    grammar: [
        { pattern: "Using 'itself' for emphasis", example: "'Bengaluru itself is very big'", tip: "In English, use 'itself' only for reflexive. Say: 'Bengaluru is very big.'", level: 2 },
        { pattern: "Double subjects", example: "'My father he is a teacher'", tip: "Don't repeat the subject. Say: 'My father is a teacher.' OR 'He is a teacher.'", level: 1 },
        { pattern: "'Myself' for introduction", example: "'Myself Ramesh' instead of 'I am Ramesh'", tip: "'Myself' is reflexive only. Always say: 'I am Ramesh' or 'My name is Ramesh.'", level: 1 },
        { pattern: "Missing articles (a, an, the)", example: "'I am teacher' instead of 'I am a teacher'", tip: "Kannada has no articles. Remember: use 'a/an' for one item, 'the' for specific.", level: 2 },
        { pattern: "Wrong preposition usage", example: "'discuss about' instead of 'discuss'", tip: "Some verbs don't need prepositions: discuss (not 'discuss about'), enter (not 'enter into').", level: 4 },
        { pattern: "Using present continuous for habits", example: "'I am going to office daily'", tip: "For habits, use present simple: 'I go to the office daily.' Continuous = right now.", level: 2 },
        { pattern: "Confusing 'since' and 'from'", example: "'I am working here from 2019'", tip: "Use 'since' with present perfect: 'I have been working here since 2019.'", level: 5 },
        { pattern: "Using 'only' misplacement", example: "'I only have two books' (meaning 'just')", tip: "Place 'only' before the word it modifies: 'I have only two books.'", level: 6 },
        { pattern: "Incorrect question tags", example: "'You are coming, isn't it?'", tip: "Match the tag to the subject: 'You are coming, aren't you?' 'She is nice, isn't she?'", level: 5 },
        { pattern: "Using 'no?' as universal tag", example: "'This is good, no?'", tip: "Use proper English tags: 'This is good, isn't it?' 'You like it, don't you?'", level: 3 }
    ],
    vocabulary: [
        { pattern: "Using 'doubt' instead of 'question'", example: "'I have a doubt' instead of 'I have a question'", tip: "'Doubt' means you don't believe something. Use 'question' when you want to ask.", level: 3 },
        { pattern: "Using 'prepone' (not standard English)", example: "'Can we prepone the meeting?'", tip: "'Prepone' is Indian English only. Say: 'Can we move the meeting earlier?'", level: 5 },
        { pattern: "'Do the needful'", example: "'Please do the needful'", tip: "This is outdated British English. Say: 'Please take care of this' or 'Please handle this.'", level: 7 },
        { pattern: "'Revert back'", example: "'I will revert back to you'", tip: "'Revert' already means 'go back.' Say: 'I will get back to you' or 'I will reply.'", level: 5 },
        { pattern: "'Out of station'", example: "'I am out of station'", tip: "Say: 'I am out of town' or 'I am traveling.' 'Out of station' is Indian English.", level: 5 },
        { pattern: "Saying 'passed out' for graduation", example: "'I passed out from college in 2020'", tip: "'Passed out' means fainted! Say: 'I graduated from college in 2020.'", level: 4 }
    ],
    wordOrder: [
        { pattern: "Kannada SOV → English SVO", example: "'I temple to went' instead of 'I went to the temple'", tip: "Kannada: Subject-Object-Verb. English: Subject-Verb-Object. Verb comes BEFORE object.", level: 1 },
        { pattern: "Adjective placement", example: "'Saree silk' instead of 'silk saree'", tip: "In English, adjectives come BEFORE nouns: 'big house', 'red car', 'silk saree'.", level: 2 },
        { pattern: "Question word order", example: "'You are going where?' instead of 'Where are you going?'", tip: "English questions: WH-word + auxiliary + subject + verb. 'Where are you going?'", level: 2 }
    ]
};

// Get interference tips relevant to a specific level
function getInterferenceForLevel(level) {
    const tips = [];
    Object.entries(KANNADA_INTERFERENCE).forEach(([category, items]) => {
        items.forEach(item => {
            if (item.level <= level) {
                tips.push({ ...item, category });
            }
        });
    });
    return tips;
}

// Get random tip for a level
function getRandomInterferenceTip(level) {
    const tips = getInterferenceForLevel(level);
    if (tips.length === 0) return null;
    return tips[Math.floor(Math.random() * tips.length)];
}

// Get tips by category for a level
function getInterferenceByCategory(level, category) {
    return (KANNADA_INTERFERENCE[category] || []).filter(item => item.level <= level);
}

// Export for use in app
window.KannadaInterference = {
    data: KANNADA_INTERFERENCE,
    getForLevel: getInterferenceForLevel,
    getRandomTip: getRandomInterferenceTip,
    getByCategory: getInterferenceByCategory
};
