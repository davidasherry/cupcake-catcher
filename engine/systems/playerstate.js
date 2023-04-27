import {EntityTypes} from '../entities/index.js';
import {Player, PlayerAnimationStates} from '../../entities/playerEntity.js';
import {
    AnimatedSpriteComponent,
    Collision2DComponent,
    Graphics2DComponent,
    Gravity2DComponent,
    Movement2DComponent,
    PlayerControlledComponent
} from "../components/index.js";
import {Vector2} from '../geometry/index.js';
import {GlobalConfig} from '../../config.js';
import {Debug} from '../debug.js';

let currentWalkingAnimationIndex = 0;
const walkingAnimationCycle = [
    PlayerAnimationStates.WALK_1,
    PlayerAnimationStates.WALK_1,
    PlayerAnimationStates.WALK_1,
    PlayerAnimationStates.WALK_1,
    PlayerAnimationStates.WALK_1,
    PlayerAnimationStates.WALK_1,
    PlayerAnimationStates.WALK_2,
    PlayerAnimationStates.WALK_2,
    PlayerAnimationStates.WALK_2,
    PlayerAnimationStates.WALK_2,
    PlayerAnimationStates.WALK_2,
    PlayerAnimationStates.WALK_2,
    PlayerAnimationStates.WALK_3,
    PlayerAnimationStates.WALK_3,
    PlayerAnimationStates.WALK_3,
    PlayerAnimationStates.WALK_3,
    PlayerAnimationStates.WALK_3,
    PlayerAnimationStates.WALK_3
]

/**
 * Get the next walking animation from the animation cycle.
 * @returns {string} The next walking animation sprite.
 */
const nextWalkingAnimation = () => {
    if (currentWalkingAnimationIndex === walkingAnimationCycle.length - 1) {
        currentWalkingAnimationIndex = 0;
    }

    return walkingAnimationCycle[currentWalkingAnimationIndex++];
}

/**
 * System to handle player state updates.
 */
export class PlayerStateSystem {
    /**
     * Switches the player to the grounded state,
     * @param aPlayer
     * @param aPlayerControl
     */
    static setPlayerStateForGrounded(aPlayer, aPlayerControl) {
        Debug.log('[PlayerState] Set player state to grounded.');
        aPlayerControl.setGrounded();
        currentWalkingAnimationIndex = 0;

        if (aPlayer[Gravity2DComponent.identifier].isEnabled) {
            aPlayer[Gravity2DComponent.identifier].toggleGravity();
            aPlayer[Movement2DComponent.identifier].setVelocity(new Vector2(aPlayer[Movement2DComponent.identifier].velocity.x, 0));
        }
    }

    static setPlayerStateForFalling(aPlayer, aPlayerControl) {
        Debug.log('[PlayerState] Set player state to falling.');
        aPlayerControl.setFalling();

        if (!aPlayer[Gravity2DComponent.identifier].isEnabled) {
            aPlayer[Gravity2DComponent.identifier].toggleGravity();
        }
    }


    /**
     * Process a single game tick.
     */
    static tick() {
        const player = Player.getEntity();
        const playerControl = player[PlayerControlledComponent.identifier];
        const playerMovement = player[Movement2DComponent.identifier];
        const playerAnimation = player[AnimatedSpriteComponent.identifier];
        const playerGraphics = player[Graphics2DComponent.identifier];
        const playerCollision = player[Collision2DComponent.identifier];
        const isOnTile = playerCollision.collidingEntities.some((iEntity) => iEntity.type === EntityTypes.TILE);
        const isBelowFloor = playerGraphics.position.y > GlobalConfig.WALKABLE_GROUND_LEVEL;

        Debug.log(`[PlayerState] Player is${isOnTile ? '' : 'n\'t'} on tile, is${isBelowFloor ? '' : 'n\'t'} below the floor and is${playerControl.isJumping ? '' : 'n\'t'} jumping.`);

        // set player as grounded if there is a collision with a tile
        if (isOnTile && !playerControl.isGrounded && !isBelowFloor && !playerControl.isJumping) {
            this.setPlayerStateForGrounded(player, playerControl);
            playerAnimation.toggleActiveSprite(PlayerAnimationStates.DEFAULT);
        }
        else if (isOnTile && !isBelowFloor && playerMovement.velocity.x !== 0) {
            playerAnimation.toggleActiveSprite(nextWalkingAnimation());
        }
        else if ((!isOnTile && !playerControl.isJumping) || isBelowFloor) {
            this.setPlayerStateForFalling(player, playerControl);
            playerAnimation.toggleActiveSprite(PlayerAnimationStates.HURT);
        }
        else if (playerControl.isJumping) {
            playerAnimation.toggleActiveSprite(PlayerAnimationStates.JUMP);
        }

        if (isBelowFloor) {
            Debug.log('[PlayerState] Player below floor, clearing and disabling collisions.');
            playerCollision.resetCollisions();
            playerCollision.disableCollisions();
        }
    }
}
