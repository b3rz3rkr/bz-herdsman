import { Container, Text, TextStyle } from 'pixi.js';
import { COLORS, Z_INDEX } from '../constants';
import { Coordinates } from '../core';

export class Score extends Container {
    score: Text;
    counter: number;

    constructor(pos: Coordinates) {
        super();
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fill: COLORS.SCORE,
            stroke: { color: COLORS.STROKE, width: 5, join: 'round' },
            dropShadow: {
                color: '#00000066',
                blur: 4,
                angle: Math.PI / 6,
                distance: 3
            },
            align: 'center'
        });
        this.counter = 0;
        this.score = new Text({
            text: `Score: ${this.counter}`,
            style
        });
        this.zIndex = Z_INDEX.UI;
        this.x = pos.x;
        this.y = pos.y;
        this.addChild(this.score);
    }

    increment() {
        this.counter++;
        this.score.text = `Score: ${this.counter}`;
    }
}
