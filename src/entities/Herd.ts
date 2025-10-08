import { Container, Point } from 'pixi.js';
import { BASE_FORMATION, COLORS, CONFIG, Z_INDEX } from '../constants';
import {
    Coordinates,
    getDistance,
    getMovementAngle,
    getRotatedFormation,
    randomInt
} from '../core';
import { Score } from '../ui';
import { Animal, Hero, Yard } from './';

export class Herd extends Container {
    private readonly hero: Hero;
    private readonly yard: Yard;
    private readonly score: Score;
    private readonly animals: Animal[] = [];
    private readonly maxSize = CONFIG.MAX_GROUP;
    private formation: Coordinates[] = BASE_FORMATION;
    private formationUpdated: number = performance.now();
    private prevX = 0;
    private prevY = 0;
    private wobbleTimers = new WeakMap<Animal, number>();
    private speedTimers = new WeakMap<Animal, number>();

    constructor(hero: Hero, yard: Yard, score: Score) {
        super();
        this.hero = hero;
        this.yard = yard;
        this.score = score;
        this.zIndex = Z_INDEX.HERD;
    }

    tryCatchAnimal(animal: Animal) {
        const catchCount = this.animals.length;
        if (catchCount < this.maxSize && !animal.inHerd && !animal.destroyed) {
            const dx = animal.x - this.hero.x;
            const dy = animal.y - this.hero.y;
            const dist = getDistance(dx, dy);

            if (dist < this.hero.threshold) {
                animal.patrol?.stop();
                animal.targetOffset = this.formation[catchCount] ?? {
                    x: dx,
                    y: dy
                };
                animal.graphics
                    .fill({ color: COLORS.HERD })
                    .stroke({ width: 2, color: COLORS.STROKE });

                animal.x = dx;
                animal.y = dy;
                this.addChild(animal);
                this.animals.push(animal);
                animal.inHerd = true;
            }
        }
    }

    private removeAnimal(animal: Animal) {
        const idx = this.animals.indexOf(animal);
        if (idx !== -1) {
            this.animals.splice(idx, 1);
            this.removeChild(animal);
            animal.destroy();
            animal.patrol?.destroy();
            animal.patrol = null;
        }
    }

    private applyWobble(animal: Animal, point: Coordinates): void {
        const now = performance.now();
        const last = this.wobbleTimers.get(animal) ?? 0;
        const delay = 500;

        if (now - last > delay) {
            const x = point?.x ?? animal.x;
            const y = point?.y ?? animal.y;

            this.wobbleTimers.set(animal, now);

            animal.targetOffset = {
                x: x + randomInt(-50, 50) / 10,
                y: y + randomInt(-50, 50) / 10
            };
        }
    }

    private getAnimalSpeed(animal: Animal): number {
        const now = performance.now();
        const last = this.speedTimers.get(animal) ?? 0;
        const delay = 200;

        if (now - last > delay) {
            this.speedTimers.set(animal, now);
            animal.speedFactor = 1 / randomInt(10, 50);
        }

        return animal.speedFactor;
    }

    private updateFormation(dx: number, dy: number) {
        const now = performance.now();
        const last = this.formationUpdated;
        const delay = 100;
        if (now - last > delay) {
            const angle = getMovementAngle(dx, dy);
            this.formation = getRotatedFormation(angle);
        }
    }

    update() {
        const { animals, hero, x, y } = this;

        const dx = this.prevX - x;
        const dy = this.prevY - y;

        if (dx !== 0 && dy !== 0) {
            this.updateFormation(dx, dy);
        }

        this.prevX = x;
        this.prevY = y;

        this.x = hero.x;
        this.y = hero.y;

        const yardBounds = this.yard.getBounds();
        const toRemove: Animal[] = [];

        animals.forEach((animal, index) => {
            if (animal.inHerd && !animal.destroyed) {
                this.applyWobble(animal, this.formation[index]);
                const target = animal.targetOffset;
                animal.speedFactor = this.getAnimalSpeed(animal);
                animal.x += (target.x - animal.x) * animal.speedFactor;
                animal.y += (target.y - animal.y) * animal.speedFactor;

                const global = animal.getGlobalPosition(new Point());
                if (yardBounds.containsPoint(global.x, global.y)) {
                    animal.inHerd = false;
                    toRemove.push(animal);
                }
            }
        });

        for (const animal of toRemove) {
            this.score.increment();
            this.removeAnimal(animal);
        }
    }
}
