import Entity from '../core/Entity';
import { app } from '../app';
import { Graphics } from 'pixi.js';
import { COLORS, CONFIG } from '../constants';

export class Yard extends Entity {
    graphics: Graphics;

    constructor() {
        super();
        this.graphics = new Graphics();
        this.createYard();
    }

    createYard() {
        this.setYard();
        app.stage.addChild(this.graphics);
    }

    setYard() {
        const posX = app.canvas.width / 2 - CONFIG.YARD_SIZE.WIDTH / 2;
        const posY = app.canvas.height - CONFIG.YARD_SIZE.HEIGHT;
        this.graphics
            .rect(posX, posY, CONFIG.YARD_SIZE.WIDTH, CONFIG.YARD_SIZE.HEIGHT)
            .fill({ color: COLORS.YARD })
            .stroke({ width: 2, color: COLORS.YARD_STROKE });
    }

    resize() {
        this.graphics.clear();
        this.setYard();
    }
}
export default Yard;
