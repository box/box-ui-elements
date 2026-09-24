import * as React from 'react';
import { act, render, screen } from '@testing-library/react';

import { FeedEntryType, ViewType } from '../../../common/types/SidebarNavigation';
import type {
    InternalSidebarNavigation,
    InternalSidebarNavigationHandler,
} from '../../../common/types/SidebarNavigation';
import CommentRangeDragCreateProvider from '../CommentRangeDragCreateProvider';
import { useMediaTimestamp } from '../useMediaTimestamp';
import type { PreviewHandle, ViewerHandle } from '../types';

type Listener = (payload: unknown) => void;

const createViewer = () => {
    const listeners = new Map<string, Set<Listener>>();
    const viewer = {
        addListener: (event: string, handler: Listener) => {
            const handlers = listeners.get(event) ?? new Set<Listener>();
            handlers.add(handler);
            listeners.set(event, handlers);
        },
        emit: jest.fn(),
        isDestroyed: () => false,
        removeListener: (event: string, handler: Listener) => {
            listeners.get(event)?.delete(handler);
        },
    };
    return {
        emit: (event: string, payload?: unknown) => {
            listeners.get(event)?.forEach(handler => handler(payload));
        },
        listenerCount: (event: string) => listeners.get(event)?.size ?? 0,
        viewer: viewer as ViewerHandle,
    };
};

const TimestampReadout = ({ getViewer }: { getViewer: () => ViewerHandle | null }) => {
    const { isPressed, timestampEndMs, timestampMs } = useMediaTimestamp(true, 'standard', 24, {
        getViewer,
        isAudioPlayerV2: true,
    });
    return (
        <div>
            <span data-testid="pressed">{String(isPressed)}</span>
            <span data-testid="ms">{String(timestampMs)}</span>
            <span data-testid="end-ms">{String(timestampEndMs)}</span>
        </div>
    );
};

describe('CommentRangeDragCreateProvider', () => {
    const history = () => ({ push: jest.fn(), replace: jest.fn() });

    test('should adopt a drag create that arrives before the feed mounts without emitting a draft', () => {
        const viewerHarness = createViewer();
        const navigation = history();
        const getViewer = () => viewerHarness.viewer;
        const props = {
            enabled: true,
            fileId: 'file-a',
            getViewer,
            history: navigation,
            location: { pathname: '/details' },
        };

        const { rerender } = render(
            <CommentRangeDragCreateProvider {...props}>
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
        });

        expect(navigation.push).toHaveBeenCalledWith({ pathname: '/activity', state: { open: true } });
        expect(viewerHarness.viewer.emit).not.toHaveBeenCalled();

        rerender(
            <CommentRangeDragCreateProvider {...props}>
                <div className="bcs-NewActivityFeed-editor">
                    <div contentEditable="true" data-testid="composer" />
                </div>
                <TimestampReadout getViewer={getViewer} />
            </CommentRangeDragCreateProvider>,
        );

        expect(screen.getByTestId('pressed').textContent).toBe('true');
        expect(document.activeElement).toBe(screen.getByTestId('composer'));
        expect(screen.getByTestId('ms').textContent).toBe('1000');
        expect(screen.getByTestId('end-ms').textContent).toBe('4000');
        expect(viewerHarness.viewer.emit).not.toHaveBeenCalled();
    });

    test('should drop an unconsumed drag create when the viewer dismisses it', () => {
        const viewerHarness = createViewer();
        const navigation = history();
        const getViewer = () => viewerHarness.viewer;
        const props = {
            enabled: true,
            getViewer,
            history: navigation,
            location: { pathname: '/details' },
        };

        const { rerender } = render(
            <CommentRangeDragCreateProvider {...props}>
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
            viewerHarness.emit('comment_range_draft_dismiss');
        });

        rerender(
            <CommentRangeDragCreateProvider {...props}>
                <TimestampReadout getViewer={getViewer} />
            </CommentRangeDragCreateProvider>,
        );

        expect(screen.getByTestId('pressed').textContent).toBe('false');
        expect(screen.getByTestId('ms').textContent).toBe('0');
        expect(viewerHarness.viewer.emit).not.toHaveBeenCalled();
    });

    test('should not apply a stashed drag create to a different file', () => {
        const viewerHarness = createViewer();
        const getViewer = () => viewerHarness.viewer;
        const props = {
            enabled: true,
            getViewer,
            history: history(),
            location: { pathname: '/details' },
        };

        const { rerender } = render(
            <CommentRangeDragCreateProvider {...props} fileId="file-a">
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
        });

        rerender(
            <CommentRangeDragCreateProvider {...props} fileId="file-b">
                <TimestampReadout getViewer={getViewer} />
            </CommentRangeDragCreateProvider>,
        );

        expect(screen.getByTestId('pressed').textContent).toBe('false');
    });

    test('should adopt a drag create while the feed is already mounted without emitting a draft', () => {
        const viewerHarness = createViewer();
        const navigation = history();
        const getViewer = () => viewerHarness.viewer;

        render(
            <CommentRangeDragCreateProvider
                enabled
                getViewer={getViewer}
                history={navigation}
                location={{ pathname: '/details' }}
            >
                <TimestampReadout getViewer={getViewer} />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
        });

        expect(screen.getByTestId('pressed').textContent).toBe('true');
        expect(screen.getByTestId('ms').textContent).toBe('1000');
        expect(screen.getByTestId('end-ms').textContent).toBe('4000');
        expect(navigation.push).toHaveBeenCalledWith({ pathname: '/activity', state: { open: true } });
        expect(viewerHarness.viewer.emit).not.toHaveBeenCalled();
    });

    test('should ignore a malformed drag create', () => {
        const viewerHarness = createViewer();
        const navigation = history();

        render(
            <CommentRangeDragCreateProvider
                enabled
                getViewer={() => viewerHarness.viewer}
                history={navigation}
                location={{ pathname: '/details' }}
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { startMs: -1 });
        });

        expect(navigation.push).not.toHaveBeenCalled();
        expect(navigation.replace).not.toHaveBeenCalled();
    });

    test('should replace when already on the activity route', () => {
        const viewerHarness = createViewer();
        const navigation = history();

        render(
            <CommentRangeDragCreateProvider
                enabled
                getViewer={() => viewerHarness.viewer}
                history={navigation}
                location={{ pathname: '/activity' }}
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
        });

        expect(navigation.replace).toHaveBeenCalledWith({ pathname: '/activity', state: { open: true } });
        expect(navigation.push).not.toHaveBeenCalled();
    });

    test('should call the internal handler when the router is disabled', () => {
        const viewerHarness = createViewer();
        const navigation = history();
        const internalSidebarNavigationHandler = jest.fn() as InternalSidebarNavigationHandler;
        const internalSidebarNavigation: InternalSidebarNavigation = {
            activeFeedEntryId: '9',
            activeFeedEntryType: FeedEntryType.COMMENTS,
            sidebar: ViewType.ACTIVITY,
        };

        render(
            <CommentRangeDragCreateProvider
                enabled
                getViewer={() => viewerHarness.viewer}
                history={navigation}
                internalSidebarNavigation={internalSidebarNavigation}
                internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                location={{ pathname: '/activity/comments/9' }}
                routerDisabled
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
        });

        expect(internalSidebarNavigationHandler).toHaveBeenCalledWith(
            { open: true, sidebar: ViewType.ACTIVITY },
            false,
        );
        expect(navigation.push).not.toHaveBeenCalled();
    });

    test('should move listeners onto a replacement viewer', () => {
        jest.useFakeTimers();
        const first = createViewer();
        const second = createViewer();
        let current = first;
        const navigation = history();
        const { unmount } = render(
            <CommentRangeDragCreateProvider
                enabled
                getViewer={() => current.viewer}
                history={navigation}
                location={{ pathname: '/details' }}
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        try {
            expect(first.listenerCount('comment_range_compose')).toBe(1);

            act(() => {
                jest.advanceTimersByTime(100);
            });
            expect(first.listenerCount('comment_range_compose')).toBe(1);

            current = second;
            act(() => {
                jest.advanceTimersByTime(100);
            });

            expect(first.listenerCount('comment_range_compose')).toBe(0);
            expect(first.listenerCount('comment_range_draft_dismiss')).toBe(0);
            expect(second.listenerCount('comment_range_compose')).toBe(1);
            expect(second.listenerCount('comment_range_draft_dismiss')).toBe(1);
        } finally {
            unmount();
            jest.useRealTimers();
        }
    });

    test('should detach listeners when the attached viewer is destroyed', () => {
        jest.useFakeTimers();
        let destroyed = false;
        const viewerHarness = createViewer();
        viewerHarness.viewer.isDestroyed = () => destroyed;
        const navigation = history();
        const { unmount } = render(
            <CommentRangeDragCreateProvider
                enabled
                getViewer={() => (destroyed ? null : viewerHarness.viewer)}
                history={navigation}
                location={{ pathname: '/details' }}
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        try {
            expect(viewerHarness.listenerCount('comment_range_compose')).toBe(1);

            destroyed = true;
            act(() => {
                jest.advanceTimersByTime(100);
            });

            expect(viewerHarness.listenerCount('comment_range_compose')).toBe(0);
            expect(viewerHarness.listenerCount('comment_range_draft_dismiss')).toBe(0);
        } finally {
            unmount();
            jest.useRealTimers();
        }
    });

    test('should attach through getPreview when getViewer is empty', () => {
        const viewerHarness = createViewer();
        const navigation = history();
        const getPreview = (): PreviewHandle => ({ getCurrentViewer: () => viewerHarness.viewer });

        render(
            <CommentRangeDragCreateProvider
                enabled
                getPreview={getPreview}
                getViewer={() => null}
                history={navigation}
                location={{ pathname: '/skills' }}
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        act(() => {
            viewerHarness.emit('comment_range_compose', { endMs: 4000, startMs: 1000 });
        });

        expect(navigation.push).toHaveBeenCalledWith({ pathname: '/activity', state: { open: true } });
    });

    test('should not throw when the current viewer is destroyed and there is no activity listener yet', () => {
        const navigation = history();
        const destroyed = {
            addListener: jest.fn(),
            emit: jest.fn(),
            isDestroyed: () => true,
            removeListener: jest.fn(),
        };

        expect(() => {
            render(
                <CommentRangeDragCreateProvider
                    enabled
                    getPreview={() => ({ getCurrentViewer: () => destroyed })}
                    getViewer={() => null}
                    history={navigation}
                    location={{ pathname: '/details' }}
                >
                    <div />
                </CommentRangeDragCreateProvider>,
            );
        }).not.toThrow();

        expect(destroyed.addListener).not.toHaveBeenCalled();
        expect(navigation.push).not.toHaveBeenCalled();
    });

    test('should not listen when drag create is disabled', () => {
        const viewerHarness = createViewer();
        const navigation = history();

        render(
            <CommentRangeDragCreateProvider
                enabled={false}
                getViewer={() => viewerHarness.viewer}
                history={navigation}
                location={{ pathname: '/details' }}
            >
                <div />
            </CommentRangeDragCreateProvider>,
        );

        expect(viewerHarness.listenerCount('comment_range_compose')).toBe(0);
        expect(navigation.push).not.toHaveBeenCalled();
    });
});
