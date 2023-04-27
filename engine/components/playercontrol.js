import {Component} from './interface.js';

/**
 * Enumeration of possible player character movement states.
 */
const PlayerMovementState = Object.freeze({
    JUMPING: 'jumping',
    FALLING: 'falling',
    GROUNDED: 'grounded'
});

/**
 * Component added to the player controlled entity to handle jumping and other inputs correctly.
 */
export class PlayerControlledComponent extends Component {
    /**
     * @inheritDoc
     * @override
     */
    static get identifier() {
        return 'player';
    }

    /**
     * Creates a new player control component.
     * @param {number} jumpHeight The jump height (vertical velocity) of the player.
     */
    constructor(jumpHeight) {
        super();

        this._jumpHeight = jumpHeight;
        this._movementState = PlayerMovementState.FALLING;
    }

    /**
     * Get the jump height.
     * @return {number} The jump height.
     */
    get jumpHeight() {
        return this._jumpHeight;
    }

    /**
     * Get whether the current movement state is 'grounded'.
     * @return {boolean} Whether the player is grounded.
     */
    get isGrounded() {
        return this._movementState === PlayerMovementState.GROUNDED;
    }

    /**
     * Get whether the current movement state is 'jumping'.
     * @return {boolean} Whether the player is jumping.
     */
    get isJumping() {
        return this._movementState === PlayerMovementState.JUMPING;
    }

    /**
     * Get whether the current movement state is 'falling'.
     * @return {boolean} Whether the player is falling.
     */
    get isFalling() {
        return this._movementState === PlayerMovementState.FALLING;
    }

    /**
     * Set the current movement state to 'jumping'.
     */
    setJumping() {
        this._movementState = PlayerMovementState.JUMPING;
    }

    /**
     * Set the current movement state to 'falling'.
     */
    setFalling() {
        this._movementState = PlayerMovementState.FALLING;
    }

    /**
     * Set the current movement state to 'grounded'.
     */
    setGrounded() {
        this._movementState = PlayerMovementState.GROUNDED;
    }
}
