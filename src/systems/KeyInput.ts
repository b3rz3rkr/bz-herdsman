import { Container, Point, Rectangle } from 'pixi.js';

export class KeyInput {
    private static listeners: (({ x, y }: Point) => void)[] = [];
    private static moveListeners: ((point: Point) => void)[] = [];
    private static initialized = false;
    private static stageRef: Container | null = null;
    private static isPointerDown = false;

    static init(stage: Container, screen: Rectangle) {
        if (this.initialized) return;
        this.initialized = true;
        this.stageRef = stage;

        stage.eventMode = 'static';
        stage.hitArea = screen;

        stage.on('pointerdown', (event) => {
            this.isPointerDown = true;
            const pos = event.global;
            this.listeners.forEach((cb) => cb(pos));
        });

        stage.on('pointermove', (event) => {
            if (!this.isPointerDown) return;
            const pos = event.global;
            this.moveListeners.forEach((cb) => cb(pos));
        });

        stage.on('pointerup', () => {
            this.isPointerDown = false;
        });
    }

    static onClick(callback: (point: Point) => void) {
        this.listeners.push(callback);
    }

    static onHoldMove(callback: (point: Point) => void) {
        this.moveListeners.push(callback);
    }

    static destroy() {
        if (this.stageRef) {
            this.stageRef.removeAllListeners('pointerdown');
            this.stageRef = null;
        }
        this.listeners = [];
        this.moveListeners = [];
        this.initialized = false;
        this.isPointerDown = false;
    }
}
