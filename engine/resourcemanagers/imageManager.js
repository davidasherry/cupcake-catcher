/**
 * Resource manager for image assets.
 */
export class ImageManager {
    constructor() {
        /**
         * @type {Map<string, string>}
         * @private
         */
        this._resources = new Map();
        /**
         * @type {Map<string, HTMLImageElement>}
         * @private
         */
        this._images = new Map();
        this._loaded = false;
    }

    /**
     * Adds the background image.
     * @param {string} backgroundUrl The background image url.
     */
    addBackground(backgroundUrl) {
        this._resources.set('background', backgroundUrl);
    }

    /**
     * Adds an image resource.
     * @param {string} id The image identifier key.
     * @param {string} imageUrl The image url.
     */
    addImage(id, imageUrl) {
        this._resources.set(id, imageUrl);
    }

    /**
     * Loads all added resources asynchronously.
     */
    async loadImages() {
        const resources = Array.from(this._resources.entries());

        console.info(`[ImageManager] Loading ${resources.length} image assets.`);

        await Promise.all(resources.map(([iKey, iValue]) => {
            console.info(`[ImageManager] Loading image ${iValue}.`);

            const img = new Image();
            img.src = iValue;

            return new Promise((resolve) => img.addEventListener('load', () => {
                this._images.set(iKey, img);
                resolve();
            }))
        }));

        this._loaded = true;

        console.info('[ImageManager] Images loaded.');
    }

    /**
     * Check whether loading of images was completed.
     * @returns {boolean} Whether all images have loaded.
     */
    get hasLoaded() {
        return this._loaded;
    }

    /**
     * Get the map of loaded images.
     * @returns {Map<string, HTMLImageElement>} The loaded images map.
     */
    get images() {
        return this._images;
    }
}
