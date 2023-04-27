import {Collision2DComponent, ConsumableComponent} from '../components/index.js';
import {EntityList} from '../entities/index.js';
import {Player} from '../../entities/playerEntity.js';
import {SceneManager} from "../resourcemanagers/index.js";
import {GlobalGameState} from "../../globals.js";

/**
 * System for handling food-player-collisions and consuming.
 */
export class ScoreSystem {
    /**
     * Process a single game tick.
     * Checks whether the player is colliding with a food item.
     * If so, we play the eat sound, add the food value to the game state, and remove the food entity.
     */
    static tick() {
        const player = Player.getEntity();
        const playerCollision = player[Collision2DComponent.identifier];
        const collidingConsumables = playerCollision.collidingEntities.filter((iColliding) => iColliding.hasComponent(ConsumableComponent.identifier));

        for (const iConsumableEntity of collidingConsumables) {
            const entityConsumable = iConsumableEntity[ConsumableComponent.identifier];
            const eatSfx = SceneManager.currentScene.soundManager.sfx.get('eat');

            if (eatSfx !== undefined) {
                eatSfx.play();
            }

            GlobalGameState.current.score += entityConsumable.value;

            EntityList.remove(iConsumableEntity.id);
        }
    }
}
