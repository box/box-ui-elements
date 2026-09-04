import { Range, Set } from 'immutable';

/**
 * Computes the selection when shift-selecting rows.
 *
 * When doing ranges, we may unselect items that were selected in a previous range selection
 * There are 6 cases to handle:
 * [PrevTarget, Anchor, Target]
 * [PrevTarget, Target, Anchor]
 * [Anchor, PrevTarget, Target]
 * [Anchor, Target, PrevTarget]
 * [Target, Anchor, PrevTarget]
 * [Target, PrevTarget, Anchor]
 *
 * @param {Set<Number>} prevSelection
 * @param {Number} prevTarget
 * @param {Number} target
 * @param {Number} anchor
 * @return {Set<Number>}
 */
function shiftSelect(prevSelection: Set<number>, prevTarget: number, target: number, anchor: number): Set<number> {
    if (prevTarget <= anchor && anchor <= target) {
        // [PrevTarget, Anchor, Target]
        return prevSelection.subtract(Range(prevTarget, anchor + 1)).union(Range(anchor, target + 1));
    }

    if (prevTarget <= target && target <= anchor) {
        // [PrevTarget, Target, Anchor]
        return prevSelection.subtract(Range(prevTarget, target + 1)).union(Range(target, anchor + 1));
    }

    if (anchor <= prevTarget && prevTarget <= target) {
        // [Anchor, PrevTarget, Target]
        return prevSelection.union(Range(anchor, target + 1));
    }

    if (anchor <= target && target <= prevTarget) {
        // [Anchor, Target, PrevTarget]
        return prevSelection.subtract(Range(target, prevTarget + 1)).union(Range(anchor, target + 1));
    }

    if (target <= anchor && anchor <= prevTarget) {
        // [Target, Anchor, PrevTarget]
        return prevSelection.subtract(Range(anchor, prevTarget + 1)).union(Range(target, anchor + 1));
    }

    if (target <= prevTarget && target <= anchor) {
        // [Target, PrevTarget, Anchor]
        return prevSelection.union(Range(target, anchor + 1));
    }

    throw new Error(
        `Invalid shiftSelect params: [${Array.prototype.slice.call(
            arguments, // eslint-disable-line prefer-rest-params
        )}]`,
    );
}

export default shiftSelect;
