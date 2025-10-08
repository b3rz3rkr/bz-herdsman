import { Container, Graphics } from 'pixi.js';
import { COLORS, CONFIG, Z_INDEX } from '../constants';

export class Yard extends Container {
    private readonly graphics: Graphics;
    private readonly yWidth: number = CONFIG.YARD_SIZE.WIDTH;
    private readonly yHeight: number = CONFIG.YARD_SIZE.HEIGHT;
    readonly canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.graphics = new Graphics();
        this.canvas = canvas;

        this.createYard();
    }

    private createYard() {
        this.setYard();
        this.addChild(this.graphics);
    }

    private setYard() {
        this.graphics
            .rect(0, 0, this.yWidth, this.yHeight)
            .fill({ color: COLORS.YARD })
            .stroke({ width: 2, color: COLORS.STROKE });
        this.zIndex = Z_INDEX.YARD;
        this.x = this.canvas.width / 2 - this.yWidth / 2;
        this.y = this.canvas.height - this.yHeight;
    }

    resize() {
        this.graphics.clear();
        this.setYard();
    }
}
