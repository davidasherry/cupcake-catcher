import {AnimatedSpriteComponent, Collision2DComponent, Graphics2DComponent} from '../components/index.js';
import {EntityList} from '../entities/index.js';
import {GlobalDrawContext, GlobalGameState} from '../../globals.js';
import {GlobalConfig} from '../../config.js';
import {CircleCollider, RectCollider} from '../geometry/index.js';
import {SceneManager} from "../resourcemanagers/index.js";

/**
 * System to handle rendering (drawing) of game entities.
 */
export class RenderSystem {
    /**
     * Get all entities relevant for the render system.
     * @returns {Entity[]} The list of entities.
     * @private
     */
    static getRelevantEntities() {
        return EntityList.entities.filter((iEntity) => iEntity.hasComponent(Graphics2DComponent.identifier) && iEntity[Graphics2DComponent.identifier].imageId !== undefined);
    }

    /**
     * Get all entities with collisions enabled.
     * @returns {Entity[]} The list of entities.
     * @private
     */
    static getCollidingEntities() {
        return EntityList.entities.filter((iEntity) => iEntity.hasComponent(Collision2DComponent.identifier));
    }

    /**
     * Draws an entity on the canvas using its graphics component.
     * @param {Graphics2DComponent} graphics The graphics component to draw.
     */
    static draw(graphics) {
        const image = SceneManager.currentScene.imageManager.images.get(graphics.imageId);

        if (image !== undefined) {
            GlobalDrawContext.drawImage(image, graphics.position.x, graphics.position.y, graphics.width, graphics.height);
        }
    }

    /**
     * Draws an entity with animated sprites on the canvas using both the graphics and animation component.
     * @param {Graphics2DComponent} graphics The graphics component to draw.
     * @param {AnimatedSpriteComponent} animation The animation component to get the active sprite from.
     */
    static drawAnimated(graphics, animation) {
        const activeSpriteId = animation.activeSpriteImageId;
        const image = SceneManager.currentScene.imageManager.images.get(activeSpriteId);

        if (image !== undefined) {
            GlobalDrawContext.drawImage(image, graphics.position.x, graphics.position.y, graphics.width, graphics.height);
        }
    }


    /**
     * Draws colliders for debug purposes.
     * @param {Collision2DComponent} collision The collision component.
     */
    static drawCollider(collision) {


        GlobalDrawContext.fillStyle =  collision.collidingEntities.length > 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(170, 255, 0, 0.5)';

        if (collision.collider instanceof RectCollider) {
            GlobalDrawContext.fillRect(collision.collider.origin.x, collision.collider.origin.y, collision.collider.width, collision.collider.height);
        } else if (collision.collider instanceof CircleCollider) {
            GlobalDrawContext.beginPath();
            GlobalDrawContext.arc(collision.collider.center.x, collision.collider.center.y, collision.collider.radius, 2 * Math.PI, false);
            GlobalDrawContext.fill();
        }

    }

    /**
     * Process a single game tick.
     */
    static tick() {
        GlobalDrawContext.clearRect(0, 0, GlobalConfig.GAME_WINDOW_WIDTH, GlobalConfig.GAME_WINDOW_HEIGHT);
        GlobalDrawContext.drawImage(
            SceneManager.currentScene.imageManager.images.get('background'),
            0,
            0,
            GlobalConfig.GAME_WINDOW_WIDTH,
            GlobalConfig.GAME_WINDOW_HEIGHT
        );

        // TODO would be nice to refactor these text blocks into a new kind of entity of type Text with a new TextComponent and a Graphics2DComponent :)
        GlobalDrawContext.fillStyle = SceneManager.currentScene.fontColor;
        GlobalDrawContext.font = '20px Calibri';
        GlobalDrawContext.fillText(GlobalGameState.current.score, 465, 27);
        GlobalDrawContext.fillText("Lives: " + GlobalGameState.current.lives, 350, 27);
        GlobalDrawContext.fillText("World: " + SceneManager.currentScene.name, 30, 27);
        GlobalDrawContext.drawImage(
            SceneManager.currentScene.imageManager.images.get('cupcake'),
            440,
            10,
            20,
            20
        );

        for (const iEntity of RenderSystem.getRelevantEntities()) {
            if (iEntity.hasComponent(AnimatedSpriteComponent.identifier)) {
                RenderSystem.drawAnimated(iEntity[Graphics2DComponent.identifier], iEntity[AnimatedSpriteComponent.identifier]);
            }
            else {
                RenderSystem.draw(iEntity[Graphics2DComponent.identifier]);
            }
        }

        if (GlobalConfig.DEBUG_MODE) {
            for (const iEntity of RenderSystem.getCollidingEntities()) {
                RenderSystem.drawCollider(iEntity[Collision2DComponent.identifier]);
            }
        }
    }
}
