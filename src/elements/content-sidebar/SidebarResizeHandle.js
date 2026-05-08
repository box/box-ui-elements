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
    onResizeEnd?: () => void,
    onResizeStart?: () => void,
    width: number,
};

const KEYBOARD_STEP = 16;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const SidebarResizeHandle = ({ maxWidth, minWidth, onResize, onResizeEnd, onResizeStart, width }: Props) => {
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
            if (target instanceof Element && target.hasPointerCapture?.(event.pointerId)) {
                target.releasePointerCapture(event.pointerId);
            }
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            onResizeEnd?.();
        },
        [handlePointerMove, onResizeEnd],
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        startXRef.current = event.clientX;
        startWidthRef.current = width;
        setIsDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        onResizeStart?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // ArrowLeft grows (same direction as dragging left), ArrowRight shrinks.
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            onResize(clamp(width + KEYBOARD_STEP, minWidth, maxWidth));
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            onResize(clamp(width - KEYBOARD_STEP, minWidth, maxWidth));
        } else if (event.key === 'Home') {
            event.preventDefault();
            onResize(minWidth);
        } else if (event.key === 'End') {
            event.preventDefault();
            onResize(maxWidth);
        }
    };

    React.useEffect(() => {
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    // role="separator" with aria-valuenow is a focusable ARIA widget and needs both
    // pointer + keyboard interactions on the element itself.
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    return (
        <div
            aria-label="Resize sidebar"
            aria-orientation="vertical"
            aria-valuemax={maxWidth}
            aria-valuemin={minWidth}
            aria-valuenow={width}
            className={`bcs-resize-handle${isDragging ? ' bcs-resize-handle-is-dragging' : ''}`}
            data-testid="sidebar-resize-handle"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            role="separator"
            tabIndex={0}
        />
    );
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
};

export default SidebarResizeHandle;
