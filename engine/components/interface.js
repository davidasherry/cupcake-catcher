/**
 * Abstract parent class for all components.
 * @abstract
 * @class
 */
export class Component {
    /**
     * Get the component identifier for this component.
     * @returns {string} The identifier.
     * @abstract
     */
    static get identifier() {}
}
