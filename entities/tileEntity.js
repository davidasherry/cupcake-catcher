import {Collision2DComponent, Graphics2DComponent} from '../engine/components/index.js';
import {LayerIndexes} from '../globals.js';
import {Entity, EntityTypes} from '../engine/entities/index.js';
import {RectCollider} from '../engine/geometry/index.js';

/**
 * Enumeration of available tile types.
 */
export const TileType = Object.freeze({
   LEFT: 'left',
   MID: 'mid',
   RIGHT: 'right'
});

/**
 * Factory for creating tile entities.
 */
export class TileFactory {
    static createTile(position, tileType = TileType.MID) {
        return new Entity(EntityTypes.TILE)
            .addComponent(new Graphics2DComponent(position, 50, 20, `tile_${tileType}`))
            .addComponent(new Collision2DComponent(new RectCollider(position, 50, 20), LayerIndexes.Main));
    }
}
