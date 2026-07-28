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

// Fix Level 2: remove 5 duplicate lessons (ids 13-17 appended earlier)
cc.level2.lessons = cc.level2.lessons.slice(0,15);

// LEVEL 2: Add missing grammar foundations (16-25)
const l2 = [
  mk(16,"Nouns - Countable and Uncountable","ನಾಮಪದಗಳು - ಎಣಿಸಬಹುದಾದ ಮತ್ತು ಎಣಿಸಲಾಗದ",
    "Countable nouns can be counted (book/books). Uncountable cannot (water, rice, milk). Use some/any/much/many.",
    "ಎಣಿಸಬಹುದಾದ ನಾಮಪದಗಳನ್ನು ಎಣಿಸಬಹುದು. ಎಣಿಸಲಾಗದವನ್ನು ಎಣಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    [{pattern:"Countable",kannada:"ಎಣಿಸಬಹುದಾದ",examples:["a book/books","a pen/pens","a chair/chairs","an apple/apples"]},
     {pattern:"Uncountable",kannada:"ಎಣಿಸಲಾಗದ",examples:["water","rice","milk","sugar","information","advice"]},
     {pattern:"Some/Any/Much/Many",kannada:"ಕೆಲವು/ಯಾವುದಾದರೂ",examples:["some water","many books","much rice","any milk"]}],
    [{english:"I need some water",kannada:"ನನಗೆ ಸ್ವಲ್ಪ ನೀರು ಬೇಕು"},{english:"How many books do you have?",kannada:"ನಿಮ್ಮ ಬಳಿ ಎಷ್ಟು ಪುಸ್ತಕಗಳಿವೆ?"}],"A1"),

  mk(17,"Articles - A, An, The","ಲೇಖನಗಳು - A, An, The",
    "'A' before consonant sounds, 'An' before vowel sounds, 'The' for specific things.",
    "ವ್ಯಂಜನ ಧ್ವನಿಗಳ ಮೊದಲು 'A', ಸ್ವರ ಧ್ವನಿಗಳ ಮೊದಲು 'An', ನಿರ್ದಿಷ್ಟ ವಿಷಯಗಳಿಗೆ 'The'.",
    [{pattern:"A + consonant",kannada:"A + ವ್ಯಂಜನ",examples:["a book","a cat","a university","a one-way street"]},
     {pattern:"An + vowel",kannada:"An + ಸ್ವರ",examples:["an apple","an egg","an hour","an honest man"]},
     {pattern:"The + specific",kannada:"The + ನಿರ್ದಿಷ್ಟ",examples:["the sun","the moon","the book on the table"]}],
    [{english:"I have a book and an umbrella",kannada:"ನನ್ನಲ್ಲಿ ಒಂದು ಪುಸ್ತಕ ಮತ್ತು ಒಂದು ಛತ್ರಿ ಇದೆ"},{english:"The sun rises in the east",kannada:"ಸೂರ್ಯ ಪೂರ್ವದಲ್ಲಿ ಉದಯಿಸುತ್ತಾನೆ"}],"A1"),

  mk(18,"Pronouns - Subject, Object, Possessive","ಸರ್ವನಾಮಗಳು",
    "Subject: I,you,he,she,it,we,they. Object: me,you,him,her,it,us,them. Possessive: my,your,his,her,its,our,their.",
    "ವಿಷಯ ಸರ್ವನಾಮ: I,you,he,she. ವಸ್ತು ಸರ್ವನಾಮ: me,you,him,her. ಸ್ವಾಧೀನ: my,your,his,her.",
    [{pattern:"Subject pronouns",kannada:"ವಿಷಯ ಸರ್ವನಾಮ",examples:["I go","You eat","He runs","She sings","We play","They work"]},
     {pattern:"Object pronouns",kannada:"ವಸ್ತು ಸರ್ವನಾಮ",examples:["Help me","I see you","Call him","Tell her","Give us","Join them"]},
     {pattern:"Possessive",kannada:"ಸ್ವಾಧೀನ",examples:["my book","your pen","his car","her bag","our house","their dog"]}],
    [{english:"She gave me her book",kannada:"ಅವಳು ನನಗೆ ಅವಳ ಪುಸ್ತಕವನ್ನು ಕೊಟ್ಟಳು"},{english:"They invited us to their house",kannada:"ಅವರು ನಮ್ಮನ್ನು ಅವರ ಮನೆಗೆ ಆಹ್ವಾನಿಸಿದರು"}],"A1"),

  mk(19,"Adjectives - Describing Words","ವಿಶೇಷಣಗಳು",
    "Adjectives describe nouns. In English adjectives come BEFORE the noun: 'a big house'.",
    "ವಿಶೇಷಣಗಳು ನಾಮಪದಗಳನ್ನು ವಿವರಿಸುತ್ತವೆ. ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ನಾಮಪದದ ಮೊದಲು ಬರುತ್ತವೆ.",
    [{pattern:"Adj + Noun",kannada:"ವಿಶೇಷಣ + ನಾಮಪದ",examples:["a big house","a red car","a tall man","a beautiful garden"]},
     {pattern:"Subject + be + adj",kannada:"ವಿಷಯ + be + ವಿಶೇಷಣ",examples:["She is happy","The food is delicious","They are tired"]},
     {pattern:"Opposites",kannada:"ವಿರುದ್ಧ",examples:["big/small","hot/cold","fast/slow","happy/sad","old/new"]}],
    [{english:"This is a beautiful city",kannada:"ಇದು ಒಂದು ಸುಂದರ ನಗರ"},{english:"The coffee is very hot",kannada:"ಕಾಫಿ ತುಂಬಾ ಬಿಸಿಯಾಗಿದೆ"}],"A1"),

  mk(20,"Adverbs - How, When, Where","ಕ್ರಿಯಾವಿಶೇಷಣಗಳು",
    "Adverbs describe verbs/adjectives. Many end in -ly: quickly, slowly, carefully.",
    "ಕ್ರಿಯಾವಿಶೇಷಣಗಳು ಕ್ರಿಯೆಗಳನ್ನು ವಿವರಿಸುತ್ತವೆ. ಅನೇಕ -ly ನಲ್ಲಿ ಕೊನೆಗೊಳ್ಳುತ್ತವೆ.",
    [{pattern:"Manner (-ly)",kannada:"ರೀತಿ",examples:["He speaks slowly","She writes carefully","They run quickly"]},
     {pattern:"Time",kannada:"ಸಮಯ",examples:["I go now","She came yesterday","We meet tomorrow"]},
     {pattern:"Place",kannada:"ಸ್ಥಳ",examples:["Come here","Go there","Look everywhere","Sit down"]}],
    [{english:"She speaks English fluently",kannada:"ಅವಳು ಇಂಗ್ಲಿಷ್ ನಿರರ್ಗಳವಾಗಿ ಮಾತನಾಡುತ್ತಾಳೆ"},{english:"He always comes early",kannada:"ಅವನು ಯಾವಾಗಲೂ ಬೇಗ ಬರುತ್ತಾನೆ"}],"A2"),

  mk(21,"Conjunctions - And, But, Or, So, Because","ಸಂಯೋಜಕಗಳು",
    "Conjunctions join words/sentences. And=adds, But=contrasts, Or=choice, So=result, Because=reason.",
    "ಸಂಯೋಜಕಗಳು ಪದಗಳು/ವಾಕ್ಯಗಳನ್ನು ಸೇರಿಸುತ್ತವೆ.",
    [{pattern:"And/But",kannada:"ಮತ್ತು/ಆದರೆ",examples:["I like tea and coffee","I am tired but happy","He tried but failed"]},
     {pattern:"Because/So",kannada:"ಏಕೆಂದರೆ/ಆದ್ದರಿಂದ",examples:["I stayed because it rained","It rained so I stayed","She is happy because she passed"]},
     {pattern:"Or/Yet/Although",kannada:"ಅಥವಾ/ಆದರೂ",examples:["Tea or coffee?","He is old yet strong","Although it rained, I went"]}],
    [{english:"I like tea but she likes coffee",kannada:"ನನಗೆ ಚಹಾ ಇಷ್ಟ ಆದರೆ ಅವಳಿಗೆ ಕಾಫಿ ಇಷ್ಟ"},{english:"I stayed because it was raining",kannada:"ಮಳೆ ಬರುತ್ತಿದ್ದುದರಿಂದ ನಾನು ಇದ್ದೆ"}],"A2"),

  mk(22,"SVO Word Order","ವಾಕ್ಯ ರಚನೆ - SVO",
    "English=SVO (I eat rice). Kannada=SOV (I rice eat). Always put verb before object in English.",
    "ಇಂಗ್ಲಿಷ್=SVO. ಕನ್ನಡ=SOV. ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ವಸ್ತುವಿನ ಮೊದಲು ಕ್ರಿಯೆ ಇಡಿ.",
    [{pattern:"SVO",kannada:"ವಿಷಯ+ಕ್ರಿಯೆ+ವಸ್ತು",examples:["I eat rice","She reads books","They play football","He drinks water"]},
     {pattern:"Questions: Aux+S+V",kannada:"ಪ್ರಶ್ನೆ",examples:["Do you eat?","Does she read?","Did they play?","Will he come?"]},
     {pattern:"Negatives: S+Aux+not+V",kannada:"ನಕಾರಾತ್ಮಕ",examples:["I do not eat","She does not read","They did not play"]}],
    [{english:"I read English books every day",kannada:"ನಾನು ಪ್ರತಿದಿನ ಇಂಗ್ಲಿಷ್ ಪುಸ್ತಕಗಳನ್ನು ಓದುತ್ತೇನೆ"},{english:"She does not drink coffee",kannada:"ಅವಳು ಕಾಫಿ ಕುಡಿಯುವುದಿಲ್ಲ"}],"A1"),

  mk(23,"Comparatives and Superlatives","ಹೋಲಿಕೆ ಮತ್ತು ಅತ್ಯುನ್ನತ",
    "Comparatives compare two things (-er/more). Superlatives compare three+ (-est/most).",
    "ಹೋಲಿಕೆ: ಎರಡು ವಿಷಯಗಳನ್ನು ಹೋಲಿಸುತ್ತದೆ. ಅತ್ಯುನ್ನತ: ಮೂರು+ ಹೋಲಿಸುತ್ತದೆ.",
    [{pattern:"Short adj + er/est",kannada:"ಚಿಕ್ಕ + er/est",examples:["tall→taller→tallest","big→bigger→biggest","fast→faster→fastest"]},
     {pattern:"Long adj: more/most",kannada:"ಉದ್ದ: more/most",examples:["beautiful→more beautiful→most beautiful","expensive→more expensive→most expensive"]},
     {pattern:"Irregular",kannada:"ಅನಿಯಮಿತ",examples:["good→better→best","bad→worse→worst","far→farther→farthest"]}],
    [{english:"She is taller than me",kannada:"ಅವಳು ನನಗಿಂತ ಎತ್ತರ"},{english:"This is the best restaurant",kannada:"ಇದು ಅತ್ಯುತ್ತಮ ರೆಸ್ಟೋರೆಂಟ್"}],"A2"),

  mk(24,"Plurals and Irregular Plurals","ಬಹುವಚನ",
    "Most nouns add -s. Some: -es, -ies. Irregular: man→men, child→children, tooth→teeth.",
    "ಹೆಚ್ಚಿನ ನಾಮಪದಗಳು -s ಸೇರಿಸುತ್ತವೆ. ಕೆಲವು ವಿಶೇಷ ನಿಯಮಗಳಿವೆ.",
    [{pattern:"Regular +s",kannada:"+s",examples:["book→books","pen→pens","car→cars","dog→dogs"]},
     {pattern:"Special -es/-ies",kannada:"-es/-ies",examples:["box→boxes","watch→watches","baby→babies","city→cities"]},
     {pattern:"Irregular",kannada:"ಅನಿಯಮಿತ",examples:["man→men","woman→women","child→children","tooth→teeth","foot→feet","person→people"]}],
    [{english:"There are many children in the park",kannada:"ಉದ್ಯಾನವನದಲ್ಲಿ ಅನೇಕ ಮಕ್ಕಳಿದ್ದಾರೆ"},{english:"I bought three boxes",kannada:"ನಾನು ಮೂರು ಡಬ್ಬಿ ಕೊಂಡೆ"}],"A1"),

  mk(25,"Level 2 Comprehensive Test","ಲೆವೆಲ್ 2 ಸಮಗ್ರ ಪರೀಕ್ಷೆ",
    "Test all Core Grammar: nouns, pronouns, articles, adjectives, adverbs, conjunctions, comparatives, plurals, word order.",
    "ಎಲ್ಲಾ ಮೂಲ ವ್ಯಾಕರಣ ಪರೀಕ್ಷಿಸಿ.",
    [{pattern:"All topics",kannada:"ಎಲ್ಲಾ ವಿಷಯ",examples:["Nouns","Articles","Pronouns","Adjectives","Adverbs","Conjunctions","Comparatives","Plurals"]}],
    [{english:"I am ready for Level 3",kannada:"ನಾನು ಲೆವೆಲ್ 3 ಗೆ ಸಿದ್ಧ"}],"A2")
];
cc.level2.lessons.push(...l2);
cc.level2.description="Master essential grammar: nouns, pronouns, articles, adjectives, adverbs, conjunctions, comparatives, sentence structure.";
console.log(`Level 2: Added ${l2.length} → total ${cc.level2.lessons.length}`);

// LEVEL 3: Add prepositions, imperatives, possessives, past tense intro (13-21)
const l3 = [
  mk(13,"Prepositions of Place","ಸ್ಥಳದ ಪೂರ್ವಸರ್ಗಗಳು",
    "In=inside, On=surface, At=point, Under/Between/Behind/Next to.",
    "In=ಒಳಗೆ, On=ಮೇಲೆ, At=ನಲ್ಲಿ, Under=ಕೆಳಗೆ.",
    [{pattern:"In/On/At",kannada:"ಒಳಗೆ/ಮೇಲೆ/ನಲ್ಲಿ",examples:["in the box","on the table","at the door","at home"]},
     {pattern:"Under/Between/Behind",kannada:"ಕೆಳಗೆ/ನಡುವೆ/ಹಿಂದೆ",examples:["under the table","between two chairs","behind the door","next to the window"]}],
    [{english:"The book is on the table",kannada:"ಪುಸ್ತಕ ಮೇಜಿನ ಮೇಲೆ ಇದೆ"},{english:"The cat is under the chair",kannada:"ಬೆಕ್ಕು ಕುರ್ಚಿಯ ಕೆಳಗೆ ಇದೆ"}],"A2"),

  mk(14,"Prepositions of Time","ಸಮಯದ ಪೂರ್ವಸರ್ಗಗಳು",
    "In=months/years, On=days/dates, At=specific times.",
    "In=ತಿಂಗಳು/ವರ್ಷ, On=ದಿನ/ದಿನಾಂಕ, At=ನಿರ್ದಿಷ್ಟ ಸಮಯ.",
    [{pattern:"In+month/year",kannada:"ತಿಂಗಳು/ವರ್ಷ",examples:["in January","in 2024","in summer","in the morning"]},
     {pattern:"On+day/date",kannada:"ದಿನ/ದಿನಾಂಕ",examples:["on Monday","on 15th August","on my birthday"]},
     {pattern:"At+time",kannada:"ಸಮಯ",examples:["at 6 o'clock","at noon","at midnight","at Christmas"]}],
    [{english:"I wake up at 6 in the morning",kannada:"ನಾನು ಬೆಳಿಗ್ಗೆ 6 ಗಂಟೆಗೆ ಏಳುತ್ತೇನೆ"},{english:"My birthday is on 15th August",kannada:"ನನ್ನ ಹುಟ್ಟುಹಬ್ಬ ಆಗಸ್ಟ್ 15 ರಂದು"}],"A2"),

  mk(15,"Prepositions of Movement","ಚಲನೆಯ ಪೂರ್ವಸರ್ಗಗಳು",
    "To=direction, From=origin, Into=entering, Out of=leaving.",
    "To=ಕಡೆಗೆ, From=ಇಂದ, Into=ಒಳಗೆ, Out of=ಹೊರಗೆ.",
    [{pattern:"To/From",kannada:"ಕಡೆಗೆ/ಇಂದ",examples:["go to school","walk to park","from Bangalore","from home"]},
     {pattern:"Into/Out of",kannada:"ಒಳಗೆ/ಹೊರಗೆ",examples:["walk into room","get into car","come out of house","jump out of bed"]}],
    [{english:"I go to school every day",kannada:"ನಾನು ಪ್ರತಿದಿನ ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ"},{english:"She came from Mysore",kannada:"ಅವಳು ಮೈಸೂರಿನಿಂದ ಬಂದಳು"}],"A2"),

  mk(16,"Imperatives - Commands","ಆಜ್ಞಾರ್ಥಕ",
    "Commands use base verb without subject. Negative: Don't + verb. Polite: Please + verb.",
    "ಆಜ್ಞೆಗಳು ವಿಷಯವಿಲ್ಲದ ಮೂಲ ಕ್ರಿಯೆ ಬಳಸುತ್ತವೆ.",
    [{pattern:"Positive",kannada:"ಧನಾತ್ಮಕ",examples:["Sit down","Open the door","Come here","Listen carefully"]},
     {pattern:"Negative",kannada:"ನಕಾರಾತ್ಮಕ",examples:["Don't run","Don't touch","Don't be late","Don't worry"]},
     {pattern:"Polite",kannada:"ಸಭ್ಯ",examples:["Please sit down","Could you help me?","Would you please wait?"]}],
    [{english:"Please close the door",kannada:"ದಯವಿಟ್ಟು ಬಾಗಿಲು ಮುಚ್ಚಿ"},{english:"Don't be late",kannada:"ತಡವಾಗಬೇಡಿ"}],"A2"),

  mk(17,"Possessives","ಸ್ವಾಧೀನ",
    "Use 's for people. Use 'of' for things. Possessive pronouns: mine, yours, his, hers, ours, theirs.",
    "ಜನರಿಗೆ 's ಬಳಸಿ. ವಸ್ತುಗಳಿಗೆ 'of' ಬಳಸಿ.",
    [{pattern:"Noun + 's",kannada:"ನಾಮಪದ + 's",examples:["John's book","dog's tail","mother's house","teacher's desk"]},
     {pattern:"of + noun",kannada:"of + ನಾಮಪದ",examples:["color of the car","name of the city","end of the road"]},
     {pattern:"Possessive pronouns",kannada:"ಸ್ವಾಧೀನ ಸರ್ವನಾಮ",examples:["mine","yours","his","hers","ours","theirs"]}],
    [{english:"This is my father's car",kannada:"ಇದು ನನ್ನ ತಂದೆಯ ಕಾರು"},{english:"The book is mine",kannada:"ಪುಸ್ತಕ ನನ್ನದು"}],"A2"),

  mk(18,"Wh- Questions Complete","Wh- ಪ್ರಶ್ನೆಗಳು ಸಂಪೂರ್ಣ",
    "All question words: What, Where, When, Who, Why, Which, How, How much, How many, How often.",
    "ಎಲ್ಲಾ ಪ್ರಶ್ನಾರ್ಥಕ ಪದಗಳು.",
    [{pattern:"What/Where/When",kannada:"ಏನು/ಎಲ್ಲಿ/ಯಾವಾಗ",examples:["What is your name?","Where do you live?","When do you wake up?"]},
     {pattern:"Who/Why/Which",kannada:"ಯಾರು/ಏಕೆ/ಯಾವ",examples:["Who is she?","Why are you sad?","Which color?"]},
     {pattern:"How/How much/many",kannada:"ಹೇಗೆ/ಎಷ್ಟು",examples:["How are you?","How much is this?","How many books?","How often?"]}],
    [{english:"Where do you work?",kannada:"ನೀವು ಎಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತೀರಿ?"},{english:"How often do you exercise?",kannada:"ನೀವು ಎಷ್ಟು ಬಾರಿ ವ್ಯಾಯಾಮ ಮಾಡುತ್ತೀರಿ?"}],"A2"),

  mk(19,"Simple Past - Regular Verbs","ಸರಳ ಭೂತಕಾಲ - ನಿಯಮಿತ",
    "Add -ed to regular verbs. Spelling: drop e+d, double consonant+ed, y→ied.",
    "ನಿಯಮಿತ ಕ್ರಿಯೆಗಳಿಗೆ -ed ಸೇರಿಸಿ.",
    [{pattern:"Verb+ed",kannada:"ಕ್ರಿಯೆ+ed",examples:["walk→walked","play→played","work→worked","clean→cleaned"]},
     {pattern:"Spelling rules",kannada:"ಕಾಗುಣಿತ",examples:["live→lived","stop→stopped","study→studied","try→tried"]},
     {pattern:"Negative: didn't+base",kannada:"ನಕಾರಾತ್ಮಕ",examples:["I didn't walk","She didn't play","They didn't work"]}],
    [{english:"I walked to school yesterday",kannada:"ನಾನು ನಿನ್ನೆ ಶಾಲೆಗೆ ನಡೆದೆ"},{english:"She studied English last night",kannada:"ಅವಳು ಕಳೆದ ರಾತ್ರಿ ಇಂಗ್ಲಿಷ್ ಓದಿದಳು"}],"A2"),

  mk(20,"Simple Past - Irregular Verbs","ಸರಳ ಭೂತಕಾಲ - ಅನಿಯಮಿತ",
    "Irregular verbs have unique past forms: go→went, eat→ate, see→saw, buy→bought.",
    "ಅನಿಯಮಿತ ಕ್ರಿಯೆಗಳು ವಿಶಿಷ್ಟ ಭೂತಕಾಲ ರೂಪಗಳನ್ನು ಹೊಂದಿವೆ.",
    [{pattern:"Common irregular",kannada:"ಸಾಮಾನ್ಯ ಅನಿಯಮಿತ",examples:["go→went","eat→ate","see→saw","come→came","buy→bought","give→gave","take→took","make→made"]},
     {pattern:"be: was/were",kannada:"be: was/were",examples:["I was happy","She was tired","They were late","We were at home"]},
     {pattern:"Questions: Did+S+base",kannada:"ಪ್ರಶ್ನೆ",examples:["Did you go?","Did she eat?","Did they come?"]}],
    [{english:"I went to Mysore last weekend",kannada:"ನಾನು ಕಳೆದ ವಾರಾಂತ್ಯ ಮೈಸೂರಿಗೆ ಹೋದೆ"},{english:"She ate dosa for breakfast",kannada:"ಅವಳು ಉಪಾಹಾರಕ್ಕೆ ದೋಸೆ ತಿಂದಳು"}],"A2"),

  mk(21,"Level 3 Comprehensive Test","ಲೆವೆಲ್ 3 ಸಮಗ್ರ ಪರೀಕ್ಷೆ",
    "Test: prepositions, imperatives, possessives, Wh- questions, past tense.",
    "ಎಲ್ಲಾ ಲೆವೆಲ್ 3 ವಿಷಯಗಳ ಪರೀಕ್ಷೆ.",
    [{pattern:"All Level 3",kannada:"ಎಲ್ಲಾ ಲೆವೆಲ್ 3",examples:["Prepositions","Imperatives","Possessives","Questions","Past Tense"]}],
    [{english:"I am ready for Level 4",kannada:"ನಾನು ಲೆವೆಲ್ 4 ಗೆ ಸಿದ್ಧ"}],"A2")
];
cc.level3.lessons.push(...l3);
console.log(`Level 3: Added ${l3.length} → total ${cc.level3.lessons.length}`);

fs.writeFileSync(contentPath, JSON.stringify(cc, null, 2));
console.log('\n✅ Part 1 complete. Run part2 next.');
