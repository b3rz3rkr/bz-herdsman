import { Application } from 'pixi.js';
import { COLORS } from './constants';
import { Game } from './core';

(async () => {
    const app = new Application();
    await app.init({
        background: COLORS.FIELD,
        resizeTo: window
    });
    document.body.appendChild(app.canvas);
    const game = new Game(app);
    app.stage.addChild(game);

    app.ticker.add((ticker) => {
        game.update(ticker);
    });
})();
