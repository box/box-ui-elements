import { act } from '@testing-library/react';

/** Runs the action, then the animation frames, until the preview width has stopped changing. */
export const letPreviewWidthSettle = (action: () => void): void => {
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrameId = 1;
    const requestFrame = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
        const frameId = nextFrameId;
        nextFrameId += 1;
        frames.set(frameId, callback);
        return frameId;
    });
    const cancelFrame = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(frameId => {
        frames.delete(frameId);
    });
    try {
        act(() => {
            action();
        });
        act(() => {
            let framesRun = 0;
            while (frames.size > 0 && framesRun < 8) {
                framesRun += 1;
                const batch: FrameRequestCallback[] = [];
                frames.forEach(frame => batch.push(frame));
                frames.clear();
                batch.forEach(frame => frame(0));
            }
        });
    } finally {
        requestFrame.mockRestore();
        cancelFrame.mockRestore();
    }
};
