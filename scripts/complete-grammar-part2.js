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

// LEVEL 4: Add Past Continuous, Modals, Perfect Tenses, Used to (11-20)
const l4 = [
  mk(11,"Past Continuous Tense","ಭೂತ ನಿರಂತರ ಕಾಲ",
    "was/were + -ing for actions in progress at a specific past time. Interrupted actions: Past Continuous + when + Past Simple.",
    "ಭೂತಕಾಲದಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ಸಮಯದಲ್ಲಿ ನಡೆಯುತ್ತಿದ್ದ ಕ್ರಿಯೆಗಳಿಗೆ was/were + -ing ಬಳಸಿ.",
    [{pattern:"was/were + -ing",kannada:"was/were + -ing",examples:["I was sleeping","She was cooking","They were playing","He was reading"]},
     {pattern:"Interrupted actions",kannada:"ಅಡ್ಡಿಪಡಿಸಿದ ಕ್ರಿಯೆ",examples:["I was eating when he called","She was walking when it rained","They were sleeping when alarm rang"]},
     {pattern:"Two simultaneous",kannada:"ಎರಡು ಏಕಕಾಲಿಕ",examples:["I was reading while she was cooking","He was singing while they danced"]}],
    [{english:"I was eating when you called",kannada:"ನೀವು ಕರೆ ಮಾಡಿದಾಗ ನಾನು ಊಟ ಮಾಡುತ್ತಿದ್ದೆ"},{english:"She was sleeping when doorbell rang",kannada:"ಡೋರ್‌ಬೆಲ್ ಬಾರಿಸಿದಾಗ ಅವಳು ಮಲಗಿದ್ದಳು"}],"A2"),

  mk(12,"Modals - Can, Could, May, Might","ಮಾದರಿಗಳು - Can, Could, May, Might",
    "Can=ability/permission. Could=past ability/polite request. May=permission/possibility. Might=weak possibility.",
    "Can=ಸಾಮರ್ಥ್ಯ/ಅನುಮತಿ. Could=ಭೂತ ಸಾಮರ್ಥ್ಯ. May=ಅನುಮತಿ/ಸಾಧ್ಯತೆ. Might=ದುರ್ಬಲ ಸಾಧ್ಯತೆ.",
    [{pattern:"Can (ability)",kannada:"ಸಾಮರ್ಥ್ಯ",examples:["I can swim","Can I go?","She can drive","We can help"]},
     {pattern:"Could (polite/past)",kannada:"ಸಭ್ಯ/ಭೂತ",examples:["Could you help?","I could swim as child","Could I borrow?"]},
     {pattern:"May/Might",kannada:"ಸಾಧ್ಯತೆ",examples:["It may rain","May I come in?","He might be late","She might not come"]}],
    [{english:"Can you speak English?",kannada:"ನೀವು ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡಬಲ್ಲಿರಾ?"},{english:"It might rain tomorrow",kannada:"ನಾಳೆ ಮಳೆ ಬರಬಹುದು"}],"B1"),

  mk(13,"Modals - Must, Should, Have to","ಮಾದರಿಗಳು - Must, Should, Have to",
    "Must=strong obligation. Should=advice. Have to=external obligation. Don't have to=not necessary.",
    "Must=ಬಲವಾದ ಕಡ್ಡಾಯ. Should=ಸಲಹೆ. Have to=ಬಾಹ್ಯ ಕಡ್ಡಾಯ.",
    [{pattern:"Must",kannada:"ಕಡ್ಡಾಯ",examples:["You must study","He must wear helmet","We must be on time"]},
     {pattern:"Should",kannada:"ಸಲಹೆ",examples:["You should exercise","She should rest","He should see doctor"]},
     {pattern:"Have to / Don't have to",kannada:"ಮಾಡಬೇಕು/ಬೇಕಿಲ್ಲ",examples:["I have to work","She has to study","You don't have to come"]}],
    [{english:"You should drink more water",kannada:"ನೀವು ಹೆಚ್ಚು ನೀರು ಕುಡಿಯಬೇಕು"},{english:"I must finish this today",kannada:"ನಾನು ಇಂದು ಮುಗಿಸಬೇಕು"}],"B1"),

  mk(14,"Present Perfect Tense","ಪ್ರಸ್ತುತ ಪರಿಪೂರ್ಣ ಕಾಲ",
    "have/has + past participle for past actions connected to now. Ever/Never/Just/Already/Yet. For/Since.",
    "ಈಗಿಗೆ ಸಂಪರ್ಕಿಸುವ ಭೂತಕಾಲ ಕ್ರಿಯೆಗಳಿಗೆ have/has + past participle ಬಳಸಿ.",
    [{pattern:"have/has + pp",kannada:"have/has + ಭೂತಭಾಗಿ",examples:["I have eaten","She has finished","They have arrived","He has left"]},
     {pattern:"Ever/Never/Just/Already/Yet",kannada:"ಎಂದಾದರೂ/ಇಲ್ಲ/ಈಗಷ್ಟೇ/ಈಗಾಗಲೇ/ಇನ್ನೂ",examples:["Have you ever been to Delhi?","I have never seen snow","She has just arrived","I haven't finished yet"]},
     {pattern:"For/Since",kannada:"ಅವಧಿ/ಇಂದ",examples:["for 3 years","since 2020","for a long time","since Monday"]}],
    [{english:"I have lived in Bangalore for 5 years",kannada:"ನಾನು 5 ವರ್ಷಗಳಿಂದ ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೇನೆ"},{english:"She has never eaten pizza",kannada:"ಅವಳು ಎಂದಿಗೂ ಪಿಜ್ಜಾ ತಿಂದಿಲ್ಲ"}],"B1"),

  mk(15,"Present Perfect vs Past Simple","ಪ್ರಸ್ತುತ ಪರಿಪೂರ್ಣ vs ಸರಳ ಭೂತ",
    "Past Simple=finished at specific time. Present Perfect=connected to now/unspecified time.",
    "ಸರಳ ಭೂತ=ನಿರ್ದಿಷ್ಟ ಸಮಯದಲ್ಲಿ ಮುಗಿದ. ಪ್ರಸ್ತುತ ಪರಿಪೂರ್ಣ=ಈಗಿಗೆ ಸಂಪರ್ಕಿಸುವ.",
    [{pattern:"Past Simple: specific time",kannada:"ಸರಳ ಭೂತ: ನಿರ್ದಿಷ್ಟ",examples:["I ate at 1 PM","She went last year","They played yesterday"]},
     {pattern:"Present Perfect: unspecific",kannada:"ಪ್ರಸ್ತುತ ಪರಿಪೂರ್ಣ: ಅನಿರ್ದಿಷ್ಟ",examples:["I have eaten (already)","She has been to Delhi","They have played before"]},
     {pattern:"Key difference",kannada:"ಪ್ರಮುಖ ವ್ಯತ್ಯಾಸ",examples:["I lost my key (Past)→I have lost my key (still lost)","She lived in Mumbai (not now)→She has lived there for 5 years (still)"]}],
    [{english:"I visited Hampi last year",kannada:"ನಾನು ಕಳೆದ ವರ್ಷ ಹಂಪಿಗೆ ಹೋದೆ"},{english:"I have visited Hampi three times",kannada:"ನಾನು ಮೂರು ಬಾರಿ ಹಂಪಿಗೆ ಹೋಗಿದ್ದೇನೆ"}],"B1"),

  mk(16,"Future Continuous Tense","ಭವಿಷ್ಯ ನಿರಂತರ ಕಾಲ",
    "will be + -ing for actions in progress at a specific future time.",
    "ಭವಿಷ್ಯತ್ಕಾಲದಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ಸಮಯದಲ್ಲಿ ನಡೆಯುತ್ತಿರುವ ಕ್ರಿಯೆಗಳಿಗೆ will be + -ing ಬಳಸಿ.",
    [{pattern:"will be + -ing",kannada:"will be + -ing",examples:["I will be sleeping at 10 PM","She will be working tomorrow","They will be traveling"]},
     {pattern:"Questions",kannada:"ಪ್ರಶ್ನೆ",examples:["Will you be coming?","Will she be working?","Will they be traveling?"]},
     {pattern:"Negative",kannada:"ನಕಾರಾತ್ಮಕ",examples:["I won't be sleeping","She won't be working","They won't be traveling"]}],
    [{english:"I will be studying at this time tomorrow",kannada:"ನಾಳೆ ಈ ಸಮಯಕ್ಕೆ ನಾನು ಓದುತ್ತಿರುತ್ತೇನೆ"},{english:"She will be cooking at 7 PM",kannada:"ಸಂಜೆ 7 ಗಂಟೆಗೆ ಅವಳು ಅಡುಗೆ ಮಾಡುತ್ತಿರುತ್ತಾಳೆ"}],"B1"),

  mk(17,"Used to and Would","Used to ಮತ್ತು Would",
    "Used to=past habits no longer true. Would=repeated past actions (not states).",
    "Used to=ಇನ್ನು ಇಲ್ಲದ ಹಿಂದಿನ ಅಭ್ಯಾಸ. Would=ಪುನರಾವರ್ತಿತ ಭೂತ ಕ್ರಿಯೆ.",
    [{pattern:"Used to + base",kannada:"Used to + ಮೂಲ",examples:["I used to play cricket","She used to live in Mumbai","They used to walk to school"]},
     {pattern:"Didn't use to",kannada:"ಮಾಡುತ್ತಿರಲಿಲ್ಲ",examples:["I didn't use to like coffee","She didn't use to exercise"]},
     {pattern:"Would (repeated)",kannada:"Would (ಪುನರಾವರ್ತಿತ)",examples:["Every summer we would go to beach","She would always sing mornings"]}],
    [{english:"I used to play cricket when young",kannada:"ನಾನು ಚಿಕ್ಕವನಾಗಿದ್ದಾಗ ಕ್ರಿಕೆಟ್ ಆಡುತ್ತಿದ್ದೆ"},{english:"We used to live in a small village",kannada:"ನಾವು ಸಣ್ಣ ಹಳ್ಳಿಯಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೆವು"}],"B1"),

  mk(18,"Past Perfect Tense","ಭೂತ ಪರಿಪೂರ್ಣ ಕಾಲ",
    "had + past participle for action before another past action. Before/After/By the time.",
    "ಮತ್ತೊಂದು ಭೂತ ಕ್ರಿಯೆಗಿಂತ ಮೊದಲು ನಡೆದ ಕ್ರಿಯೆಗೆ had + past participle ಬಳಸಿ.",
    [{pattern:"had + pp",kannada:"had + ಭೂತಭಾಗಿ",examples:["I had eaten before she came","She had left when I arrived","They had finished"]},
     {pattern:"Before/After/By the time",kannada:"ಮೊದಲು/ನಂತರ/ಅಷ್ಟೊತ್ತಿಗೆ",examples:["Before she came, I had eaten","After he left, I called","By the time I arrived, she had gone"]},
     {pattern:"Negative: hadn't",kannada:"ನಕಾರಾತ್ಮಕ",examples:["I hadn't eaten","She hadn't left","They hadn't finished"]}],
    [{english:"I had already eaten when she arrived",kannada:"ಅವಳು ಬಂದಾಗ ನಾನು ಈಗಾಗಲೇ ತಿಂದಿದ್ದೆ"},{english:"She had left before I called",kannada:"ನಾನು ಕರೆ ಮಾಡುವ ಮೊದಲು ಅವಳು ಹೊರಟಿದ್ದಳು"}],"B1"),

  mk(19,"Future Perfect Tense","ಭವಿಷ್ಯ ಪರಿಪೂರ್ಣ ಕಾಲ",
    "will have + past participle for actions completed before a specific future time.",
    "ನಿರ್ದಿಷ್ಟ ಭವಿಷ್ಯ ಸಮಯಕ್ಕೆ ಮೊದಲು ಪೂರ್ಣಗೊಳ್ಳುವ ಕ್ರಿಯೆಗಳಿಗೆ will have + past participle ಬಳಸಿ.",
    [{pattern:"will have + pp",kannada:"will have + ಭೂತಭಾಗಿ",examples:["I will have finished by 5 PM","She will have left by then","They will have arrived by tomorrow"]},
     {pattern:"By + future time",kannada:"ಅಷ್ಟೊತ್ತಿಗೆ",examples:["By next year, I will have graduated","By 2030, they will have built it","By tonight, she will have cooked"]},
     {pattern:"Questions/Negatives",kannada:"ಪ್ರಶ್ನೆ/ನಕಾರಾತ್ಮಕ",examples:["Will you have finished?","She will not have arrived","Will they have completed?"]}],
    [{english:"By next year, I will have learned English",kannada:"ಮುಂದಿನ ವರ್ಷದಷ್ಟೊತ್ತಿಗೆ ನಾನು ಇಂಗ್ಲಿಷ್ ಕಲಿತಿರುತ್ತೇನೆ"},{english:"She will have finished by 8 PM",kannada:"ಸಂಜೆ 8 ಗಂಟೆಯಷ್ಟೊತ್ತಿಗೆ ಅವಳು ಮುಗಿಸಿರುತ್ತಾಳೆ"}],"B1"),

  mk(20,"Level 4 Comprehensive Test","ಲೆವೆಲ್ 4 ಸಮಗ್ರ ಪರೀಕ್ಷೆ",
    "Test all: Past Continuous, Modals, Present/Past/Future Perfect, Used to.",
    "ಎಲ್ಲಾ ಭೂತ ಮತ್ತು ಭವಿಷ್ಯ ಪರಿಕಲ್ಪನೆಗಳ ಪರೀಕ್ಷೆ.",
    [{pattern:"All Level 4",kannada:"ಎಲ್ಲಾ ಲೆವೆಲ್ 4",examples:["Past Continuous","Modals","Present Perfect","Past Perfect","Future Perfect","Used to"]}],
    [{english:"I am ready for Level 5",kannada:"ನಾನು ಲೆವೆಲ್ 5 ಗೆ ಸಿದ್ಧ"}],"B1")
];
cc.level4.lessons.push(...l4);
console.log(`Level 4: Added ${l4.length} → total ${cc.level4.lessons.length}`);

// LEVEL 5: Add Phrasal Verbs, Idioms, Collocations, Formal/Informal (16-20)
const l5 = [
  mk(16,"Phrasal Verbs - Common","ಉಪವಾಕ್ಯ ಕ್ರಿಯೆಗಳು",
    "Phrasal verbs = verb + preposition/adverb with new meaning: get up, look after, give up.",
    "ಉಪವಾಕ್ಯ ಕ್ರಿಯೆಗಳು = ಕ್ರಿಯೆ + ಪೂರ್ವಸರ್ಗ ಹೊಸ ಅರ್ಥದೊಂದಿಗೆ.",
    [{pattern:"Daily",kannada:"ದೈನಂದಿನ",examples:["get up=wake","look for=search","put on=wear","take off=remove","turn on/off"]},
     {pattern:"Work",kannada:"ಕೆಲಸ",examples:["give up=quit","carry on=continue","find out=discover","set up=establish"]},
     {pattern:"Social",kannada:"ಸಾಮಾಜಿಕ",examples:["look after=care for","get along with=friendly","turn down=reject","pick up=collect"]}],
    [{english:"I get up at 6 AM every morning",kannada:"ನಾನು ಪ್ರತಿ ಬೆಳಿಗ್ಗೆ 6 ಗಂಟೆಗೆ ಏಳುತ್ತೇನೆ"},{english:"She looks after her grandmother",kannada:"ಅವಳು ಅಜ್ಜಿಯನ್ನು ನೋಡಿಕೊಳ್ಳುತ್ತಾಳೆ"}],"B1"),

  mk(17,"Common Idioms","ಸಾಮಾನ್ಯ ನುಡಿಗಟ್ಟುಗಳು",
    "Idioms = expressions with non-literal meanings: piece of cake = very easy.",
    "ನುಡಿಗಟ್ಟುಗಳು = ಅಕ್ಷರಶಃ ಅಲ್ಲದ ಅರ್ಥಗಳ ಅಭಿವ್ಯಕ್ತಿಗಳು.",
    [{pattern:"Daily idioms",kannada:"ದೈನಂದಿನ",examples:["Break a leg=Good luck","Piece of cake=Easy","Under the weather=Sick","Hit the sack=Sleep"]},
     {pattern:"Work idioms",kannada:"ಕೆಲಸ",examples:["Back to drawing board=Start again","Call it a day=Stop working","In the same boat=Same situation"]},
     {pattern:"Time idioms",kannada:"ಸಮಯ",examples:["Better late than never","Time flies","Once in a blue moon=Rarely","In the nick of time=Just in time"]}],
    [{english:"The exam was a piece of cake",kannada:"ಪರೀಕ್ಷೆ ತುಂಬಾ ಸುಲಭವಾಗಿತ್ತು"},{english:"I'm feeling under the weather",kannada:"ನನಗೆ ಹುಷಾರಿಲ್ಲ"}],"B1"),

  mk(18,"Collocations","ಕೊಲೊಕೇಶನ್ಸ್",
    "Words that naturally go together: make a decision (not do a decision), heavy rain (not strong rain).",
    "ಸ್ವಾಭಾವಿಕವಾಗಿ ಒಟ್ಟಿಗೆ ಬರುವ ಪದಗಳು.",
    [{pattern:"Make vs Do",kannada:"Make vs Do",examples:["make a decision","make a mistake","do homework","do the dishes","make money","do exercise"]},
     {pattern:"Common",kannada:"ಸಾಮಾನ್ಯ",examples:["heavy rain","fast food","strong coffee","take a photo","pay attention","catch a cold"]},
     {pattern:"Get",kannada:"Get",examples:["get married","get lost","get ready","get better","get angry","get tired"]}],
    [{english:"I need to make a decision",kannada:"ನಾನು ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳಬೇಕು"},{english:"Please pay attention",kannada:"ದಯವಿಟ್ಟು ಗಮನ ಕೊಡಿ"}],"B1"),

  mk(19,"Formal vs Informal English","ಔಪಚಾರಿಕ vs ಅನೌಪಚಾರಿಕ",
    "Formal=official/business. Informal=friends/family. Learn when to use each.",
    "ಔಪಚಾರಿಕ=ಅಧಿಕೃತ/ವ್ಯಾಪಾರ. ಅನೌಪಚಾರಿಕ=ಸ್ನೇಹಿತರು/ಕುಟುಂಬ.",
    [{pattern:"Greetings",kannada:"ಶುಭಾಶಯ",examples:["Good morning sir → Hey!","How do you do? → What's up?","I would like → I want"]},
     {pattern:"Writing",kannada:"ಬರವಣಿಗೆ",examples:["Dear Sir/Madam → Hi","I am writing to inform → Just letting you know","Yours sincerely → Best"]},
     {pattern:"Contractions",kannada:"ಸಂಕ್ಷೇಪ",examples:["I am→I'm","do not→don't","will not→won't","cannot→can't"]}],
    [{english:"Could you please help me? (Formal)",kannada:"ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಬಹುದೇ? (ಔಪಚಾರಿಕ)"},{english:"Can you help? (Informal)",kannada:"ಸಹಾಯ ಮಾಡ್ತೀಯಾ? (ಅನೌಪಚಾರಿಕ)"}],"B1"),

  mk(20,"Level 5 Comprehensive Test","ಲೆವೆಲ್ 5 ಸಮಗ್ರ ಪರೀಕ್ಷೆ",
    "Test: Phrasal verbs, Idioms, Collocations, Formal/Informal English.",
    "ಎಲ್ಲಾ ಲೆವೆಲ್ 5 ವಿಷಯಗಳ ಪರೀಕ್ಷೆ.",
    [{pattern:"All Level 5",kannada:"ಎಲ್ಲಾ ಲೆವೆಲ್ 5",examples:["Phrasal verbs","Idioms","Collocations","Formal vs Informal"]}],
    [{english:"I am ready for Level 6",kannada:"ನಾನು ಲೆವೆಲ್ 6 ಗೆ ಸಿದ್ಧ"}],"B1")
];
cc.level5.lessons.push(...l5);
console.log(`Level 5: Added ${l5.length} → total ${cc.level5.lessons.length}`);

fs.writeFileSync(contentPath, JSON.stringify(cc, null, 2));
console.log('\n✅ Part 2 complete. Run part3 next.');
