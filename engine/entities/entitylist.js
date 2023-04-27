let _entities = [];

/**
 * List of all active game entities.
 */
export class EntityList {
    /**
     * Adds an entity to the game.
     * @param {Entity} entity The entity to add.
     */
    static addEntity(entity) {
        _entities.push(entity);
    }

    /**
     * Get the list of game entities.
     * @returns {Entity[]} The game entities.
     */
    static get entities() {
        return _entities;
    }

    /**
     * Unloads all game entities.
     */
    static clear() {
        _entities = [];
    }

    /**
     * Removes a certain game entity from the list, meaning it will no longer be handled by game systems.
     * @param id
     */
    static remove(id) {
        _entities = _entities.filter((iItem) => iItem.id !== id);
    }

    /**
     * Removes all game entities except those with the specified ids.
     * Use this to, for example, clear everything but the player between levels.
     * @param {string} ids The ids of the game entities to remove.
     */
    static removeAllBut(...ids) {
        _entities = _entities.filter((iItem) => ids.includes(iItem.id));
    }
}
