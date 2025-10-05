import { Application } from 'pixi.js';
import { COLORS } from './constants';

export const app = new Application();

(async () => {
    await app.init({
        background: COLORS.FIELD,
        resizeTo: window
    });
    document.body.appendChild(app.canvas);
})();
