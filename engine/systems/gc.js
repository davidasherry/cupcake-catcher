import {Graphics2DComponent} from '../components/index.js';
import {EntityList, EntityTypes} from '../entities/index.js';
import {GlobalGameState} from '../../globals.js';
import {GlobalConfig} from '../../config.js';

/**
 * System for cleaning up old game entities.
 */
export class GarbageCollectorSystem {
    /**
     * Get all entities relevant for the gc system.
     * @returns {Entity[]} The list of entities.
     * @private
     */
    static getRelevantEntities() {
        return EntityList.entities.filter((iEntity) => iEntity.hasComponent(Graphics2DComponent.identifier));
    }

    /**
     * Process a single game tick.
     * Removes entities that have moved outside the screen.
     */
    static tick() {
        for (const iEntity of GarbageCollectorSystem.getRelevantEntities()) {
            if (iEntity[Graphics2DComponent.identifier].position.y > GlobalConfig.GAME_WINDOW_HEIGHT) {
                EntityList.remove(iEntity.id);

                /* if (iEntity.type === EntityTypes.PLAYER) { // this resets the player whenever they fall out of the screen
                    Player.reset();
                } */
                if (iEntity.type === EntityTypes.FOOD) {
                    if (GlobalGameState.current.lives > 1) {
                        GlobalGameState.current.lives -= 1;
                    }
                    else {
                        GlobalGameState.current.lives -= 1;
                        GlobalGameState.current.gameOver = true;
                    }
                }
            }
        }
    }
}
