import {Collision2DComponent} from '../components/index.js';
import {EntityList, EntityTypes} from '../entities/index.js';

/**
 * System for handling food-tile-collisions and breaking.
 */
export class TileBreakingSystem {
    /**
     * Get all entities relevant for the render system.
     * This returns tiles with detected collisions.
     * @returns {Entity[]} The list of entities.
     * @private
     */
    static getRelevantEntities() {
        return EntityList.entities.filter((iEntity) => iEntity.type === EntityTypes.TILE &&
            iEntity.hasComponent(Collision2DComponent.identifier) &&
            iEntity[Collision2DComponent.identifier].collidingEntities.length > 0);
    }

    /**
     * Process a single game tick.
     * Checks whether any tile is colliding with a food item.
     * If so, both the tile and food are removed from the entity list.
     */
    static tick() {
        for (const iEntity of TileBreakingSystem.getRelevantEntities()) {
            const entityCollision = iEntity[Collision2DComponent.identifier];
            const collidingFood = entityCollision.collidingEntities.find((iColliding) => iColliding.type === EntityTypes.FOOD);

            if (collidingFood !== undefined) {
                // TODO TASK: You can try removing the food when it collides with a block to make the game a bit harder
                // EntityList.remove(collidingFood.id);
                EntityList.remove(iEntity.id);
            }
        }
    }
}
