import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import SidebarMotion from '../SidebarMotion';

const Panel = ({ isOpen }: { isOpen?: boolean }) =>
    isOpen ? <input aria-label="Draft" defaultValue="Keep my draft" /> : null;

const Harness = ({ isOpen, enabled = true }: { isOpen: boolean; enabled?: boolean }) => {
    const sidebarRef = React.useRef<HTMLElement>(null);
    return (
        <aside ref={sidebarRef}>
            <button data-testid="sidebartoggle" type="button">
                Toggle sidebar
            </button>
            <SidebarMotion enabled={enabled} isOpen={isOpen} sidebarRef={sidebarRef}>
                <Panel />
            </SidebarMotion>
        </aside>
    );
};

describe('elements/content-sidebar/SidebarMotion', () => {
    let animations: Array<{ cancel: jest.Mock; onfinish: (() => void) | null }>;
    let animate: jest.Mock;
    let reducedMotion: boolean;
    const originalAnimate = HTMLElement.prototype.animate;
    const originalElementsFromPoint = document.elementsFromPoint;

    beforeEach(() => {
        animations = [];
        reducedMotion = false;
        animate = jest.fn(() => {
            const animation = { cancel: jest.fn(), onfinish: null };
            animations.push(animation);
            return animation;
        });
        HTMLElement.prototype.animate = animate;
        jest.spyOn(window, 'matchMedia').mockImplementation(
            query => ({ matches: reducedMotion, media: query }) as MediaQueryList,
        );
    });

    afterEach(() => {
        HTMLElement.prototype.animate = originalAnimate;
        document.elementsFromPoint = originalElementsFromPoint;
    });

    const setup = (isOpen: boolean) => {
        const result = render(<Harness isOpen={isOpen} />);
        const sidebar = result.container.querySelector('aside')!;
        const panel = result.container.querySelector('.bcs-SidebarMotion')!;
        const rect = jest.spyOn(sidebar, 'getBoundingClientRect');
        jest.spyOn(panel, 'getBoundingClientRect').mockReturnValue({ width: 380 } as DOMRect);
        return { ...result, rect, panel, sidebar };
    };

    test('does not animate on initial mount', () => {
        setup(true);
        expect(animate).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toHaveValue('Keep my draft');
    });

    test('retains inert exit content until the 200 ms dismissal completes', () => {
        const { rerender, rect, panel, sidebar } = setup(true);
        rect.mockReturnValueOnce({ left: 100 } as DOMRect).mockReturnValue({ left: 480 } as DOMRect);
        rerender(<Harness isOpen={false} />);

        expect(sidebar).toHaveClass('bcs-is-animating');
        expect(panel).toHaveAttribute('inert');
        expect(panel).toHaveAttribute('aria-hidden', 'true');
        expect(panel.querySelector('input')).toHaveValue('Keep my draft');
        expect(panel).toHaveStyle({ width: '380px' });
        expect(animate).toHaveBeenCalledWith(
            [{ transform: 'translateX(-380px)' }, { transform: 'translateX(0)' }],
            expect.objectContaining({ duration: 200 }),
        );

        act(() => animations[0].onfinish?.());
        expect(sidebar).not.toHaveClass('bcs-is-animating');
        expect(panel.querySelector('input')).toBeNull();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('opens in 280 ms from the collapsed rail position', () => {
        const { rerender, rect, panel } = setup(false);
        rect.mockReturnValueOnce({ left: 480 } as DOMRect).mockReturnValue({ left: 100 } as DOMRect);
        rerender(<Harness isOpen />);
        expect(animate).toHaveBeenCalledWith(
            [{ transform: 'translateX(380px)' }, { transform: 'translateX(0)' }],
            expect.objectContaining({ duration: 280 }),
        );
        expect(panel).not.toHaveAttribute('inert');
    });

    test('reverses from the current visual position without discarding the draft', () => {
        const { rerender, rect } = setup(true);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Unsent changes' } });
        rect.mockReturnValueOnce({ left: 100 } as DOMRect).mockReturnValue({ left: 480 } as DOMRect);
        rerender(<Harness isOpen={false} />);
        const closing = animations[0];
        rect.mockReturnValueOnce({ left: 260 } as DOMRect).mockReturnValue({ left: 100 } as DOMRect);
        rerender(<Harness isOpen />);

        expect(closing.cancel).toHaveBeenCalled();
        expect(animate).toHaveBeenLastCalledWith(
            [{ transform: 'translateX(160px)' }, { transform: 'translateX(0)' }],
            expect.objectContaining({ duration: 280 }),
        );
        act(() => closing.onfinish?.());
        expect(screen.getByRole('textbox')).toHaveValue('Unsent changes');
    });

    test('matches the painted viewer edge through reversal and restores the shell background', () => {
        const { rerender, rect, container } = setup(false);
        container.className = 'bcpr-body';
        container.style.backgroundColor = 'white';
        const content = document.createElement('div');
        content.className = 'bcpr-content';
        const surface = document.createElement('div');
        surface.className = 'bp';
        surface.style.backgroundColor = 'rgb(245, 245, 245)';
        const viewer = document.createElement('div');
        viewer.style.backgroundColor = 'rgb(248, 248, 248)';
        surface.appendChild(viewer);
        content.appendChild(surface);
        document.elementsFromPoint = jest.fn(() => [viewer, surface, content]);
        container.appendChild(content);
        rect.mockReturnValue({ left: 100 } as DOMRect);

        rerender(<Harness isOpen />);
        expect(container.style.backgroundColor).toBe('rgb(248, 248, 248)');
        rerender(<Harness isOpen={false} />);
        act(() => animations[0].onfinish?.());
        expect(container.style.backgroundColor).toBe('rgb(248, 248, 248)');
        act(() => animations[1].onfinish?.());
        expect(container.style.backgroundColor).toBe('white');
    });

    test('restores the preview background when an active drawer unmounts', () => {
        const { rerender, rect, container, unmount } = setup(false);
        container.className = 'bcpr-body';
        const content = document.createElement('div');
        content.className = 'bcpr-content';
        content.style.backgroundColor = 'black';
        container.appendChild(content);
        rect.mockReturnValue({ left: 100 } as DOMRect);
        rerender(<Harness isOpen />);
        expect(container.style.backgroundColor).toBe('black');
        unmount();
        expect(container.style.backgroundColor).toBe('');
    });

    test('uses only a short opacity transition for reduced motion', () => {
        reducedMotion = true;
        const { rerender, rect } = setup(false);
        rect.mockReturnValue({ left: 100 } as DOMRect);
        rerender(<Harness isOpen />);
        expect(animate).toHaveBeenCalledWith(
            [{ opacity: '0' }, { opacity: '1' }],
            expect.objectContaining({ duration: 120 }),
        );
    });

    test('keeps reduced-motion exit content at its original position until the fade completes', () => {
        reducedMotion = true;
        const { rerender, rect, sidebar, panel } = setup(true);
        rect.mockReturnValueOnce({ left: 100 } as DOMRect).mockReturnValue({ left: 480 } as DOMRect);
        rerender(<Harness isOpen={false} />);
        expect(sidebar.style.transform).toBe('translateX(-380px)');
        expect(panel.querySelector('input')).not.toBeNull();
        expect(animate).toHaveBeenCalledWith(
            [{ opacity: '' }, { opacity: '0' }],
            expect.objectContaining({ duration: 120 }),
        );
        act(() => animations[0].onfinish?.());
        expect(sidebar.style.transform).toBe('');
        expect(panel.style.width).toBe('');
        expect(panel.querySelector('input')).toBeNull();
    });

    test('keeps keyboard activation from a header button immediate', () => {
        const { rerender, container } = setup(false);
        const headerButton = document.createElement('button');
        container.appendChild(headerButton);
        headerButton.focus();
        jest.spyOn(headerButton, 'matches').mockImplementation(selector => selector === ':focus-visible');
        rerender(<Harness isOpen />);
        expect(animate).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('cleans motion styles when the layout becomes narrow during exit', () => {
        const { rerender, rect, sidebar, panel } = setup(true);
        rect.mockReturnValueOnce({ left: 100 } as DOMRect).mockReturnValue({ left: 480 } as DOMRect);
        rerender(<Harness isOpen={false} />);
        rerender(<Harness enabled={false} isOpen={false} />);
        expect(animations[0].cancel).toHaveBeenCalled();
        expect(sidebar).not.toHaveClass('bcs-is-animating');
        expect(panel.style.width).toBe('');
    });

    test('restores focus to the rail when closing from inside the panel', () => {
        const { rerender, rect } = setup(true);
        rect.mockReturnValue({ left: 100 } as DOMRect);
        screen.getByRole('textbox').focus();
        rerender(<Harness isOpen={false} />);
        expect(screen.getByRole('button')).toHaveFocus();
    });

    test('keeps keyboard toggles immediate', () => {
        const { rerender, rect } = setup(true);
        rect.mockReturnValue({ left: 100 } as DOMRect);
        const toggle = screen.getByRole('button');
        toggle.focus();
        jest.spyOn(toggle, 'matches').mockImplementation(selector => selector === ':focus-visible');
        rerender(<Harness isOpen={false} />);
        expect(animate).not.toHaveBeenCalled();
        expect(screen.queryByRole('textbox')).toBeNull();
    });

    test('cleans up an active animation on unmount', () => {
        const { rerender, rect, unmount } = setup(false);
        rect.mockReturnValue({ left: 100 } as DOMRect);
        rerender(<Harness isOpen />);
        unmount();
        expect(animations[0].cancel).toHaveBeenCalled();
    });

    test('keeps the existing immediate behavior when disabled', () => {
        const { rerender } = render(<Harness enabled={false} isOpen />);
        rerender(<Harness enabled={false} isOpen={false} />);
        expect(screen.queryByRole('textbox')).toBeNull();
        expect(animate).not.toHaveBeenCalled();
    });
});
