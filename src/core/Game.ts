import { Application, Container, DestroyOptions, Ticker } from 'pixi.js';
import { CONFIG } from '../constants';
import { Animal, Herd, Hero, Yard } from '../entities';
import { KeyInput, Spawn } from '../systems';
import { FPSCounter, Score } from '../ui';
import { Coordinates, debounce, randomInt } from './';

export class Game extends Container {
    private app: Application;

    private animals: Animal[] = [];
    private readonly herd: Herd;
    private readonly hero: Hero;
    private readonly yard: Yard;

    private readonly spawn: Spawn;

    private readonly score: Score;
    private readonly fpsCounter: FPSCounter;

    constructor(app: Application) {
        super();
        this.app = app;
        const center = this.getCenter();
        this.yard = new Yard(app.canvas);
        this.score = new Score({ x: 20, y: 10 });
        this.fpsCounter = new FPSCounter({ x: 20, y: 60 });
        this.hero = new Hero(center);
        this.herd = new Herd(this.hero, this.yard, this.score);
        this.spawn = new Spawn(this.hero, this.yard, this.app.canvas);
        this.createAnimals();
        this.spawn.startAutoSpawn((animal: Animal) => {
            this.animals.push(animal);
            this.addChild(animal);
        });
        KeyInput.init(app.stage, app.screen);
        KeyInput.onClick((point) => {
            this.hero.moveTo(point);
        });

        this.addChild(
            this.yard,
            ...this.animals,
            this.score,
            this.fpsCounter,
            this.herd,
            this.hero
        );

        window.addEventListener('resize', this.handleResize);
    }

    private getCenter(): Coordinates {
        return {
            x: this.app.canvas.width / 2,
            y: this.app.canvas.height / 2
        };
    }

    private createAnimals() {
        const animalsCount = randomInt(CONFIG.ANIMALS.MIN, CONFIG.ANIMALS.MAX);

        for (let i = 0; i < animalsCount; i++) {
            const animal = this.spawn.spawnAnimal();

            if (animal) {
                this.animals.push(animal);
            }
        }
    }

    private handleResize = debounce(() => {
        this.yard.resize();
    }, 200);

    destroy(options: DestroyOptions) {
        window.removeEventListener('resize', this.handleResize);
        this.spawn.stopAutoSpawn();
        KeyInput.destroy();
        super.destroy(options);
    }

    update(ticker: Ticker) {
        this.hero.update(ticker);
        this.animals.forEach((animal) => animal.update(ticker, this.herd));
        this.fpsCounter.update(ticker);
        this.herd.update();
    }
}
