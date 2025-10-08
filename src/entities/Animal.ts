import { Container, Graphics, Ticker } from 'pixi.js';
import { COLORS, CONFIG, Z_INDEX } from '../constants';
import { Coordinates } from '../core';
import { Patrol } from '../systems';
import { Herd, Yard } from './';

export class Animal extends Container {
    readonly graphics: Graphics;
    private _patrol: Patrol | null;
    private _inHerd: boolean = false;
    private _targetOffset: Coordinates = { x: 0, y: 0 };
    private _speedFactor: number = 0.1;

    constructor(pos: Coordinates, yard: Yard) {
        super();
        this.graphics = new Graphics();

        this.createAnimal();
        this.x = pos.x;
        this.y = pos.y;
        this.zIndex = Z_INDEX.ANIMAL;
        this._patrol = new Patrol(this, yard);
    }

    set inHerd(val: boolean) {
        this._inHerd = val;
    }
    get inHerd() {
        return this._inHerd;
    }

    set patrol(patrol: Patrol | null) {
        this._patrol = patrol;
    }

    set targetOffset(offset: Coordinates) {
        this._targetOffset = offset;
    }

    get targetOffset(): Coordinates {
        return this._targetOffset;
    }

    set speedFactor(speedFactor: number) {
        this._speedFactor = speedFactor;
    }

    get speedFactor(): number {
        return this._speedFactor;
    }

    private createAnimal(): void {
        this.graphics
            .circle(0, 0, CONFIG.ANIMAL_SIZE)
            .fill({ color: COLORS.ANIMAL })
            .stroke({ width: 2, color: COLORS.STROKE });
        this.addChild(this.graphics);
    }

    update(ticker: Ticker, herd: Herd) {
        this._patrol?.update(ticker);
        herd.tryCatchAnimal(this);
    }
}
