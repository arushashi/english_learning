#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function mk(id,title,kt,exp,kexp,pats,sp,cefr){
  return {id,title,kannadaTitle:kt,content:{explanation:exp,kannadaExplanation:kexp,patterns:pats},
    speakingPractice:sp,
    practiceQuestions:Array.from({length:10},(_,i)=>({question:`${title} - Q${i+1}`,options:["A","B","C","D"],correct:i%4})),
    quiz:{title:`${title} Quiz`,description:`Test ${title}`,questions:Array.from({length:5},(_,i)=>({question:`${title} - Quiz ${i+1}`,options:["Correct","Wrong A","Wrong B","Wrong C"],correct:0})),passingScore:70},
    commonMistakes:Array.from({length:5},(_,i)=>({mistake:`Mistake ${i+1} in ${title}`,correction:"Correct usage",explanation:"Why wrong"})),
    practice:Array.from({length:8},(_,i)=>({english:`Example ${i+1} for ${title}`,kannada:`${title} ಉದಾಹರಣೆ ${i+1}`})),
    cefr};
}

const contentPath = path.join(__dirname,'..','data','courseContent.json');
const cc = JSON.parse(fs.readFileSync(contentPath,'utf-8'));

// LEVEL 6: Add Expressing Emotions, Linking Words (13-18)
const l6 = [
  mk(13,"Linking Words - Addition and Contrast","ಸಂಪರ್ಕ ಪದಗಳು - ಸೇರ್ಪಡೆ ಮತ್ತು ವ್ಯತಿರಿಕ್ತ",
    "Addition: also, moreover, furthermore, in addition. Contrast: however, nevertheless, on the other hand, although.",
    "ಸೇರ್ಪಡೆ: also, moreover, furthermore. ವ್ಯತಿರಿಕ್ತ: however, nevertheless, although.",
    [{pattern:"Addition",kannada:"ಸೇರ್ಪಡೆ",examples:["She is smart. Also, she is kind.","Moreover, he is hardworking","Furthermore, the price is low","In addition, it has a garden"]},
     {pattern:"Contrast",kannada:"ವ್ಯತಿರಿಕ್ತ",examples:["However, it was expensive","Nevertheless, I bought it","On the other hand, it rains a lot","Although it was cold, we went out"]},
     {pattern:"Cause/Effect",kannada:"ಕಾರಣ/ಪರಿಣಾಮ",examples:["Therefore, I stayed home","As a result, she was late","Consequently, they failed","Due to rain, the match was cancelled"]}],
    [{english:"She is kind. Moreover, she is hardworking",kannada:"ಅವಳು ದಯಾಳು. ಇದಲ್ಲದೆ, ಅವಳು ಶ್ರಮಶೀಲಳು"},{english:"However, I disagree with this",kannada:"ಆದಾಗ್ಯೂ, ನಾನು ಇದನ್ನು ಒಪ್ಪುವುದಿಲ್ಲ"}],"B1"),

  mk(14,"Expressing Emotions","ಭಾವನೆಗಳನ್ನು ವ್ಯಕ್ತಪಡಿಸುವುದು",
    "Learn to express happiness, sadness, anger, surprise, fear, excitement in English.",
    "ಸಂತೋಷ, ದುಃಖ, ಕೋಪ, ಆಶ್ಚರ್ಯ, ಭಯ, ಉತ್ಸಾಹವನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ವ್ಯಕ್ತಪಡಿಸಿ.",
    [{pattern:"Happiness",kannada:"ಸಂತೋಷ",examples:["I'm so happy!","I'm thrilled!","That's wonderful!","I'm delighted!"]},
     {pattern:"Sadness/Anger",kannada:"ದುಃಖ/ಕೋಪ",examples:["I feel sad","I'm disappointed","I'm frustrated","I'm upset about this"]},
     {pattern:"Surprise/Fear",kannada:"ಆಶ್ಚರ್ಯ/ಭಯ",examples:["I'm shocked!","Really? That's amazing!","I'm afraid of...","I'm worried about..."]}],
    [{english:"I am so happy to see you!",kannada:"ನಿಮ್ಮನ್ನು ನೋಡಿ ತುಂಬಾ ಸಂತೋಷ!"},{english:"I am worried about the exam",kannada:"ಪರೀಕ್ಷೆ ಬಗ್ಗೆ ನಾನು ಚಿಂತಿತ"}],"B1"),

  mk(15,"Relative Clauses - Who, Which, That","ಸಂಬಂಧಿತ ಉಪವಾಕ್ಯ",
    "Relative clauses give extra info about nouns. Who=people, Which=things, That=both. Where=places, When=times.",
    "ಸಂಬಂಧಿತ ಉಪವಾಕ್ಯಗಳು ನಾಮಪದಗಳ ಬಗ್ಗೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ನೀಡುತ್ತವೆ.",
    [{pattern:"Who (people)",kannada:"Who (ಜನರು)",examples:["The man who lives next door","The teacher who taught me","People who work hard succeed"]},
     {pattern:"Which (things)",kannada:"Which (ವಸ್ತುಗಳು)",examples:["The book which I read","The car which is red","The movie which we watched"]},
     {pattern:"That/Where/When",kannada:"That/Where/When",examples:["The food that I like","The place where I was born","The day when we met"]}],
    [{english:"The man who lives next door is a doctor",kannada:"ಪಕ್ಕದ ಮನೆಯಲ್ಲಿ ವಾಸಿಸುವ ಮನುಷ್ಯ ವೈದ್ಯ"},{english:"This is the book which I bought yesterday",kannada:"ಇದು ನಾನು ನಿನ್ನೆ ಕೊಂಡ ಪುಸ್ತಕ"}],"B1"),

  mk(16,"Conditional Sentences - Type 0 and 1","ಷರತ್ತು ವಾಕ್ಯಗಳು - ಪ್ರಕಾರ 0 ಮತ್ತು 1",
    "Type 0: If + present, present (facts/always true). Type 1: If + present, will + base (real/possible future).",
    "ಪ್ರಕಾರ 0: ಸತ್ಯ/ಯಾವಾಗಲೂ ನಿಜ. ಪ್ರಕಾರ 1: ನೈಜ/ಸಾಧ್ಯ ಭವಿಷ್ಯ.",
    [{pattern:"Type 0 (facts)",kannada:"ಪ್ರಕಾರ 0 (ಸತ್ಯ)",examples:["If you heat water, it boils","If it rains, the ground gets wet","If you mix red and blue, you get purple"]},
     {pattern:"Type 1 (real future)",kannada:"ಪ್ರಕಾರ 1 (ನೈಜ ಭವಿಷ್ಯ)",examples:["If it rains, I will take an umbrella","If you study, you will pass","If she calls, I will answer"]},
     {pattern:"Unless (=if not)",kannada:"Unless (=ಇಲ್ಲದಿದ್ದರೆ)",examples:["Unless you study, you will fail","Unless it rains, we will go","Unless she calls, I won't go"]}],
    [{english:"If it rains tomorrow, I will stay home",kannada:"ನಾಳೆ ಮಳೆ ಬಂದರೆ ನಾನು ಮನೆಯಲ್ಲೇ ಇರುತ್ತೇನೆ"},{english:"If you study hard, you will pass the exam",kannada:"ನೀವು ಕಷ್ಟಪಟ್ಟು ಓದಿದರೆ ಪರೀಕ್ಷೆ ಪಾಸ್ ಆಗುತ್ತೀರಿ"}],"B1"),

  mk(17,"Conditional Sentences - Type 2 and 3","ಷರತ್ತು ವಾಕ್ಯಗಳು - ಪ್ರಕಾರ 2 ಮತ್ತು 3",
    "Type 2: If + past, would + base (unreal present). Type 3: If + past perfect, would have + pp (unreal past).",
    "ಪ್ರಕಾರ 2: ಅವಾಸ್ತವ ಪ್ರಸ್ತುತ. ಪ್ರಕಾರ 3: ಅವಾಸ್ತವ ಭೂತ.",
    [{pattern:"Type 2 (unreal present)",kannada:"ಪ್ರಕಾರ 2 (ಅವಾಸ್ತವ ಪ್ರಸ್ತುತ)",examples:["If I were rich, I would travel","If she had time, she would help","If I knew the answer, I would tell you"]},
     {pattern:"Type 3 (unreal past)",kannada:"ಪ್ರಕಾರ 3 (ಅವಾಸ್ತವ ಭೂತ)",examples:["If I had studied, I would have passed","If she had called, I would have helped","If they had known, they would have come"]},
     {pattern:"Mixed conditionals",kannada:"ಮಿಶ್ರ ಷರತ್ತು",examples:["If I had studied harder, I would be a doctor now","If she were smarter, she would have passed"]}],
    [{english:"If I were you, I would study English",kannada:"ನಾನು ನಿಮ್ಮ ಸ್ಥಳದಲ್ಲಿದ್ದರೆ ಇಂಗ್ಲಿಷ್ ಓದುತ್ತಿದ್ದೆ"},{english:"If I had known, I would have helped",kannada:"ನನಗೆ ಗೊತ್ತಿದ್ದರೆ ಸಹಾಯ ಮಾಡುತ್ತಿದ್ದೆ"}],"B2"),

  mk(18,"Level 6 Comprehensive Test","ಲೆವೆಲ್ 6 ಸಮಗ್ರ ಪರೀಕ್ಷೆ",
    "Test: Linking words, Emotions, Relative clauses, Conditional sentences.",
    "ಎಲ್ಲಾ ಲೆವೆಲ್ 6 ವಿಷಯಗಳ ಪರೀಕ್ಷೆ.",
    [{pattern:"All Level 6",kannada:"ಎಲ್ಲಾ ಲೆವೆಲ್ 6",examples:["Linking words","Emotions","Relative clauses","Conditionals"]}],
    [{english:"I am ready for Level 7",kannada:"ನಾನು ಲೆವೆಲ್ 7 ಗೆ ಸಿದ್ಧ"}],"B2")
];
cc.level6.lessons.push(...l6);
console.log(`Level 6: Added ${l6.length} → total ${cc.level6.lessons.length}`);

// LEVEL 8: Add Gerunds/Infinitives, Tag Questions, Causatives, Direct/Indirect Speech, All Tenses Review (16-25)
const l8 = [
  mk(16,"Gerunds and Infinitives","ಜೆರಂಡ್ ಮತ್ತು ಇನ್ಫಿನಿಟಿವ್",
    "Gerund=verb+-ing as noun. Infinitive=to+verb. Some verbs take gerund, some infinitive, some both.",
    "ಜೆರಂಡ್=ನಾಮಪದವಾಗಿ ಕ್ರಿಯೆ+-ing. ಇನ್ಫಿನಿಟಿವ್=to+ಕ್ರಿಯೆ.",
    [{pattern:"Gerund as subject/object",kannada:"ವಿಷಯ/ವಸ್ತುವಾಗಿ",examples:["Swimming is fun","I enjoy reading","She loves cooking","Running is healthy"]},
     {pattern:"Infinitive after verbs",kannada:"ಕ್ರಿಯೆ ನಂತರ",examples:["I want to learn","She decided to go","They agreed to help","He promised to come"]},
     {pattern:"Verbs + gerund only",kannada:"ಜೆರಂಡ್ ಮಾತ್ರ",examples:["enjoy+-ing","avoid+-ing","finish+-ing","mind+-ing","suggest+-ing"]}],
    [{english:"I enjoy learning English",kannada:"ನನಗೆ ಇಂಗ್ಲಿಷ್ ಕಲಿಯುವುದು ಇಷ್ಟ"},{english:"She decided to study medicine",kannada:"ಅವಳು ವೈದ್ಯಕೀಯ ಓದಲು ನಿರ್ಧರಿಸಿದಳು"}],"B2"),

  mk(17,"Tag Questions","ಟ್ಯಾಗ್ ಪ್ರಶ್ನೆಗಳು",
    "Short questions at end of statements. Positive+negative tag. Negative+positive tag.",
    "ಹೇಳಿಕೆಗಳ ಕೊನೆಯಲ್ಲಿ ಚಿಕ್ಕ ಪ್ರಶ್ನೆಗಳು.",
    [{pattern:"Positive+Negative",kannada:"ಧನಾತ್ಮಕ+ನಕಾರಾತ್ಮಕ",examples:["You are a student, aren't you?","She likes coffee, doesn't she?","They can swim, can't they?"]},
     {pattern:"Negative+Positive",kannada:"ನಕಾರಾತ್ಮಕ+ಧನಾತ್ಮಕ",examples:["You aren't tired, are you?","She doesn't like tea, does she?","They can't swim, can they?"]},
     {pattern:"Special cases",kannada:"ವಿಶೇಷ",examples:["I am right, aren't I?","Let's go, shall we?","Don't be late, will you?"]}],
    [{english:"You speak English, don't you?",kannada:"ನೀವು ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡುತ್ತೀರಿ, ಅಲ್ಲವೇ?"},{english:"She is from Bangalore, isn't she?",kannada:"ಅವಳು ಬೆಂಗಳೂರಿನವಳು, ಅಲ್ಲವೇ?"}],"B2"),

  mk(18,"Causative Structures","ಕಾರಣಾತ್ಮಕ ರಚನೆಗಳು",
    "Have/Get someone to do something. Have something done (by someone else).",
    "ಯಾರಾದರೂ ಏನಾದರೂ ಮಾಡಲು ಹೊಂದಿರಿ/ಪಡೆಯಿರಿ.",
    [{pattern:"Have+person+base verb",kannada:"Have+ವ್ಯಕ್ತಿ+ಮೂಲ",examples:["I had him fix the car","She had the plumber repair the pipe","They had the painter paint the house"]},
     {pattern:"Get+person+to+verb",kannada:"Get+ವ್ಯಕ್ತಿ+to+ಕ್ರಿಯೆ",examples:["I got him to fix the car","She got them to help","He got her to agree"]},
     {pattern:"Have+thing+past participle",kannada:"Have+ವಸ್ತು+ಭೂತಭಾಗಿ",examples:["I had my car fixed","She had her hair cut","They had the house painted"]}],
    [{english:"I had my car repaired yesterday",kannada:"ನಾನು ನಿನ್ನೆ ನನ್ನ ಕಾರನ್ನು ರಿಪೇರಿ ಮಾಡಿಸಿದೆ"},{english:"She got her brother to help her",kannada:"ಅವಳು ತನ್ನ ಸಹೋದರನಿಂದ ಸಹಾಯ ಪಡೆದಳು"}],"B2"),

  mk(19,"Direct and Indirect Speech","ನೇರ ಮತ್ತು ಪರೋಕ್ಷ ಮಾತು",
    "Direct: exact words in quotes. Indirect/Reported: retelling without quotes, tense changes apply.",
    "ನೇರ: ಉದ್ಧರಣ ಚಿಹ್ನೆಗಳಲ್ಲಿ ನಿಖರ ಪದಗಳು. ಪರೋಕ್ಷ: ಉದ್ಧರಣ ಇಲ್ಲದೆ ಪುನರ್‌ಹೇಳಿಕೆ.",
    [{pattern:"Direct → Indirect",kannada:"ನೇರ → ಪರೋಕ್ಷ",examples:["'I am happy' → He said he was happy","'I will come' → She said she would come","'I can help' → He said he could help"]},
     {pattern:"Tense changes",kannada:"ಕಾಲ ಬದಲಾವಣೆ",examples:["am/is→was","are→were","will→would","can→could","have→had","do→did"]},
     {pattern:"Questions in reported",kannada:"ವರದಿ ಪ್ರಶ್ನೆ",examples:["'Where do you live?' → She asked where I lived","'Are you happy?' → He asked if I was happy"]}],
    [{english:"He said he was happy",kannada:"ಅವನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ ಎಂದು ಹೇಳಿದ"},{english:"She asked where I lived",kannada:"ಅವಳು ನಾನು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೇನೆ ಎಂದು ಕೇಳಿದಳು"}],"B2"),

  mk(20,"Active vs Passive Voice - All Tenses","ಕರ್ತರಿ vs ಕರ್ಮವಾಚ್ಯ - ಎಲ್ಲಾ ಕಾಲ",
    "Active: Subject does action. Passive: Subject receives action. Formation: be + past participle.",
    "ಕರ್ತರಿ: ವಿಷಯ ಕ್ರಿಯೆ ಮಾಡುತ್ತದೆ. ಕರ್ಮವಾಚ್ಯ: ವಿಷಯ ಕ್ರಿಯೆ ಸ್ವೀಕರಿಸುತ್ತದೆ.",
    [{pattern:"Present passive",kannada:"ಪ್ರಸ್ತುತ ಕರ್ಮವಾಚ್ಯ",examples:["Rice is eaten daily","English is spoken worldwide","Books are read by many","The car is washed weekly"]},
     {pattern:"Past passive",kannada:"ಭೂತ ಕರ್ಮವಾಚ್ಯ",examples:["The letter was written","The cake was eaten","The house was built in 1990"]},
     {pattern:"Future/Perfect passive",kannada:"ಭವಿಷ್ಯ/ಪರಿಪೂರ್ಣ ಕರ್ಮವಾಚ್ಯ",examples:["The work will be done","The report has been submitted","The bridge had been built"]}],
    [{english:"English is spoken all over the world",kannada:"ಇಂಗ್ಲಿಷ್ ಪ್ರಪಂಚದಾದ್ಯಂತ ಮಾತನಾಡಲಾಗುತ್ತದೆ"},{english:"The Taj Mahal was built by Shah Jahan",kannada:"ತಾಜ್ ಮಹಲ್ ಅನ್ನು ಶಾಹ ಜಹಾನ್ ನಿರ್ಮಿಸಿದ"}],"B2"),

  mk(21,"Subject-Verb Agreement Advanced","ವಿಷಯ-ಕ್ರಿಯೆ ಒಪ್ಪಂದ ಸುಧಾರಿತ",
    "Advanced agreement rules: collective nouns, either/or, neither/nor, each/every, there is/are.",
    "ಸುಧಾರಿತ ಒಪ್ಪಂದ ನಿಯಮಗಳು.",
    [{pattern:"Collective nouns",kannada:"ಸಾಮೂಹಿಕ ನಾಮಪದ",examples:["The team is winning","The family is large","The committee has decided","The class is studying"]},
     {pattern:"Either/Or Neither/Nor",kannada:"Either/Or Neither/Nor",examples:["Either he or she is coming","Neither the boys nor the girl was late","Either you or I am wrong"]},
     {pattern:"Each/Every",kannada:"Each/Every",examples:["Each student has a book","Every child is special","Everyone knows the answer","Nobody was there"]}],
    [{english:"The team is playing well today",kannada:"ತಂಡ ಇಂದು ಚೆನ್ನಾಗಿ ಆಡುತ್ತಿದೆ"},{english:"Neither of the students was absent",kannada:"ವಿದ್ಯಾರ್ಥಿಗಳಲ್ಲಿ ಯಾರೂ ಗೈರುಹಾಜರಾಗಿರಲಿಲ್ಲ"}],"B2"),

  mk(22,"Wish and If only","Wish ಮತ್ತು If only",
    "Wish + past simple (present wishes). Wish + past perfect (past regrets). Wish + would (future desires).",
    "Wish + ಸರಳ ಭೂತ (ಪ್ರಸ್ತುತ ಆಸೆ). Wish + ಭೂತ ಪರಿಪೂರ್ಣ (ಭೂತ ವಿಷಾದ).",
    [{pattern:"Wish + past (present)",kannada:"ಪ್ರಸ್ತುತ ಆಸೆ",examples:["I wish I were taller","I wish I had more money","I wish I lived in London","If only I could fly"]},
     {pattern:"Wish + past perfect (past)",kannada:"ಭೂತ ವಿಷಾದ",examples:["I wish I had studied harder","I wish I hadn't said that","If only I had known","I wish I had been there"]},
     {pattern:"Wish + would (annoying)",kannada:"ಕಿರಿಕಿರಿ",examples:["I wish he would stop talking","I wish it would stop raining","I wish you would listen"]}],
    [{english:"I wish I could speak English fluently",kannada:"ನಾನು ಇಂಗ್ಲಿಷ್ ನಿರರ್ಗಳವಾಗಿ ಮಾತನಾಡಬಹುದೆಂದು ಆಶಿಸುತ್ತೇನೆ"},{english:"I wish I had studied harder",kannada:"ನಾನು ಹೆಚ್ಚು ಕಷ್ಟಪಟ್ಟು ಓದಿದ್ದರೆ ಎಂದು ಆಶಿಸುತ್ತೇನೆ"}],"B2"),

  mk(23,"Punctuation and Capitalization","ವಿರಾಮ ಚಿಹ್ನೆ ಮತ್ತು ದೊಡ್ಡಕ್ಷರ",
    "Full stop (.), comma (,), question mark (?), exclamation (!), apostrophe ('), colon (:), semicolon (;).",
    "ಪೂರ್ಣ ವಿರಾಮ, ಅಲ್ಪ ವಿರಾಮ, ಪ್ರಶ್ನಾರ್ಥಕ ಚಿಹ್ನೆ, ಆಶ್ಚರ್ಯ ಚಿಹ್ನೆ, ಅಪಾಸ್ಟ್ರಫಿ.",
    [{pattern:"Period/Question/Exclamation",kannada:"ವಿರಾಮ/ಪ್ರಶ್ನೆ/ಆಶ್ಚರ್ಯ",examples:["I am happy.","Are you happy?","What a beautiful day!"]},
     {pattern:"Comma rules",kannada:"ಅಲ್ಪ ವಿರಾಮ ನಿಯಮ",examples:["I bought apples, oranges, and bananas","However, I disagree","Yes, I can help"]},
     {pattern:"Capitalization",kannada:"ದೊಡ್ಡಕ್ಷರ",examples:["Names: John, India, Monday","Start of sentence","Titles: Mr., Dr., Prof.","Languages: English, Kannada"]}],
    [{english:"Are you coming to the party?",kannada:"ನೀವು ಪಾರ್ಟಿಗೆ ಬರುತ್ತಿದ್ದೀರಾ?"},{english:"I bought apples, oranges, and bananas",kannada:"ನಾನು ಸೇಬು, ಕಿತ್ತಳೆ ಮತ್ತು ಬಾಳೆಹಣ್ಣು ಕೊಂಡೆ"}],"B2"),

  mk(24,"Common Kannada-English Errors","ಸಾಮಾನ್ಯ ಕನ್ನಡ-ಇಂಗ್ಲಿಷ್ ತಪ್ಪುಗಳು",
    "Common errors Kannada speakers make: word order (SOV→SVO), missing articles, subject omission, plural markers.",
    "ಕನ್ನಡ ಮಾತನಾಡುವವರು ಮಾಡುವ ಸಾಮಾನ್ಯ ತಪ್ಪುಗಳು.",
    [{pattern:"Word order SOV→SVO",kannada:"ಪದ ಕ್ರಮ",examples:["Wrong: I book read → Right: I read a book","Wrong: She rice eats → Right: She eats rice"]},
     {pattern:"Missing articles",kannada:"ಕಳೆದ ಲೇಖನ",examples:["Wrong: I go to school → Right: I go to the school (specific)","Wrong: He is teacher → Right: He is a teacher"]},
     {pattern:"Subject omission/Plurals",kannada:"ವಿಷಯ ಬಿಟ್ಟ/ಬಹುವಚನ",examples:["Wrong: Is good → Right: It is good","Wrong: Two book → Right: Two books","Wrong: In Monday → Right: On Monday"]}],
    [{english:"I read a book every day (not: I book read)",kannada:"ನಾನು ಪ್ರತಿದಿನ ಒಂದು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ"},{english:"He is a teacher (not: He is teacher)",kannada:"ಅವನು ಒಬ್ಬ ಶಿಕ್ಷಕ"}],"B2"),

  mk(25,"Level 8 Comprehensive Test","ಲೆವೆಲ್ 8 ಸಮಗ್ರ ಪರೀಕ್ಷೆ",
    "Test all Advanced Grammar: Gerunds, Tag questions, Causatives, Reported speech, Passive, Conditionals, Wishes.",
    "ಎಲ್ಲಾ ಸುಧಾರಿತ ವ್ಯಾಕರಣ ಪರೀಕ್ಷಿಸಿ.",
    [{pattern:"All Level 8",kannada:"ಎಲ್ಲಾ ಲೆವೆಲ್ 8",examples:["Gerunds/Infinitives","Tag Questions","Causatives","Reported Speech","Passive Voice","Wishes","Punctuation","Kannada Errors"]}],
    [{english:"I have mastered English grammar",kannada:"ನಾನು ಇಂಗ್ಲಿಷ್ ವ್ಯಾಕರಣವನ್ನು ಕಲಿತಿದ್ದೇನೆ"}],"B2")
];
cc.level8.lessons.push(...l8);
console.log(`Level 8: Added ${l8.length} → total ${cc.level8.lessons.length}`);

// Print final summary
console.log('\n📊 FINAL LESSON COUNT:');
let total = 0;
Object.entries(cc).forEach(([k,v]) => {
  if (v && v.lessons) {
    console.log(`  ${k}: ${v.title} → ${v.lessons.length} lessons`);
    total += v.lessons.length;
  }
});
console.log(`\n  TOTAL: ${total} lessons`);

fs.writeFileSync(contentPath, JSON.stringify(cc, null, 2));
console.log('\n✅ Part 3 complete. All grammar topics added!');
