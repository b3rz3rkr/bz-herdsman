import { Container, Text, TextStyle, Ticker } from 'pixi.js';
import { COLORS, CONFIG, Z_INDEX } from '../constants';
import { Coordinates } from '../core';

export class FPSCounter extends Container {
    private readonly fps: Text;
    private elapsed: number = 0;
    private readonly enabled = CONFIG.FPS;

    constructor(pos: Coordinates) {
        super();
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: COLORS.STROKE
        });
        this.fps = new Text({ style });
        this.addChild(this.fps);
        this.zIndex = Z_INDEX.UI;
        this.x = pos.x;
        this.y = pos.y;
    }

    update(ticker: Ticker) {
        if (this.enabled) {
            this.elapsed += ticker.deltaMS;

            if (this.elapsed >= 500) {
                this.fps.text = `FPS: ${ticker.FPS.toFixed(1)}`;
                this.elapsed = 0;
            }
        }
    }
}
