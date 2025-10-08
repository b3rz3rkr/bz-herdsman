import { Container, Graphics, Ticker } from 'pixi.js';
import { COLORS, CONFIG, Z_INDEX } from '../constants';
import { Coordinates } from '../core';
import { Patrol } from '../systems';
import { Herd, Yard } from './';

export class Animal extends Container {
    readonly graphics: Graphics;
    patrol: Patrol | null;

    inHerd: boolean = false;
    targetOffset: Coordinates = { x: 0, y: 0 };
    speedFactor: number = 0.1;

    constructor(pos: Coordinates, yard: Yard) {
        super();
        this.graphics = new Graphics();

        this.createAnimal();
        this.x = pos.x;
        this.y = pos.y;
        this.zIndex = Z_INDEX.ANIMAL;
        this.patrol = new Patrol(this, yard);
    }

    private createAnimal(): void {
        this.graphics
            .circle(0, 0, CONFIG.ANIMAL_SIZE)
            .fill({ color: COLORS.ANIMAL })
            .stroke({ width: 2, color: COLORS.STROKE });
        this.addChild(this.graphics);
    }

    setInHerd(val: boolean) {
        this.inHerd = val;
    }

    update(ticker: Ticker, herd: Herd) {
        this.patrol?.update(ticker);
        herd.tryCatchAnimal(this);
    }
}
