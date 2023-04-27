import {SceneManager} from "../resourcemanagers/index.js";
import {GlobalDrawContext, GlobalGameState, Time} from '../../globals.js';
import {GlobalConfig} from '../../config.js';
import {Player} from "../../entities/playerEntity.js";
import {Debug} from "../debug.js";

/**
 * Restart the game asynchronously.
 */
async function restartGame() {
    Debug.log("[Game] restarting game");
    // ensure the player entity is created

    // load the current scene and render the start screen
    return SceneManager.loadScene(GlobalConfig.INITIAL_SCENE_NAME, true).then(() => {
        GlobalDrawContext.drawImage(
            SceneManager.currentScene.imageManager.images.get('background'),
            0,
            0,
            GlobalConfig.GAME_WINDOW_WIDTH,
            GlobalConfig.GAME_WINDOW_HEIGHT
        );

        // setup game state variables
        Debug.log('[Game] Setting up game state...');
        GlobalGameState.reset();
        Player.reset();
        Time.init();
        Debug.log('[Game] Game ready.');
    });
}

/**
 * System for handling level transitions.
 */
export class LevelSystem {
    /**
     * Trigger a level transition to the level with the given name.
     * @param {string} levelName The level name.
     */
    static switchLevel(levelName) {
        GlobalGameState.current.paused = true;
        Time.suspendTime();

        SceneManager.loadScene(levelName).then(
            () => {
                GlobalDrawContext.drawImage(
                    SceneManager.currentScene.imageManager.images.get('background'),
                    0,
                    0,
                    GlobalConfig.GAME_WINDOW_WIDTH,
                    GlobalConfig.GAME_WINDOW_HEIGHT
                );
                Player.reset();
                GlobalGameState.current.paused = false;
                Time.resumeTime();
            }
        );
    }


    /**
     * Checks whether the game score is high enough for a level transition.
     * If so, the game is paused and the level is changed to the second level. After that the game resumes.
     */
    static checkProgressCondition() {
        // Switch to second level
        if (GlobalGameState.current.score > 2 && SceneManager.currentScene.name === GlobalConfig.INITIAL_SCENE_NAME) {
            LevelSystem.switchLevel(GlobalConfig.SECOND_SCENE_NAME);

            return true;
        }
        /*
         * TODO TASK - Add a level transition to the third level. Decide at how many points the level should change.
         */

        return false;

    }

    /**
     * Checks whether the game was set to restart.
     * In this case, the game is paused and a restart is initiated.
     * @return {boolean} Whether the restart condition is fulfilled.
     */
    static checkRestartCondition() {
        if (GlobalGameState.current.restart) {
            GlobalGameState.current.paused = true;
            Time.suspendTime();
            restartGame()
                .then(() => {
                    GlobalGameState.current.paused = false;
                    Time.resumeTime();
                });
            return true;
        }

        return false;
    }

    /**
     * Checks whether the game is over (lost).
     * In this case, the game is paused, a game over message is drawn, and the game is reinitiated in the background.
     * @return {boolean} Whether the game over condition is fulfilled.
     */
    static checkGameOverCondition() {
        if (GlobalGameState.current.gameOver) {

            /*
             * TODO TASK - play a sound effect on gameOver using SceneManager.currentScene.soundManager.sfx(...).play()
             */

            GlobalGameState.current.paused = true;
            Time.suspendTime();
            restartGame().then(() => {
                GlobalDrawContext.globalAlpha = 1.0;
                GlobalDrawContext.strokeStyle = "white";
                GlobalDrawContext.font = "30px Calibri";
                GlobalDrawContext.strokeText("Game Over", 150, 200);
                GlobalDrawContext.strokeText("Press any key to restart", 120, 250);
            });
            return true;
        }

        return false;
    }

    /**
     * Complete the run of a game loop by checking various game end / progress conditions.
     */
    static completeLoopRun() {
        switch (true) {
            case LevelSystem.checkRestartCondition(): break;
            case LevelSystem.checkGameOverCondition(): break;
            case LevelSystem.checkProgressCondition(): break;
            default: break;
        }
    }
}
