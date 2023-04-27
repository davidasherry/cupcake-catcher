import {
    Collision2DComponent,
    Graphics2DComponent,
    Gravity2DComponent,
    Movement2DComponent,
    PlayerControlledComponent
} from '../components/index.js';
import {EntityList} from '../entities/index.js';
import {CollisionCheckDirection, Vector2} from '../geometry/index.js';
import {Debug} from '../debug.js';

/**
 * System to handle all movement of game entities.
 */
export class MovementSystem {
    /**
     * Get all moving entities.
     * @returns {Entity[]} The list of entities.
     * @private
     */
    static getMovingEntities() {
        return EntityList.entities.filter((iEntity) => iEntity.hasComponent(Graphics2DComponent.identifier) && (
            iEntity.hasComponent(Movement2DComponent.identifier) ||
            iEntity.hasComponent(Gravity2DComponent.identifier)
        ));
    }

    /**
     * Get all entities with collisions enabled.
     * @returns {Entity[]} The list of entities.
     * @private
     */
    static getCollidingEntities() {
        return EntityList.entities.filter((iEntity) => iEntity.hasComponent(Collision2DComponent.identifier) && !iEntity[Collision2DComponent.identifier].ignoreCollisions);
    }

    /**
     * Adds the collision event of two entities to each others collision lists.
     * @private
     * @param {Entity} entityOne The first entity.
     * @param {Entity} entityTwo The second entity.
     */
    static addCollision(entityOne, entityTwo) {
        const entityOneCollision = entityOne[Collision2DComponent.identifier];
        const entityTwoCollision = entityTwo[Collision2DComponent.identifier];

        entityOneCollision.addCollision(entityTwo);
        entityTwoCollision.addCollision(entityOne);
    }

    /**
     * Checks the current entity for collisions with any other collision entity on the calculated next position.
     * @private
     * @param {Entity} currentEntity The current entity.
     * @param {Vector2} nextPosition The next position
     * @param {Entity[]} allCollisionEntities The list of all collision entities.
     */
    static checkForCollisions(currentEntity, nextPosition, allCollisionEntities) {
        const currentEntityGraphics = currentEntity[Graphics2DComponent.identifier];
        const currentEntityCollision =  currentEntity[Collision2DComponent.identifier];
        const collisionCheckDirection = currentEntity.hasComponent(PlayerControlledComponent.identifier) ? CollisionCheckDirection.VERTICAL : CollisionCheckDirection.BOTH;
        const translationVector = new Vector2(nextPosition.x - currentEntityGraphics.position.x, nextPosition.y - currentEntityGraphics.position.y);

        Debug.log(`[CollisionDetection] Current collider position: ${currentEntityCollision.collider.position}`);

        currentEntityCollision.collider.translate(translationVector);

        Debug.log(`[CollisionDetection] Checking translated collider position: ${currentEntityCollision.collider.position}`);

        let pointsToCheck = currentEntityCollision.collider.getValidationPoints();

        let isClipping = false;

        for (const iCollisionEntity of allCollisionEntities) {
            // we do not want to check for collisions with the entity itself :D
            if (iCollisionEntity.id === currentEntity.id) {
                continue;
            }

            const otherCollider = iCollisionEntity[Collision2DComponent.identifier].collider;

            if (pointsToCheck.some((iPoint) => otherCollider.pointTouches(iPoint, collisionCheckDirection))) {
                Debug.log(`[CollisionDetection] ${currentEntity.type} touching ${iCollisionEntity.type}.`);

                MovementSystem.addCollision(currentEntity, iCollisionEntity);
            }
            else if (pointsToCheck.some((iPoint) => otherCollider.pointIsInside(iPoint, collisionCheckDirection))) {
                Debug.log(`[CollisionDetection] ${currentEntity.type} about to clip through ${iCollisionEntity.type}.`);

                MovementSystem.addCollision(currentEntity, iCollisionEntity);
                isClipping = true;
            }
        }

        if (!isClipping) {
            Debug.log(`[MovementSystem] Moving ${currentEntity.type} entity to ${nextPosition}.`);
            currentEntityGraphics.updatePosition(nextPosition);
        }
        else {
            // ensure the collider is moved back so the object won't clip
            currentEntityCollision.collider.translate(translationVector.inverse());

            let stillClipping = true;

            while(!translationVector.isNormalized() && stillClipping) {
                translationVector.scaleRounded(0.5);
                currentEntityCollision.collider.translate(translationVector);
                pointsToCheck = currentEntityCollision.collider.getValidationPoints();
                Debug.log(`[CollisionDetection] Checking downscaled translated position: ${currentEntityCollision.collider.position}`);

                if (allCollisionEntities.every((iCollisionEntity) => {
                    if (iCollisionEntity.id === currentEntity.id) {
                        return true;
                    }

                    return !pointsToCheck.some((iPoint) =>  iCollisionEntity[Collision2DComponent.identifier].collider.pointIsInside(iPoint, collisionCheckDirection));
                })) {
                    const currentEntityGraphics =  currentEntity[Graphics2DComponent.identifier];

                    const cleanNextPosition = new Vector2(
                        currentEntityGraphics.position.x + translationVector.x,
                        currentEntityGraphics.position.y + translationVector.y
                    );

                    Debug.log(`[CollisionDetection] Unstuck ${currentEntity.type} and force-moved to ${cleanNextPosition}.`);

                    currentEntityGraphics.updatePosition(cleanNextPosition);

                    break;
                }

                currentEntityCollision.collider.translate(translationVector.inverse());
            }
        }
    }

    /**
     * The player entity's movement is a tad more complex than the other bits, so we handle that separately to keep the code clean.
     * @param {Entity} playerEntity The player entity.
     * @returns {Vector2} The calculated next position of the player entity.
     */
    static handlePlayerMovement(playerEntity) {
        const playerControl = playerEntity[PlayerControlledComponent.identifier];
        const playerGraphics = playerEntity[Graphics2DComponent.identifier];
        const playerMovement = playerEntity[Movement2DComponent.identifier];
        const playerGravity = playerEntity[Gravity2DComponent.identifier];

        if (playerControl.isJumping) {
            Debug.log(`[PlayerMovement] Player is jumping at jump height ${playerControl.jumpHeight}.`);

            return new Vector2(playerGraphics.position.x + playerMovement.velocity.x, playerGraphics.position.y - playerControl.jumpHeight);
        }
        else if (playerControl.isFalling) {
            Debug.log(`[PlayerMovement] Player is falling at speed ${playerGravity.isEnabled ? playerGravity.weight : 0}.`);

            return new Vector2(playerGraphics.position.x + playerMovement.velocity.x, playerGraphics.position.y + (playerGravity.isEnabled ? playerGravity.weight : 0));
        }
        else if (playerControl.isGrounded) {
            Debug.log(`[PlayerMovement] Player is grounded and moving at speed ${playerMovement.velocity.x}.`);

            return new Vector2(playerGraphics.position.x + playerMovement.velocity.x, playerGraphics.position.y);
        }
    }

    /**
     * Process a single game tick.
     */
    static tick() {
        const collisionEntities = MovementSystem.getCollidingEntities();

        for (const iEntity of collisionEntities) {
            iEntity[Collision2DComponent.identifier].resetCollisions();
        }

        for (const iEntity of MovementSystem.getMovingEntities()) {
            const entityGraphics = iEntity[Graphics2DComponent.identifier];
            let nextPosition = entityGraphics.position;

            if (iEntity.hasComponent(PlayerControlledComponent.identifier)) {
                nextPosition = MovementSystem.handlePlayerMovement(iEntity);
            }
            else {
                switch (true) {
                    case iEntity.hasComponent(Movement2DComponent.identifier) && iEntity.hasComponent(Gravity2DComponent.identifier): {
                        const entityMovement = iEntity[Movement2DComponent.identifier];
                        const entityGravity = iEntity[Gravity2DComponent.identifier];
                        const weight = entityGravity.isEnabled ? entityGravity.weight : 0;

                        nextPosition = new Vector2(entityGraphics.position.x + entityMovement.velocity.x, entityGraphics.position.y + weight);

                        break;
                    }
                    case iEntity.hasComponent(Movement2DComponent.identifier): {
                        const entityMovement = iEntity[Movement2DComponent.identifier];

                        nextPosition = new Vector2(entityGraphics.position.x + entityMovement.velocity.x, entityGraphics.position.y + entityMovement.velocity.y);

                        break;
                    }
                    case iEntity.hasComponent(Gravity2DComponent.identifier): {
                        const entityGravity = iEntity[Gravity2DComponent.identifier];

                        nextPosition = new Vector2(entityGraphics.position.x, entityGraphics.position.y + entityGravity.weight);

                        break;
                    }
                    default: break;
                }
            }

            if (iEntity.hasComponent(Collision2DComponent.identifier) && !iEntity[Collision2DComponent.identifier].ignoreCollisions) {
                MovementSystem.checkForCollisions(iEntity, nextPosition, collisionEntities);
            }
            else {
                entityGraphics.updatePosition(nextPosition);
            }
        }
    }
}
