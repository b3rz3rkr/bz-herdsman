import { Ticker } from 'pixi.js';
import { CONFIG } from '../constants';
import {
    Coordinates,
    getDistance,
    intersects,
    randomDelay,
    randomInt
} from '../core';
import { Animal, Yard } from '../entities';

export class Patrol {
    private animal: Animal | null;
    private yard: Yard | null;
    private target: Coordinates;
    private readonly speed: number;
    private readonly minSpeed: number = CONFIG.ANIMAL_SPEED.MIN;
    private readonly maxSpeed: number = CONFIG.ANIMAL_SPEED.MAX;
    private delay: number = randomDelay();
    private timer: number = 0;
    private isPatrolling = true;

    constructor(animal: Animal, yard: Yard) {
        this.animal = animal;
        this.yard = yard;
        const isMoving = randomInt(0, 1);

        if (isMoving) {
            this.target = this.getNewTarget();
        } else {
            this.target = { x: animal.x, y: animal.y };
        }

        this.speed = this.getSpeed();
    }

    private getSpeed() {
        return randomInt(this.minSpeed, this.maxSpeed) / 10;
    }

    private getNewTarget(): Coordinates {
        let target = this.target ?? { x: 0, y: 0 };

        if (this.animal && this.yard) {
            let tries = 0;
            const maxTries = 30;

            do {
                target = {
                    x: randomInt(0, this.yard.canvas.width),
                    y: randomInt(0, this.yard.canvas.height)
                };
                tries++;
            } while (
                this.pathIntersectsYard(
                    this.animal.x,
                    this.animal.y,
                    target.x,
                    target.y
                ) &&
                tries < maxTries
            );
        }

        return target;
    }

    private pathIntersectsYard(
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): boolean {
        if (!this.yard) return false;

        const yardBounds = this.yard.yardBoundsCache;

        if (
            yardBounds.containsPoint(x1, y1) ||
            yardBounds.containsPoint(x2, y2)
        ) {
            return true;
        }
        const xMin = yardBounds.x;
        const xMax = yardBounds.x + yardBounds.width;
        const yMin = yardBounds.y;
        const yMax = yardBounds.y + yardBounds.height;

        return (
            intersects(x1, y1, x2, y2, xMin, yMin, xMax, yMin) ||
            intersects(x1, y1, x2, y2, xMax, yMin, xMax, yMax) ||
            intersects(x1, y1, x2, y2, xMax, yMax, xMin, yMax) ||
            intersects(x1, y1, x2, y2, xMin, yMax, xMin, yMin)
        );
    }

    stop() {
        this.isPatrolling = false;
    }

    destroy() {
        this.stop();
        this.animal = null;
        this.yard = null;
    }

    update(ticker: Ticker) {
        if (this.isPatrolling && this.animal) {
            const { deltaMS, deltaTime } = ticker;
            this.timer += deltaMS;

            const dx = this.target.x - this.animal.x;
            const dy = this.target.y - this.animal.y;
            const dist = getDistance(dx, dy);

            if (dist > this.speed) {
                const vx = (dx / dist) * this.speed * deltaTime;
                const vy = (dy / dist) * this.speed * deltaTime;

                this.animal.x += vx;
                this.animal.y += vy;
            } else {
                this.animal.x = this.target.x;
                this.animal.y = this.target.y;
            }

            if (this.timer >= this.delay) {
                this.timer = 0;
                this.delay = randomDelay() * 12;
                this.target = this.getNewTarget();
            }
        }
    }
}
