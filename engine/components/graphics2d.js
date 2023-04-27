import {Component} from './interface.js';

/**
 * A component used for objects that can be positioned in a 2d context.
 * Entities need to specify a position and may additionally specify a width and height.
 */
export class Graphics2DComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    static get identifier() {
        return 'graphics';
    }

    /**
     * Creates a 2d graphics component for an entity.
     * @param {Vector2} position The position vector of the entity.
     * @param {number} width The width of the entity.
     * @param {number} height The height of the entity.
     * @param {string | undefined} imageId The id of the image to use for the entity.
     */
    constructor(position, width = 0, height = 0, imageId = undefined) {
        super();

        this._position = position;
        this._width = width;
        this._height = height;
        this._imageId = imageId;
    }

    /**
     * Get the position vector.
     * @returns {Vector2} The position vector.
     */
    get position() {
        return this._position;
    }

    /**
     * Get the width.
     * @returns {number} The width.
     */
    get width() {
        return this._width;
    }

    /**
     * Get the height.
     * @returns {number} The height.
     */
    get height() {
        return this._height;
    }

    /**
     * Get the image id, if there is one.
     * @returns {string | undefined} The image id.
     */
    get imageId() {
        return this._imageId;
    }

    /**
     * Updates the position of the entity with this component.
     * @param {Vector2} position The updated position.
     */
    updatePosition(position) {
        this._position = position;
    }

    /**
     * Sets the dimensions of the entity. Default dimensions are 0 / 0.
     * @param {number} width The width of the entity.
     * @param {number} height The height of the entity.
     */
    setDimensions(width = 0, height = 0) {
        this._width = width;
        this._height = height;
    }

    /**
     * Scales the width and height of the entity.
     * @param {number} factor The factor to scale by.
     */
    scale(factor) {
        this._width *= factor;
        this._height *= factor;
    }
}
