/**
 * A 2d vector, used for positions and movement.
 */
export class Vector2 {
    /**
     * Creates a new 2d vector.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Gets the distance between two points (positional vectors).
     * @param {Vector2} vec1 The first positional vector.
     * @param {Vector2} vec2 The second positional vector.
     * @return {number} The distance.
     */
    static distance(vec1, vec2) {
        return Math.sqrt(Math.abs(vec2.y - vec1.y) ** 2 + Math.abs(vec2.x - vec1.x) ** 2);
    }

    /**
     * Gets the inverse vector (same length, but opposite direction) of this vector.
     * @returns {Vector2} The inverse vector.
     */
    inverse() {
        return new Vector2(-this.x, -this.y);
    }

    /**
     * Checks whether a vector is normalized, meaning all values are either 1 or 0.
     * @return {boolean} Whether the vector is normal.
     */
    isNormalized() {
        return (this.x === 1 || this.x === 0) && (this.y === 1 || this.y === 0);
    }

    /**
     * Scales the vector but rounds all values to the closest integer.
     * @param {number} factor The factor by which to scale.
     */
    scaleRounded(factor) {
        this.x = Math.round(this.x * factor);
        this.y = Math.round(this.y * factor);
    }

    /**
     * @override
     */
    toString() {
        return `v(${this.x}|${this.y})`;
    }
}
