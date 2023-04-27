import {Vector2} from './vector2.js';

/**
 * Enumeration of directions for collision checking.
 */
export const CollisionCheckDirection = Object.freeze({
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
    BOTH: 'both'
})

/**
 * Abstract class describing a collider.
 * @abstract
 * @class
 */
export class Collider {
    /**
     * Checks whether the given point is inside the collider (not counting borderlines).
     * @param {Vector2} point The point to check.
     * @param {string} direction The direction to check. Defaults to both.
     * @returns {boolean} Whether the point is inside the collider.
     */
    pointIsInside(point, direction = CollisionCheckDirection.BOTH) {}

    /**
     * Checks whether the given point touches the collider on its borderline.
     * @param {Vector2} point The point to check.
     * @param {string} direction The direction to check. Defaults to both.
     * @returns {boolean} Whether the point touches the collider.
     */
    pointTouches(point, direction = CollisionCheckDirection.BOTH) {}

    /**
     * Returns an array of points that are used in collision checking for the given collider.
     * @returns {Array<Vector2>} The validation points.
     */
    getValidationPoints() {}

    /**
     * Moves the given collider by the given vector.
     * @param {Vector2} vector The translation vector.
     * @returns {Collider} The updated collider.
     */
    translate(vector) {}

    /**
     * Get the position of the collider's origin.
     * @returns {Vector2} The positional vector.
     */
    get position() {}
}

/**
 * A circle collider. Uses 8 points along the circle for validation.
 */
export class CircleCollider extends Collider {
    /**
     * Creates a new circle collider.
     * @param {Vector2} center The center of the circle.
     * @param {number} radius The radius of the circle.
     * @param {Vector2 | undefined} initialPosition Optionally provide the initial position of the entity this collider is added to.
     */
    constructor(center, radius, initialPosition = undefined) {
        super();

        this.center = center;
        this.radius = radius;
        this._initialPosition = initialPosition || center;
    }

    /**
     * Creates a circle collider from object dimensions.
     * @param {Vector2} position The position vector.
     * @param {number} width The object width.
     * @param {number} height The object height.
     * @returns {CircleCollider} The created collider.
     */
    static fromDimensions(position, width, height) {
        const center = new Vector2(
            position.x + width / 2,
            position.y + height / 2
        );

        return new CircleCollider(center, (width + height) / 4, position);
    }

    /**
     * @override
     * @inheritDoc
     */
    translate(vector) {
        this.center = new Vector2(this.center.x + vector.x, this.center.y + vector.y);

        return this;
    }

    /**
     * @override
     * @inheritDoc
     */
    pointIsInside(point, direction = CollisionCheckDirection.BOTH) {
        // ignore direction, always use distance to center
        return Vector2.distance(point, this.center) < this.radius;
    }

    /**
     * @override
     * @inheritDoc
     */
    pointTouches(point, direction = CollisionCheckDirection.BOTH) {
        // ignore direction, always use distance to center
        return Math.abs(Vector2.distance(point, this.center) - this.radius) < 0.01;
    }

    /**
     * @override
     * @inheritDoc
     */
    getValidationPoints() {
        return [
            this.center,
            new Vector2(this.center.x, this.center.y + this.radius),
            new Vector2(this.center.x, this.center.y - this.radius),
            new Vector2(this.center.x + this.radius, this.center.y),
            new Vector2(this.center.x - this.radius, this.center.y)
        ]
    }

    /**
     * @override
     * @inheritDoc
     */
    get position() {
        return this.center;
    }
}

/**
 * A rectangle collider. Uses its corner points for validation.
 */
export class RectCollider extends Collider {
    constructor(origin, width, height) {
        super();

        this.origin = origin;
        this.width = width;
        this.height = height;
    }

    /**
     * @override
     * @inheritDoc
     */
    translate(vector) {
        this.origin = new Vector2(this.origin.x + vector.x, this.origin.y + vector.y);

        return this;
    }

    /**
     * @override
     * @inheritDoc
     */
    pointIsInside(point, direction = CollisionCheckDirection.BOTH) {
        const pointIsTrulyInside = point.x > this.origin.x && point.x < this.origin.x + this.width &&
            point.y > this.origin.y && point.y < this.origin.y + this.height;

        // we also count collisions with the "unexpected" side as "inside"
        if (direction === CollisionCheckDirection.HORIZONTAL) {
            return pointIsTrulyInside || this.pointTouches(point, CollisionCheckDirection.VERTICAL);
        }
        else if (direction === CollisionCheckDirection.VERTICAL) {
            return pointIsTrulyInside || this.pointTouches(point, CollisionCheckDirection.HORIZONTAL);
        }
        else {
            return pointIsTrulyInside;
        }
    }

    /**
     * @override
     * @inheritDoc
     */
    pointTouches(point, direction = CollisionCheckDirection.BOTH) {
        const pointTouchesHorizontalSide = (point.x === this.origin.x || point.x === this.origin.x + this.width) &&
            (point.y >= this.origin.y && point.y <= this.origin.y + this.height);

        const pointTouchesVerticalSide = (point.y === this.origin.y || point.y === this.origin.y + this.height) &&
            (point.x >= this.origin.x && point.x <= this.origin.x + this.width);

        if (direction === CollisionCheckDirection.HORIZONTAL) {
            return pointTouchesHorizontalSide;
        }
        else if (direction === CollisionCheckDirection.VERTICAL) {
            return pointTouchesVerticalSide;
        }
        else {
            return pointTouchesVerticalSide || pointTouchesHorizontalSide;
        }
    }

    /**
     * @override
     * @inheritDoc
     */
    getValidationPoints() {
        return [
            this.origin,
            new Vector2(this.origin.x, this.origin.y + this.height / 2),
            new Vector2(this.origin.x, this.origin.y + this.height),
            new Vector2(this.origin.x + this.width / 2, this.origin.y),
            new Vector2(this.origin.x + this.width, this.origin.y),
            new Vector2(this.origin.x + this.width, this.origin.y + this.height / 2),
            new Vector2(this.origin.x + this.width, this.origin.y + this.height),
            new Vector2(this.origin.x + this.width / 2, this.origin.y + this.height)
        ]
    }

    /**
     * @override
     * @inheritDoc
     */
    get position() {
        return this.origin;
    }
}
