import { BASE_FORMATION, CONFIG } from '../constants';
import { Coordinates } from './';

export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
    let timeout: number | undefined;

    return (...args: unknown[]) => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => fn(...args), delay);
    };
};

export const getDistance = (dx: number, dy: number) =>
    Math.sqrt(dx * dx + dy * dy);

export const getMovementAngle = (
    dx: number,
    dy: number,
    follow = CONFIG.FOLLOW
) => {
    const rad = Math.atan2(dy, dx);

    return follow ? rad : rad - Math.PI;
};

export const getRotatedPoint = (
    point: Coordinates,
    rad: number
): Coordinates => {
    const { x, y } = point;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    return {
        x: x * cosA - y * sinA,
        y: x * sinA + y * cosA
    };
};

export const getRotatedFormation = (angle: number): Coordinates[] =>
    BASE_FORMATION.map((point) => getRotatedPoint(point, angle));

export const intersects = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    xMin: number,
    yMin: number,
    xMax: number,
    yMax: number
): boolean => {
    const det = (x2 - x1) * (yMax - yMin) - (y2 - y1) * (xMax - xMin);
    if (det === 0) return false;
    const t = ((xMin - x1) * (yMax - yMin) - (yMin - y1) * (xMax - xMin)) / det;
    const u = ((xMin - x1) * (y2 - y1) - (yMin - y1) * (x2 - x1)) / det;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

export const randomDelay = (): number => {
    return randomInt(CONFIG.ANIMAL_DELAY.MIN, CONFIG.ANIMAL_DELAY.MAX);
};

export const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;
