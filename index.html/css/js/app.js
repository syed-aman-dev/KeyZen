/* ------------------------------
   KEYZEN V2 - APP CONTROLLER
   (Main UI / Flow Control)
--------------------------------*/

let currentText = "";
let currentMode = "practice";

/* DOM refs */
const textBox = document.getElementById("displayText");
const typingInput = document.getElementById("typingInput");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("accuracy");
const errEl = document.getElementById("errors");

/* ------------------------------
   LOAD MODE
--------------------------------*/
function loadMode(mode) {
    currentMode = mode;

    if (mode === "practice") {
        currentText = generateRandomWords(25);
    }
    if (mode === "levels") {
        currentText = getLevelText(1);
    }
    if (mode === "code") {
        currentText = getCodeSnippet();
    }

    renderText(currentText);
    resetTest();
}

/* ------------------------------
   RENDER TEXT AS SPANS
--------------------------------*/
function renderText(text) {
    textBox.innerHTML = "";

    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.id = "c" + index;
        textBox.appendChild(span);
    });
}

/* ------------------------------
   START
--------------------------------*/
function startTest() {
    typingInput.value = "";
    typingInput.focus();
    Engine.start(currentText);
}

/* ------------------------------
   RESET UI
--------------------------------*/
function resetTest() {
    wpmEl.textContent = 0;
    accEl.textContent = "100%";
    errEl.textContent = 0;

    Engine.reset();
}

/* ------------------------------
   ON INPUT
--------------------------------*/
typingInput.addEventListener("input", () => {
    const val = typingInput.value;
    Engine.process(val);
});

/* ------------------------------
   UPDATE STATS FROM ENGINE
--------------------------------*/
Engine.onUpdate = function (stats) {
    wpmEl.textContent = stats.wpm;
    accEl.textContent = stats.accuracy + "%";
    errEl.textContent = stats.errors;
};

/* ------------------------------
   MARK CHARACTERS
--------------------------------*/
Engine.onCharStatus = function (index, status) {
    const span = document.getElementById("c" + index);
    if (!span) return;

    span.classList.remove("correct", "wrong", "active");

    if (status === "correct") span.classList.add("correct");
    if (status === "wrong") span.classList.add("wrong");
    if (status === "active") span.classList.add("active");
};

/* ------------------------------
   ON COMPLETE
--------------------------------*/
Engine.onComplete = function (stats) {
    Achievements.onTestComplete(stats);
    alert("Test Completed!\nWPM: " + stats.wpm);
};
