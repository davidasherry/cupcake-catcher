import {GlobalConfig} from './config.js';

const canvas = document.querySelector('#canvas');

canvas.width = GlobalConfig.GAME_WINDOW_WIDTH;
canvas.height = GlobalConfig.GAME_WINDOW_HEIGHT;

/**
 * Accessor for the canvas draw context used by the game.
 */
export const GlobalDrawContext = canvas.getContext('2d');

/**
 * Container for a global game state tracking various details of the game while playing.
 */
export class GlobalGameState {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.restart = false;
        this.paused = true;
        this.foodSpawnIntervalMs = GlobalConfig.SLOW_MODE ? 60_000 : 2000;
    }

    static get current() {
        if (GlobalGameState._instance === undefined) {
            GlobalGameState.reset();
        }

        return GlobalGameState._instance;
    }

    static reset() {
        GlobalGameState._instance = new GlobalGameState();
    }
}

/**
 * Global time object, will track time passing for the game as a whole and for each game tick.
 */
export class Time {
    static init() {
        Time._startupTime = performance.now();
        Time._suspendTime = Time._startupTime;
        Time._deltaSuspended = 0;
        Time._isSuspended = true;
        Time._deltaTime = 0;
    }

    static get deltaTime() {
        return Time._deltaTime || 0;
    }

    static suspendTime()  {
        Time._suspendTime = performance.now();
        Time._isSuspended = true;
    }

    static resumeTime() {
        Time._deltaSuspended += performance.now() - Time._suspendTime;
        Time._isSuspended = false;
    }

    static updateDeltaTime() {
        if (!Time._isSuspended) {
            Time._deltaTime = performance.now() - Time._startupTime - Time._deltaSuspended;
        }
    }
}

/**
 * Layer index identifiers.
 */
export const LayerIndexes = Object.freeze({
    BACKGROUND: 0,
    FOOD: 1,
    Main: 2,
    FOREGROUND: 3
});
