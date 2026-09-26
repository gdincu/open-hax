// Dependency-free match store (timer + score) for the local 2P game.
// Tiny pub/sub replaces the old flux Dispatcher/EventEmitter/lodash setup.
// Public API is unchanged, so Header keeps working as-is.

class GameClass {

    constructor() {
        this.listeners = [];
        this.timer = {
            minutes: 0,
            seconds: 0
        };
        this.score = {
            home: 0,
            away: 0
        };
    }

    setTimer(data) {
        this.timer = data;
        this.emitChange();
    }

    goalScored(team) {
        if (team !== 'home' && team !== 'away') {
            return;
        }
        this.score[team]++;
        this.emitChange();
    }

    emitChange() {
        this.listeners.slice().forEach((callback) => {
            callback();
        });
    }

    addChangeListener(callback) {
        this.listeners.push(callback);
    }

    removeChangeListener(callback) {
        this.listeners = this.listeners.filter((listener) => listener !== callback);
    }
}

const Game = new GameClass();

export default Game;
