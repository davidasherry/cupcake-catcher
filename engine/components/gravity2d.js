import {Component} from './interface.js';

/**
 * A component used for 2d entities that are affected by gravity, which means they fall.
 */
export class Gravity2DComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    static get identifier() {
        return 'gravity';
    }

    /**
     * Creates a new gravity component.
     * @param {number} weight The weight (vertical movement speed).
     * @param {boolean} enabled Whether gravity is currently enabled on the entity.
     */
    constructor(weight, enabled = true) {
        super();

        this._weight = weight;
        this._enabled = enabled;
    }

    /**
     * Gets the weight of the entity.
     * @returns {number} The weight.
     */
    get weight() {
        return this._weight;
    }

    /**
     * Checks whether gravity is enabled for this entity.
     * @returns {boolean} Whether gravity is currently enabled.
     */
    get isEnabled() {
        return this._enabled;
    }

    /**
     * Toggles gravity on the entity.
     */
    toggleGravity() {
        this._enabled = !this._enabled;
    }
}
