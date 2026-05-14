import * as React from 'react';
import { act, fireEvent, render, screen } from '../../../test-utils/testing-library';
import SidebarResizeHandle from '../SidebarResizeHandle';

describe('elements/content-sidebar/SidebarResizeHandle', () => {
    const defaultProps = {
        maxWidth: 800,
        minWidth: 400,
        onResize: jest.fn(),
        width: 400,
    };

    // pointerdown is wired via React's synthetic system → use fireEvent.
    // pointermove / pointerup are attached via raw window.addEventListener → dispatch a plain Event.
    const dispatchWindowPointer = (type, init) => {
        const event = new Event(type, { bubbles: true });
        Object.assign(event, init);
        window.dispatchEvent(event);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders a decorative aria-hidden handle', () => {
        render(<SidebarResizeHandle {...defaultProps} />);
        const handle = screen.getByTestId('sidebar-resize-handle');
        expect(handle).toHaveAttribute('aria-hidden', 'true');
        expect(handle).toHaveClass('bcs-resize-handle');
    });

    test('calls onResize with growing width when dragging left from the handle', () => {
        const onResize = jest.fn();
        render(<SidebarResizeHandle {...defaultProps} onResize={onResize} width={400} />);
        const handle = screen.getByTestId('sidebar-resize-handle');

        // Pointer down at clientX=1000, then move left to clientX=950 (delta=50, sidebar grows by 50)
        fireEvent(
            handle,
            Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: 1000 }), { pointerId: 1 }),
        );
        dispatchWindowPointer('pointermove', { clientX: 950, pointerId: 1 });

        expect(onResize).toHaveBeenCalledWith(450);
    });

    test('calls onResize with shrinking width when dragging right from the handle', () => {
        const onResize = jest.fn();
        render(<SidebarResizeHandle {...defaultProps} onResize={onResize} width={600} />);
        const handle = screen.getByTestId('sidebar-resize-handle');

        // Pointer down at clientX=1000, then move right to clientX=1080 (delta=-80, sidebar shrinks)
        fireEvent(
            handle,
            Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: 1000 }), { pointerId: 1 }),
        );
        dispatchWindowPointer('pointermove', { clientX: 1080, pointerId: 1 });

        expect(onResize).toHaveBeenCalledWith(520);
    });

    test('clamps to minWidth when the drag would go below it', () => {
        const onResize = jest.fn();
        render(<SidebarResizeHandle {...defaultProps} minWidth={400} maxWidth={800} onResize={onResize} width={420} />);
        const handle = screen.getByTestId('sidebar-resize-handle');

        // Pointer down at 1000, drag right by 200 → would be width=220, clamps to minWidth=400
        fireEvent(
            handle,
            Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: 1000 }), { pointerId: 1 }),
        );
        dispatchWindowPointer('pointermove', { clientX: 1200, pointerId: 1 });

        expect(onResize).toHaveBeenCalledWith(400);
    });

    test('clamps to maxWidth when the drag would exceed it', () => {
        const onResize = jest.fn();
        render(<SidebarResizeHandle {...defaultProps} minWidth={400} maxWidth={800} onResize={onResize} width={780} />);
        const handle = screen.getByTestId('sidebar-resize-handle');

        // Pointer down at 1000, drag left by 200 → would be width=980, clamps to maxWidth=800
        fireEvent(
            handle,
            Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: 1000 }), { pointerId: 1 }),
        );
        dispatchWindowPointer('pointermove', { clientX: 800, pointerId: 1 });

        expect(onResize).toHaveBeenCalledWith(800);
    });

    test('toggles the dragging class while a drag is in progress', () => {
        render(<SidebarResizeHandle {...defaultProps} />);
        const handle = screen.getByTestId('sidebar-resize-handle');

        expect(handle).not.toHaveClass('bcs-resize-handle-is-dragging');

        fireEvent(
            handle,
            Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: 1000 }), { pointerId: 1 }),
        );
        expect(handle).toHaveClass('bcs-resize-handle-is-dragging');

        act(() => {
            dispatchWindowPointer('pointerup', { clientX: 1000, pointerId: 1 });
        });
        expect(handle).not.toHaveClass('bcs-resize-handle-is-dragging');
    });

    test('removes window pointer listeners on unmount', () => {
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = render(<SidebarResizeHandle {...defaultProps} />);
        unmount();
        expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
        removeSpy.mockRestore();
    });
});
