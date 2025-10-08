import { Container, Point, Rectangle } from 'pixi.js';

export class KeyInput {
    private static listeners: (({ x, y }: Point) => void)[] = [];

    static init(stage: Container, screen: Rectangle) {
        stage.eventMode = 'static';
        stage.hitArea = screen;

        stage.on('pointerdown', (event) => {
            const pos = event.global;
            this.listeners.forEach((cb) => cb(pos));
        });
    }

    static onClick(callback: (point: Point) => void) {
        this.listeners.push(callback);
    }
}
