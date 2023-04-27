import {Component} from './interface.js';

/**
 * A component used for consumables that will increase the score.
 */
export class ConsumableComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    static get identifier() {
        return 'consumable';
    }

    /**
     * Creates a consumable component.
     * @param {number} value The value of the consumable.
     */
    constructor(value) {
        super();

        this._value = value;
    }

    /**
     * Gets the consumables value.
     * @returns {number} The value.
     */
    get value() {
        return this._value;
    }
}
