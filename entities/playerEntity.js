import {
    AnimatedSpriteComponent,
    Collision2DComponent,
    Graphics2DComponent,
    Gravity2DComponent,
    Movement2DComponent,
    PlayerControlledComponent
} from '../engine/components/index.js';
import {LayerIndexes} from '../globals.js';
import {GlobalConfig} from '../config.js';
import {RectCollider, Vector2} from '../engine/geometry/index.js';
import {Entity, EntityTypes} from '../engine/entities/index.js';

/**
 * Enumeration of player animation states.
 */
export const PlayerAnimationStates = Object.freeze({
    DEFAULT: 'default',
    HURT: 'hurt',
    JUMP: 'jump',
    WALK_1: 'walk_1',
    WALK_2: 'walk_2',
    WALK_3: 'walk_3'
});

/**
 * Singleton player entity.
 */
export class Player {
    /**
     * Gets the player entity.
     * @returns {Entity} The player entity.
     */
    static getEntity() {
        if (Player._instance === undefined) {
            console.log("here");
            Player._instance = new Entity(EntityTypes.PLAYER)
                .addComponent(new Graphics2DComponent(GlobalConfig.INITIAL_PLAYER_POSITION, 50, 50, 'player'))
                .addComponent(new Movement2DComponent(new Vector2(0, 0)))
                .addComponent(new Collision2DComponent(new RectCollider(GlobalConfig.INITIAL_PLAYER_POSITION, 50, 50, LayerIndexes.Main)))
                .addComponent(new Gravity2DComponent(5))
                .addComponent(new PlayerControlledComponent(3))
                .addComponent(new AnimatedSpriteComponent(
                    {name: PlayerAnimationStates.DEFAULT, imageId: 'player_default'},
                    {name: PlayerAnimationStates.HURT, imageId: 'player_hurt'},
                    {name: PlayerAnimationStates.JUMP, imageId: 'player_jump'},
                    {name: PlayerAnimationStates.WALK_1, imageId: 'player_walk_1'},
                    {name: PlayerAnimationStates.WALK_2, imageId: 'player_walk_2'},
                    {name: PlayerAnimationStates.WALK_3, imageId: 'player_walk_3'}
                ));
        }

        return Player._instance;
    }

    /**
     * Completely resets the player entity.
     */
    static reset() {
        Player._instance = undefined;
        Player.getEntity();
    }

    /**
     * Get some debug info formatted as html.
     * @return {string} The debug info.
     */
    static getDebugInfo() {
        if (Player._instance === undefined) {
            return '';
        }

        return `
            <p>Velocity: ${JSON.stringify(Player._instance[Movement2DComponent.identifier].velocity)}</p>
            <p>Position: ${JSON.stringify(Player._instance[Graphics2DComponent.identifier].position)}</p>
            <p>Gravity enabled: ${Player._instance[Gravity2DComponent.identifier].isEnabled}</p>
            <p>Grounded: ${Player._instance[PlayerControlledComponent.identifier].isGrounded}</p>
            <p>Jumping: ${Player._instance[PlayerControlledComponent.identifier].isJumping}</p>
            <p>Falling: ${Player._instance[PlayerControlledComponent.identifier].isFalling}</p>
            <p>Collisions: ${Player._instance[Collision2DComponent.identifier].collidingEntities.length}</p>
        `
    }
}
