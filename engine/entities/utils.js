/**
 * Enumeration of some valid entity types.
 */
export const EntityTypes = Object.freeze({
    TILE: 'Tile',
    FOOD: 'Food',
    PLAYER: 'Player'
});

/**
 * Utility function to generate a random entity id.
 * @returns {string} The entity id.
 */
export const randomId = () => (Math.random() * Date.now()).toString(16).slice(2);
