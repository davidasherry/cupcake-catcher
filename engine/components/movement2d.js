import {Component} from './interface.js';
import {Vector2} from '../geometry/index.js';

/**
 * A component used for 2d entities that can move with a certain velocity.
 */
export class Movement2DComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    static get identifier() {
        return 'movement';
    }

    /**
     * Creates a new movement component.
     * @param {Vector2} velocity The velocity vector.
     */
    constructor (velocity) {
        super();

        this._velocity = velocity;
    }

    /**
     * Gets the velocity.
     * @returns {Vector2} The velocity.
     */
    get velocity() {
        return this._velocity;
    }

    /**
     * Resets the velocity to zero, resulting in an imminent stop.
     */
    resetVelocity() {
        this._velocity = new Vector2(0, 0);
    }

    /**
     * Sets the velocity.
     * @param {Vector2} velocity The velocity to set.
     */
    setVelocity(velocity) {
        this._velocity = velocity;
    }
}
