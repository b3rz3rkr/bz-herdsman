import { Coordinates } from './core';

type ColorEntities =
    | 'ANIMAL'
    | 'FIELD'
    | 'HERD'
    | 'HERO'
    | 'YARD'
    | 'SCORE'
    | 'STROKE';

type Colors = {
    [k in ColorEntities]: `#${string}`;
};

type ZIndexEntities = 'ANIMAL' | 'HERD' | 'HERO' | 'YARD' | 'UI';

type ZIndexes = {
    [k in ZIndexEntities]: number;
};

export const COLORS: Colors = {
    ANIMAL: '#bbbbbb',
    FIELD: '#00bb55',
    HERD: '#ffffff',
    HERO: '#ff0055',
    YARD: '#ffbb00',
    SCORE: '#ffbb00',
    STROKE: '#333333'
};

export const CONFIG = {
    FOLLOW: false,
    FPS: true,
    ANIMALS: {
        MIN: 25,
        MAX: 100
    },
    ANIMAL_DELAY: {
        MIN: 5000,
        MAX: 20000
    },
    ANIMAL_SIZE: 6,
    ANIMAL_SPEED: {
        MAX: 5,
        MIN: 1
    },
    MAX_GROUP: 5,
    HERO_SIZE: 6,
    HERO_SPEED: 5,
    THRESHOlD_DISTANCE: 30,
    YARD_SIZE: {
        WIDTH: 120,
        HEIGHT: 80
    }
};

export const BASE_FORMATION: Coordinates[] = [
    { x: 20, y: -20 },
    { x: 20, y: 20 },
    { x: 40, y: -10 },
    { x: 40, y: 10 },
    { x: 60, y: 0 }
];

export const Z_INDEX: ZIndexes = {
    YARD: 0,
    ANIMAL: 1,
    HERD: 2,
    HERO: 3,
    UI: 4
};
