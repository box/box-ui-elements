import { Range } from 'immutable';

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
function shiftSelect(prevSelection, prevTarget, target, anchor) {
    if (prevTarget <= anchor && anchor <= target) {
        // [PrevTarget, Anchor, Target]
        return prevSelection.subtract(new Range(prevTarget, anchor + 1)).union(new Range(anchor, target + 1));
    }
    if (prevTarget <= target && target <= anchor) {
        // [PrevTarget, Target, Anchor]
        return prevSelection.subtract(new Range(prevTarget, target + 1)).union(new Range(target, anchor + 1));
    }
    if (anchor <= prevTarget && prevTarget <= target) {
        // [Anchor, PrevTarget, Target]
        return prevSelection.union(new Range(anchor, target + 1));
    }
    if (anchor <= target && target <= prevTarget) {
        // [Anchor, Target, PrevTarget]
        return prevSelection.subtract(new Range(target, prevTarget + 1)).union(new Range(anchor, target + 1));
    }
    if (target <= anchor && anchor <= prevTarget) {
        // [Target, Anchor, PrevTarget]
        return prevSelection.subtract(new Range(anchor, prevTarget + 1)).union(new Range(target, anchor + 1));
    }
    if (target <= prevTarget && target <= anchor) {
        // [Target, PrevTarget, Anchor]
        return prevSelection.union(new Range(target, anchor + 1));
    }

    throw new Error(
        `Invalid shiftSelect params: [${Array.prototype.slice.call(
            arguments, // eslint-disable-line prefer-rest-params
        )}]`,
    );
}

export default shiftSelect;
