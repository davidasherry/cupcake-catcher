import {Collision2DComponent, Movement2DComponent, PlayerControlledComponent} from '../components/index.js';
import {EntityTypes} from '../entities/index.js';
import {Player} from '../../entities/playerEntity.js';
import {GlobalGameState, Time} from '../../globals.js';
import {GlobalConfig, KeyBinds} from '../../config.js';
import {Vector2} from '../geometry/index.js';
import {Debug} from '../debug.js';

const JUMP_TIMEOUT_MS = 500;

let lastMovementKeyPressed = '';

/**
 * System to handle player inputs and their effects on the player entity.
 */
export class PlayerInputSystem {
    /**
     * Registers all window input listeners for player and game control.
     */
    static registerInputListeners() {
        window.addEventListener('keydown', (event) => {
            Debug.log(`%cKEYDOWN ${event.key}`, 'color:yellow');

            if (Time.deltaTime === 0) {
                Debug.log("[Time] Fresh game run.");
                GlobalGameState.current.paused = false;
                Time.resumeTime();
            }

            const player = Player.getEntity();
            const playerMovement = player[Movement2DComponent.identifier];
            const playerControl = player[PlayerControlledComponent.identifier];
            const playerCollisions = player[Collision2DComponent.identifier];

            switch (true) {
                case KeyBinds.ACTION_MOVE_LEFT.includes(event.key): {
                    playerMovement.setVelocity(new Vector2(-GlobalConfig.PLAYER_MOVEMENT_SPEED, playerMovement.velocity.y));
                    lastMovementKeyPressed = event.key;

                    break;
                }
                case KeyBinds.ACTION_MOVE_RIGHT.includes(event.key): {
                    playerMovement.setVelocity(new Vector2(GlobalConfig.PLAYER_MOVEMENT_SPEED, playerMovement.velocity.y));
                    lastMovementKeyPressed = event.key;

                    break;
                }

                /*
                 * TODO TASK
                 *  Try adding keybindings for a super move via a global config and handle them here.
                 *  You can copy the case handlers for the normal move actions and adjust them, e.g. by multiplying the applied velocity.
                 */

                case KeyBinds.ACTION_JUMP.includes(event.key): {
                    if (playerControl.isGrounded) {
                        playerMovement.setVelocity(new Vector2(playerMovement.velocity.x, playerControl.jumpHeight));
                        playerControl.setJumping();

                        setTimeout(() => {
                            if (playerCollisions.collidingEntities.some((iEntity) => iEntity.type === EntityTypes.TILE)) {
                                playerControl.setGrounded();
                            }
                            else {
                                playerControl.setFalling();
                            }
                        }, JUMP_TIMEOUT_MS);
                    }

                    break;
                }
                case KeyBinds.GAME_PAUSE_PLAY.includes(event.key): {
                    GlobalGameState.current.paused = !GlobalGameState.current.paused;

                    if (GlobalGameState.current.paused) {
                        Time.suspendTime();
                    }
                    else {
                        Time.resumeTime();
                    }

                    break;
                }

                case KeyBinds.GAME_RESTART.includes(event.key): {
                    GlobalGameState.current.restart = true;

                    break;
                }

                /*
                 * TODO TASK
                 *  Try to make a sound effect play on some other key, just for fun.
                 */

                default: break;
            }
        });

        window.addEventListener('keyup', (event) => {
            const player = Player.getEntity();
            const playerMovement = player[Movement2DComponent.identifier];

            if (lastMovementKeyPressed === event.key) {
                playerMovement.setVelocity(new Vector2(0, playerMovement.velocity.y));
            }
        });
    }
}
