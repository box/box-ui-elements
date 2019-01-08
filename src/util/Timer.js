/**
 * @flow
 * @file Timer Class
 * @author Box
 */

class Timer {
    mark(tag: string): void {
        performance.mark(tag);
    }

    clearMark(tag: string): void {
        performance.clearMarks(tag);
    }
}

export default new Timer();
