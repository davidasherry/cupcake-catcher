import {Vector2} from './engine/geometry/index.js';

/**
 * Map of key bindings for the game.
 */
export const KeyBinds = Object.freeze({
    ACTION_MOVE_LEFT: ['A', 'a', 'Left', 'ArrowLeft'],
    ACTION_MOVE_RIGHT: ['D', 'd', 'Right', 'ArrowRight'],
    ACTION_JUMP: [' ', 'Space', 'W', 'w', 'Up', 'ArrowUp'],
    GAME_PAUSE_PLAY: ['Esc', 'Escape'],
    GAME_RESTART: ['R', 'r']
    /*
     * TODO TASK - Add key bindings for a new kind of move action, a super-move with double speed (e.g. ACTION_SUPER_MOVE_LEFT).
     *  Bonus for making it an unexpected, fun key.
     */
});

/**
 * Collection of global constants and configuration values.
 * These will never change during game execution,
 */
export const GlobalConfig = Object.freeze({
    GAME_WINDOW_WIDTH: 500,
    GAME_WINDOW_HEIGHT: 500,
    INITIAL_SCENE_NAME: 'Cupcake-World',
    SECOND_SCENE_NAME: 'Space-World',
    IDEAL_TICK_TIME: 1000 / 60, // => ~60 fps,
    INITIAL_PLAYER_POSITION: new Vector2(300, 300),
    PLAYER_MOVEMENT_SPEED: 3,
    FOOD_SPAWN_POSITIONS: [2,52,102,152,202,252,302,352,402,452],
    WALKABLE_GROUND_LEVEL: 350,
    GROUND_LEVEL: 400,
    DEBUG_MODE: false,
    SLOW_MODE: false
    /*
     * TODO TASK - Add a new config parameter for a difficulty level, to use in other parts of the game.
     */
});
