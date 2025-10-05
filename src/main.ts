import { Application } from 'pixi.js';
import { COLORS } from './constants';

(async () => {
    const app = new Application();
    await app.init({
        background: COLORS.FIELD,
        resizeTo: window
    });
    document.body.appendChild(app.canvas);
})();
