import {randomId} from './utils.js';
import {EntityList} from './entitylist.js';

/**
 * Component describing a general game entity.
 * @class
 */
export class Entity {
    /**
     * Creates a new entity instance.
     * @param {string} type Optionally specify an entity type / name.
     */
    constructor(type = 'GenericEntity') {
        this._type = type;
        this._id = randomId();
        EntityList.addEntity(this);
    }

    /**
     * Gets the entity id.
     * @returns {string} The entity id.
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the entity type / name.
     * @returns {string} The entity type.
     */
    get type() {
        return this._type;
    }

    /**
     * Check whether this entity has the given component.
     * @param {string} identifier The component identifier.
     * @returns {boolean} Whether the component has the given identifier.
     */
    hasComponent(identifier) {
        return Object.hasOwn(this, identifier);
    }

    /**
     * Adds a component to the entity.
     * Returns the modified entity for chaining.
     * @param {Component} component The component to add.
     */
    addComponent(component) {
        Object.defineProperty(this, component.constructor.identifier, {
            value: component,
            writable: false,
            enumerable: true
        });

        return this;
    }

    /**
     * Removes the component with the given identifier from the entity, if it had this component at all.
     * @param {string} identifier The component identifier.
     */
    removeComponent(identifier) {
        if (this.hasComponent(identifier)) {
            delete this[identifier];
        }
    }
}
