import {Component} from './interface.js';

/**
 * A component used for objects that have multiple images which they can switch between.
 * Only use together with {@link Graphics2DComponent} or this will crash.
 */
export class AnimatedSpriteComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    static get identifier() {
        return 'animation';
    }

    /**
     * Creates a new animated sprite component for an entity.
     * @param {{name: string, imageId: string}} spriteSets A list of tuples containing the sprite name and image id.
     */
    constructor(...spriteSets) {
        super();

        /**
         * @type {Map<string, string>}
         * @private
         */
        this._spriteMap = new Map();

        for (const iSet of spriteSets) {
            this._spriteMap.set(iSet.name, iSet.imageId);
        }

        this._currentSprite = spriteSets[0].name;
    }

    /**
     * Get the active sprite name.
     * @return {string} The name of the active sprite.
     */
    get activeSprite() {
        return this._currentSprite;
    }

    /**
     * Get the image id for the active sprite.
     * @return {string} The active sprite image id.
     */
    get activeSpriteImageId() {
        return this._spriteMap.get(this._currentSprite);
    }

    /**
     * Toggle the active sprite.
     * Logs an error if a sprite with the given name does not exist.
     * @param {string} spriteName The name of the sprite to activate.
     */
    toggleActiveSprite(spriteName) {
        if (this._spriteMap.has(spriteName)) {
            this._currentSprite = spriteName;
        }
        else {
            console.error(new ReferenceError(`Tried to toggle an invalid sprite: ${spriteName}`));
        }
    }
}
