import clamp from 'lodash/clamp';

/**
 * Clamps a value to the valid percentage range [0, 100].
 */
export default function clampPercentage(value: number): number {
    return clamp(value, 0, 100);
}
