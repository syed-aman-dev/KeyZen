/* ------------------------------------
   KEYZEN V2 - CORE TYPING ENGINE
--------------------------------------*/

const Engine = {
    text: "",
    index: 0,
    errors: 0,
    correct: 0,
    startTime: null,
    finished: false,

    onUpdate: () => {},
    onCharStatus: () => {},
    onComplete: () => {},

    /* ------------------------------
       Reset
    ------------------------------*/
    reset() {
        this.text = "";
        this.index = 0;
        this.errors = 0;
        this.correct = 0;
        this.finished = false;
        this.startTime = null;
    },

    /* ------------------------------
       Start Test
    ------------------------------*/
    start(text) {
        this.text = text;
        this.index = 0;
        this.errors = 0;
        this.correct = 0;
        this.finished = false;
        this.startTime = performance.now();

        this.onCharStatus(0, "active");
    },

    /* ------------------------------
       Process Input
    ------------------------------*/
    process(userInput) {
        if (this.finished) return;

        const i = this.index;

        // Finished typing all characters
        if (userInput.length >= this.text.length) {
            this.finish();
            return;
        }

        const inputChar = userInput[userInput.length - 1];
        const targetChar = this.text[i];

        // Evaluate character
        if (inputChar === targetChar) {
            // Mark old active as correct
            this.onCharStatus(i, "correct");
            this.index++;
            this.correct++;

            // Set next char active
            this.onCharStatus(this.index, "active");
        } else {
            this.errors++;
            this.onCharStatus(i, "wrong");
        }

        // Update stats
        const stats = this.getStats();
        this.onUpdate(stats);
    },

    /* ------------------------------
       Compute Stats
    ------------------------------*/
    getStats() {
        const timePassed = (performance.now() - this.startTime) / 1000;
        const grossWPM = (this.index / 5) / (timePassed / 60);

        let accuracy = 100;
        const totalTyped = this.correct + this.errors;
        if (totalTyped > 0) accuracy = Math.round((this.correct / totalTyped) * 100);

        return {
            wpm: Math.round(grossWPM),
            accuracy,
            errors: this.errors
        };
    },

    /* ------------------------------
       Finish
    ------------------------------*/
    finish() {
        this.finished = true;

        const stats = this.getStats();
        this.onUpdate(stats);
        this.onComplete(stats);
    }
};
