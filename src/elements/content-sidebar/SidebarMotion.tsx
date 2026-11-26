import * as React from 'react';

import './SidebarMotion.scss';

type Props = {
    children: React.ReactElement<{ isOpen: boolean }>;
    enabled: boolean;
    isOpen: boolean;
    sidebarRef: React.RefObject<HTMLElement>;
};

type State = { present: boolean };
type Snapshot = {
    left: number;
    width: number;
    opacity: string;
    keyboard: boolean;
    backgroundColor?: string;
} | null;

// Read the exposed edge, not a fixed theme color: code, documents and media
// can each paint a different background inside the preview shell.
const getPreviewBackground = (sidebar: HTMLElement): string | undefined => {
    const content = sidebar.closest('.bcpr-body')?.querySelector('.bcpr-content');
    if (!content) return undefined;
    const { right, top, height } = content.getBoundingClientRect();
    const layers = content.ownerDocument.elementsFromPoint?.(right - 1, top + height / 4) ?? [];
    const surface = content.querySelector('.bp') ?? content;
    for (const layer of [...layers.filter(element => content.contains(element)), surface]) {
        const { backgroundColor } = getComputedStyle(layer);
        if (backgroundColor && backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            return backgroundColor;
        }
    }
    return undefined;
};

// A drawer covers more distance than a menu. Give entry room to settle, but
// let dismissal finish sooner. Both paths start responding immediately.
const OPEN_DURATION = 280;
const CLOSE_DURATION = 200;
const EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * Retains the real panel during exit. The sidebar takes its destination layout
 * once; a FLIP translation moves the rail and panel without scaling text or
 * resizing the document on every animation frame.
 */
class SidebarMotion extends React.Component<Props, State, Snapshot> {
    state: State = { present: this.props.isOpen };

    panelRef = React.createRef<HTMLDivElement>();

    animation: Animation | null = null;

    restorePreviewBackground: (() => void) | null = null;

    static getDerivedStateFromProps({ enabled, isOpen }: Props): Partial<State> | null {
        return isOpen || !enabled ? { present: isOpen } : null;
    }

    getSnapshotBeforeUpdate(prevProps: Props): Snapshot {
        const { enabled, isOpen, sidebarRef } = this.props;
        const sidebar = sidebarRef.current;
        const panel = this.panelRef.current;
        if (!enabled || !prevProps.enabled || prevProps.isOpen === isOpen || !sidebar || !panel) {
            return null;
        }

        const { activeElement } = sidebar.ownerDocument;
        return {
            left: sidebar.getBoundingClientRect().left,
            width: panel.getBoundingClientRect().width,
            opacity: getComputedStyle(panel).opacity,
            backgroundColor: getPreviewBackground(sidebar),
            keyboard: !!activeElement && activeElement.matches(':focus-visible'),
        };
    }

    componentDidMount() {
        this.updateInteractivity();
    }

    componentDidUpdate(prevProps: Props, prevState: State, snapshot: Snapshot) {
        const { enabled, isOpen, sidebarRef } = this.props;
        const sidebar = sidebarRef.current;
        const panel = this.panelRef.current;
        this.updateInteractivity();

        if (!enabled || prevProps.enabled !== enabled) {
            this.finish();
            return;
        }
        if (prevProps.isOpen === isOpen || !sidebar || !panel) {
            return;
        }

        // The snapshot includes the current animated position. Cancel only after
        // reading it so a quick reversal starts exactly where the user sees it.
        this.animation?.cancel();
        this.animation = null;
        this.clearMotionStyles();
        panel.style.width = !isOpen && snapshot ? `${snapshot.width}px` : '';

        if (!snapshot || snapshot.keyboard || !sidebar.animate) {
            this.finish();
            return;
        }

        const body = sidebar.closest<HTMLElement>('.bcpr-body');
        if (body && snapshot.backgroundColor) {
            const previousBackground = body.style.backgroundColor;
            body.style.backgroundColor = snapshot.backgroundColor;
            this.restorePreviewBackground = () => {
                body.style.backgroundColor = previousBackground;
            };
        }
        sidebar.classList.add('bcs-is-animating');

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Keep the exiting drawer at its previous position while it fades.
        // The collapsed rail takes its final position after the fade completes.
        if (reducedMotion && !isOpen) {
            sidebar.style.transform = `translateX(${snapshot.left - sidebar.getBoundingClientRect().left}px)`;
        }
        const target = reducedMotion ? panel : sidebar;
        const keyframes = reducedMotion
            ? [{ opacity: isOpen && !prevState.present ? '0' : snapshot.opacity }, { opacity: isOpen ? '1' : '0' }]
            : [
                  { transform: `translateX(${snapshot.left - sidebar.getBoundingClientRect().left}px)` },
                  { transform: 'translateX(0)' },
              ];
        const duration = isOpen ? OPEN_DURATION : CLOSE_DURATION;
        const animation = target.animate(keyframes, {
            duration: reducedMotion ? 120 : duration,
            easing: EASING,
            fill: 'both',
        });
        this.animation = animation;
        animation.onfinish = () => {
            if (this.animation === animation) {
                this.finish();
            }
        };
    }

    componentWillUnmount() {
        this.animation?.cancel();
        this.clearMotionStyles();
    }

    clearMotionStyles() {
        const sidebar = this.props.sidebarRef.current;
        if (sidebar) {
            sidebar.classList.remove('bcs-is-animating');
            sidebar.style.transform = '';
        }
        if (this.panelRef.current) {
            this.panelRef.current.style.width = '';
        }
        this.restorePreviewBackground?.();
        this.restorePreviewBackground = null;
    }

    updateInteractivity() {
        const { isOpen, sidebarRef } = this.props;
        const panel = this.panelRef.current;
        if (!panel) {
            return;
        }
        if (!isOpen && panel.contains(panel.ownerDocument.activeElement)) {
            sidebarRef.current?.querySelector<HTMLElement>('[data-testid="sidebartoggle"]')?.focus();
        }
        // Retained exit content must never remain in the tab order.
        panel.toggleAttribute('inert', !isOpen);
    }

    finish() {
        this.animation?.cancel();
        this.animation = null;
        this.clearMotionStyles();
        if (!this.props.isOpen && this.state.present) {
            this.setState({ present: false });
        }
    }

    render() {
        const { children, enabled, isOpen } = this.props;
        const present = enabled ? this.state.present : isOpen;
        return (
            <div
                aria-hidden={!isOpen}
                className={enabled ? 'bcs-SidebarMotion' : 'bcs-SidebarMotion--disabled'}
                data-closed={!isOpen || undefined}
                ref={this.panelRef}
            >
                {React.cloneElement(children, { isOpen: present })}
            </div>
        );
    }
}

export default SidebarMotion;
