import { Coordinates, getDistance, randomDelay, randomInt } from '../core';
import { Animal, Hero, Yard } from '../entities';

export class Spawn {
    private readonly hero: Hero;
    private readonly yard: Yard;
    private readonly canvas: HTMLCanvasElement;
    private timeoutId: number | null = null;
    autoDelay: number;

    constructor(hero: Hero, yard: Yard, canvas: HTMLCanvasElement) {
        this.hero = hero;
        this.yard = yard;
        this.canvas = canvas;
        this.autoDelay = randomDelay();
    }

    spawnAnimal(): Animal | null {
        const maxRetries = 30;

        for (let i = 0; i < maxRetries; i++) {
            const pos: Coordinates = {
                x: randomInt(0, this.canvas.width),
                y: randomInt(0, this.canvas.height)
            };

            if (this.isValidSpawn(pos)) {
                return new Animal(pos, this.yard);
            }
        }
        return null;
    }

    private isValidSpawn(point: Coordinates): boolean {
        const { x, y } = point;
        const dxHero = x - this.hero.x;
        const dyHero = y - this.hero.y;
        const distHero = getDistance(dxHero, dyHero);

        if (distHero < this.hero.threshold) {
            return false;
        }

        const yardBounds = this.yard.getBounds();
        return !yardBounds.containsPoint(x, y);
    }

    private autoSpawnLoop = (onSpawn: (a: Animal) => void) => {
        const animal = this.spawnAnimal();
        if (animal) {
            onSpawn(animal);
        }
        this.autoDelay = randomDelay();
        this.timeoutId = window.setTimeout(
            () => this.autoSpawnLoop(onSpawn),
            this.autoDelay
        );
    };

    startAutoSpawn(onSpawn: (a: Animal) => void) {
        this.timeoutId = window.setTimeout(
            () => this.autoSpawnLoop(onSpawn),
            this.autoDelay
        );
    }
    stopAutoSpawn() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
