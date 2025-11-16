/* ------------------------------------
   KEYZEN V2 - LEVELS & TEXT BANK
--------------------------------------*/

/* ------------------------------
   2-LETTER N-GRAMS
------------------------------*/
const ngrams2 = [
    "th", "he", "in", "er", "an", "re",
    "on", "at", "en", "nd", "ti", "es",
    "or", "te", "of", "ed", "is", "it"
];

/* ------------------------------
   3-LETTER N-GRAMS
------------------------------*/
const ngrams3 = [
    "the", "and", "ing", "her", "hat", "his",
    "tha", "ere", "for", "you", "ent", "ion"
];

/* ------------------------------
   COMMON WORD LIST
------------------------------*/
const commonWords = [
    "time", "person", "year", "way", "day", "thing", "man",
    "world", "life", "hand", "part", "eye", "woman",
    "place", "work", "week", "case", "point", "government",
    "company", "number", "group", "problem", "fact"
];

/* ------------------------------
   HARD WORDS
------------------------------*/
const hardWords = [
    "consequence", "psychology", "architecture",
    "fundamental", "organization", "responsibility",
    "circumstance", "perception", "acknowledge",
    "distribution", "mathematical", "development"
];

/* ------------------------------
   FULL SENTENCES
------------------------------*/
const sentenceBank = [
    "Typing is a skill that improves only with constant practice.",
    "Consistency beats speed, but speed comes with consistency.",
    "Focus on accuracy first, and your speed will follow naturally.",
    "Stay relaxed, keep your shoulders down, and let your fingers glide.",
    "The quickest typists are the ones who avoid unnecessary mistakes."
];

/* ------------------------------
   CODE SNIPPETS
------------------------------*/
const codeSnippets = [
`function greet(name) {
  return "Hello " + name;
}`,

`const app = express();
app.listen(3000, () => console.log("Server running"));`,

`<div class="card">
  <button onclick="save()">Save</button>
</div>`
];

/* ------------------------------
   LONG TEXT
------------------------------*/
const longText = `
The art of typing is not just about speed. It is a blend of rhythm, precision, and focus. 
To become truly fast, you must first become accurate. Every keystroke should be intentional.
Mastery comes slowly, but with patience, the fingers learn to dance across the keyboard.
`;

/* ------------------------------
   GET LEVEL TEXT
------------------------------*/
function getLevelText(level) {
    switch (level) {
        case 1: return repeatArray(ngrams2, 40);
        case 2: return repeatArray(ngrams3, 35);
        case 3: return repeatArray(commonWords, 20);
        case 4: return repeatArray(hardWords, 12);
        case 5: return sentenceBank.join(" ");
        case 6: return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        case 7: return longText;
        default: return "Level not found.";
    }
}

/* ------------------------------
   Helpers
------------------------------*/
function repeatArray(arr, count) {
    let out = [];
    for (let i = 0; i < count; i++) {
        out.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    return out.join(" ");
}

function getCodeSnippet() {
    return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
}

function generateRandomWords(amount) {
    let out = [];
    for (let i = 0; i < amount; i++) {
        out.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
    }
    return out.join(" ");
}
