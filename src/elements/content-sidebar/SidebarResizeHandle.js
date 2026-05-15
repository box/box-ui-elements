/**
 * @flow
 * @file Sidebar Resize Handle — drag-to-resize grip on the left edge of the sidebar.
 * @author Box
 */

import * as React from 'react';
import './SidebarResizeHandle.scss';

type Props = {
    maxWidth: number,
    minWidth: number,
    onResize: (width: number) => void,
    width: number,
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const SidebarResizeHandle = ({ maxWidth, minWidth, onResize, width }: Props) => {
    const startXRef = React.useRef<number>(0);
    const startWidthRef = React.useRef<number>(width);
    const [isDragging, setIsDragging] = React.useState(false);

    const handlePointerMove = React.useCallback(
        (event: PointerEvent) => {
            // Sidebar lives on the RIGHT edge of the viewport, and the handle is on its LEFT edge.
            // Dragging LEFT (smaller clientX) should GROW the sidebar.
            const deltaX = startXRef.current - event.clientX;
            const nextWidth = clamp(startWidthRef.current + deltaX, minWidth, maxWidth);
            onResize(nextWidth);
        },
        [maxWidth, minWidth, onResize],
    );

    const handlePointerUp = React.useCallback(
        (event: PointerEvent) => {
            setIsDragging(false);
            const { target } = event;
            // Flow lib types pointer-capture methods as `(string)`; the real DOM API takes a number.
            // Flow's Element doesn't declare `hasPointerCapture` either, so cast for that one call.
            const pointerId = ((event.pointerId: any): string);
            if (target instanceof Element && (target: any).hasPointerCapture(pointerId)) {
                target.releasePointerCapture(pointerId);
            }
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        },
        [handlePointerMove],
    );

    const handlePointerDown = (event: SyntheticPointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        startXRef.current = event.clientX;
        startWidthRef.current = width;
        setIsDragging(true);
        // Flow lib types setPointerCapture as `(string)`; the real DOM API takes a number.
        // jsdom doesn't implement setPointerCapture, so guard the call.
        if (typeof event.currentTarget.setPointerCapture === 'function') {
            event.currentTarget.setPointerCapture(((event.pointerId: any): string));
        }
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    React.useEffect(() => {
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    return (
        <div
            aria-hidden="true"
            className={`bcs-resize-handle${isDragging ? ' bcs-resize-handle-is-dragging' : ''}`}
            data-testid="sidebar-resize-handle"
            onPointerDown={handlePointerDown}
        />
    );
};

export default SidebarResizeHandle;
