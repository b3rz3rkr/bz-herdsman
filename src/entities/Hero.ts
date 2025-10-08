import { Container, Graphics, Ticker } from 'pixi.js';
import { COLORS, CONFIG, Z_INDEX } from '../constants';
import { Coordinates, getDistance } from '../core';

export class Hero extends Container {
    private readonly graphics: Graphics;
    private readonly speed = CONFIG.HERO_SPEED;
    private target: Coordinates;

    threshold = CONFIG.THRESHOLD_DISTANCE;

    constructor(pos: Coordinates) {
        super();

        this.graphics = new Graphics();
        this.createHero();

        this.x = pos.x;
        this.y = pos.y;

        this.target = pos;

        this.zIndex = Z_INDEX.HERO;
    }

    private createHero() {
        this.graphics
            .clear()
            .circle(0, 0, CONFIG.HERO_SIZE)
            .fill({ color: COLORS.HERO })
            .stroke({ width: 2, color: COLORS.STROKE });
        this.addChild(this.graphics);
    }

    moveTo(point: Coordinates) {
        const { x, y } = point;
        this.target = { x, y };
    }

    update(ticker: Ticker) {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = getDistance(dx, dy);

        const step = (this.speed * ticker.deltaMS) / 16.667;
        if (dist > step) {
            this.x += (dx / dist) * step;
            this.y += (dy / dist) * step;
        }
    }
}
