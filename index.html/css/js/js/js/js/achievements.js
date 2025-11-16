/* -----------------------------------------
   KEYZEN V2 - Achievements, XP, Streaks
------------------------------------------*/

const Achievements = {
    xp: 0,
    level: 1,
    streak: 0,
    lastTestDate: null,
    badges: [],

    onUpdate: () => {},

    /* Load saved data */
    load() {
        const data = JSON.parse(localStorage.getItem("keyzen_progress") || "{}");
        this.xp = data.xp || 0;
        this.level = data.level || 1;
        this.streak = data.streak || 0;
        this.lastTestDate = data.lastTestDate || null;
        this.badges = data.badges || [];
    },

    /* Save data */
    save() {
        localStorage.setItem("keyzen_progress", JSON.stringify({
            xp: this.xp,
            level: this.level,
            streak: this.streak,
            lastTestDate: this.lastTestDate,
            badges: this.badges
        }));
    },

    /* Award XP after test */
    onTestComplete(stats) {
        const today = new Date().toDateString();

        /* ------------------------------
           Streak logic
        ------------------------------*/
        if (this.lastTestDate === today) {
            // Same-day test — streak unchanged
        } else if (!this.lastTestDate) {
            this.streak = 1;
        } else {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (this.lastTestDate === yesterday) {
                this.streak++;
            } else {
                this.streak = 1;
            }
        }

        this.lastTestDate = today;

        /* ------------------------------
           XP calculation
        ------------------------------*/
        let earnedXP = Math.floor(stats.wpm * 2 + stats.accuracy);

        if (this.streak >= 5) earnedXP += 20;
        if (this.streak >= 10) earnedXP += 40;

        this.xp += earnedXP;

        /* ------------------------------
           Level up
        ------------------------------*/
        while (this.xp >= this.nextLevelXP()) {
            this.xp -= this.nextLevelXP();
            this.level++;
            this.unlockBadge("Level " + this.level + " Achieved");
        }

        /* ------------------------------
           Award badges
        ------------------------------*/
        if (stats.wpm >= 50) this.unlockBadge("50 WPM");
        if (stats.wpm >= 70) this.unlockBadge("70 WPM");
        if (stats.wpm >= 100) this.unlockBadge("100 WPM — Elite");
        if (this.streak === 7) this.unlockBadge("7-Day Streak");
        if (this.streak === 30) this.unlockBadge("30-Day Master");

        this.save();

        this.onUpdate();
    },

    /* XP needed for next level */
    nextLevelXP() {
        return this.level * 120 + 80; // scalable
    },

    /* Add badge once */
    unlockBadge(name) {
        if (!this.badges.includes(name)) {
            this.badges.push(name);
        }
    }
};

/* Load data on startup */
Achievements.load();
