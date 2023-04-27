import {EntityList} from '../entities/index.js';
import {GlobalConfig} from '../../config.js';
import {ImageManager} from './imageManager.js';
import {SoundManager} from './soundManager.js';

/**
 * The registry of all scenes.
 * @type {Map<string, Scene>}
 */
const SceneRegistry = new Map();

/**
 * Enumeration of scene font colors.
 */
export const SceneFontColor = Object.freeze({
    LIGHT: 'rgb(255, 255, 255)',
    DARK: 'rgb(0,0,0)'
});

/**
 * A scene is a screen within the game and also a container for all currently needed assets.
 * It can be used to create a game level, or maybe a title screen.
 */
export class Scene {
    /**
     * Creates a new scene.
     * @param {string} name The scene name.
     * @param {boolean} isLevel Whether this is a playable game level.
     */
    constructor(name, isLevel ) {
        this._name = name;
        this._isLevel = isLevel;
        this._imageManager = new ImageManager();
        this._soundManager = new SoundManager();
        this._fontColor = SceneFontColor.DARK;
        SceneRegistry.set(name, this);
        this._createEntities = () => undefined;
    }

    /**
     * Get the name of the scene.
     * @return {string} The name.
     */
    get name() {
        return this._name;
    }

    get imageManager() {
        return this._imageManager;
    }

    get soundManager() {
        return this._soundManager;
    }

    get isLevel() {
        return this._isLevel;
    }

    get fontColor() {
        return this._fontColor;
    }

    setLightFont() {
        this._fontColor = SceneFontColor.LIGHT;
    }

    setDarkFont() {
        this._fontColor = SceneFontColor.DARK;
    }

    /**
     * Sets up the entity creator for this scene.
     * @param {Function} value The setup function to use.
     */
    set createEntities(value) {
        this._createEntities = value;
    }

    async load() {
        console.info(`[CurrentScene] Loading scene ${this.name}.`);

        await this._imageManager.loadImages();
        await this._soundManager.loadSfx();
        this._createEntities();
    }
}

let _currentScene = GlobalConfig.INITIAL_SCENE_NAME;

/**
 * Resource manager to handle switching between different scenes (levels).
 */
export class SceneManager {
    /**
     * Load the scene with the given name.
     * @param {string} name The scene name.
     * @param {boolean} resetPlayer Whether to reset the player entity, too.
     */
    static async loadScene(name, resetPlayer = false) {
        console.info('[SceneManager] Switching to new scene.')

        if (SceneRegistry.has(name)) {
            const newScene = SceneRegistry.get(name);
            const currentScene = SceneRegistry.get(_currentScene);

            if (currentScene.isLevel && newScene.isLevel && !resetPlayer) {
                const player = EntityList.entities.find((iEntity) => iEntity.type === 'Player');

                EntityList.removeAllBut(player.id);
            }
            else {
                EntityList.clear();
            }

            await newScene.load();

            _currentScene = newScene.name

            console.info('[SceneManager] Scene ready.')
        }
        else {
            console.error(`[SceneManager] Scene ${name} not found.`)
        }
    }

    /**
     * Gets the currently loaded scene.
     * @returns {Scene} The current scene.
     */
    static get currentScene() {
        return SceneRegistry.get(_currentScene);
    }
}
