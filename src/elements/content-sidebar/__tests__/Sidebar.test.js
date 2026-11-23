import * as React from 'react';
import { act, fireEvent, render, screen } from '../../../test-utils/testing-library';
import {
    SIDEBAR_FORCE_KEY,
    SIDEBAR_FORCE_VALUE_CLOSED,
    SIDEBAR_FORCE_VALUE_OPEN,
    SIDEBAR_SELECTED_PANEL_KEY,
    SidebarComponent as Sidebar,
} from '../Sidebar';
import SidebarNav from '../SidebarNav';
import LocalStore from '../../../utils/LocalStore';

const mockSidebarPanels = jest.fn(() => 'SidebarPanels');
const mockSidebarPanelsRefresh = jest.fn();

jest.mock('../SidebarNav', () => ({
    __esModule: true,
    default: jest.fn(() => 'SidebarNav'),
}));
// forwardRef lets Sidebar reach refresh() through its ref, same as with the real SidebarPanels
jest.mock('../SidebarPanels', () => {
    const { forwardRef, useImperativeHandle } = jest.requireActual('react');
    return {
        __esModule: true,
        default: forwardRef((props, ref) => {
            useImperativeHandle(ref, () => ({ refresh: mockSidebarPanelsRefresh }));
            return mockSidebarPanels(props);
        }),
    };
});
jest.mock('../../common/async-load', () => () => 'LoadableComponent');
jest.mock('../../../utils/LocalStore');

describe('elements/content-sidebar/Sidebar', () => {
    const file = {
        extension: 'pdf',
        id: 'id',
        file_version: {
            id: '123',
        },
    };

    const withDocgenFeature = {
        enabled: true,
        checkDocGenTemplate: jest.fn(),
        isDocGenTemplate: false,
    };

    const withOutDocgenFeature = {
        enabled: false,
        checkDocGenTemplate: jest.fn(),
        isDocGenTemplate: false,
    };

    const defaultProps = {
        file,
        location: { pathname: '/' },
        docGenSidebarProps: withOutDocgenFeature,
    };

    const getSidebar = props => <Sidebar {...defaultProps} {...props} />;

    const getSidebarPanelsProps = () => mockSidebarPanels.mock.lastCall[0];

    beforeEach(() => {
        LocalStore.mockClear();
    });

    describe('componentDidMount', () => {
        test('should call checkDocGenTemplate if docgen is enabeld', () => {
            render(
                getSidebar({
                    docGenSidebarProps: withDocgenFeature,
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            expect(withDocgenFeature.checkDocGenTemplate).toHaveBeenCalledTimes(1);
        });

        test.each`
            localStoreValue | expected
            ${'closed'}     | ${false}
            ${'open'}       | ${true}
            ${null}         | ${true}
        `(
            'given the LocalStore value for open state = localStoreValue, should call onOpenChange with $expected and "initialState" parameter = true',
            ({ localStoreValue, expected }) => {
                const mockOnOpenChange = jest.fn();
                LocalStore.mockImplementationOnce(() => ({
                    getItem: jest.fn(() => localStoreValue),
                    setItem: jest.fn(),
                }));

                render(
                    getSidebar({
                        onOpenChange: mockOnOpenChange,
                    }),
                );
                expect(mockOnOpenChange).toBeCalledWith(expected, true);
            },
        );
    });

    describe('componentDidUpdate', () => {
        const mockSetItem = jest.fn();

        beforeEach(() => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => null),
                setItem: mockSetItem,
            }));
        });

        test('should not reset the sidebar on file change after a user-initiated location change', () => {
            const history = { replace: jest.fn() };
            const location = { pathname: '/details' };
            const { rerender } = render(getSidebar({ fileId: 'file-1', history, location: { pathname: '/activity' } }));

            rerender(getSidebar({ fileId: 'file-1', history, location }));
            rerender(getSidebar({ fileId: 'file-2', history, location }));

            expect(history.replace).not.toHaveBeenCalled();
        });

        test('should reset the sidebar on file change after an app-initiated location change', () => {
            const history = { replace: jest.fn() };
            const location = { pathname: '/details', state: { silent: true } };
            const { rerender } = render(getSidebar({ fileId: 'file-1', history, location: { pathname: '/activity' } }));

            rerender(getSidebar({ fileId: 'file-1', history, location }));
            rerender(getSidebar({ fileId: 'file-2', history, location }));

            expect(history.replace).toHaveBeenCalledWith({ pathname: '/', state: { silent: true } });
        });

        test('should set the forced open state if the location state is present', () => {
            const { rerender } = render(getSidebar({ location: { pathname: '/' } }));

            rerender(getSidebar({ location: { pathname: '/details' } }));
            expect(mockSetItem).not.toHaveBeenCalledWith(SIDEBAR_FORCE_KEY, expect.anything());

            rerender(getSidebar({ location: { pathname: '/details/inner', state: { open: true, silent: true } } }));
            expect(mockSetItem).not.toHaveBeenCalledWith(SIDEBAR_FORCE_KEY, expect.anything());

            rerender(getSidebar({ location: { pathname: '/', state: { open: true } } }));
            expect(mockSetItem).toHaveBeenLastCalledWith(SIDEBAR_FORCE_KEY, SIDEBAR_FORCE_VALUE_OPEN);

            rerender(getSidebar({ location: { pathname: '/', state: { open: false } } }));
            expect(mockSetItem).toHaveBeenLastCalledWith(SIDEBAR_FORCE_KEY, SIDEBAR_FORCE_VALUE_CLOSED);
        });
        test('should re-check whether a file is docgen template on file change', () => {
            const { rerender } = render(
                getSidebar({
                    docGenSidebarProps: withDocgenFeature,
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            rerender(
                getSidebar({
                    docGenSidebarProps: withDocgenFeature,
                    file: { ...file, id: 'new-file' },
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            expect(withDocgenFeature.checkDocGenTemplate).toHaveBeenCalledTimes(2);
        });
        test('should redirect to dogen tab if the new file is a docgen template', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/activity/comments/1234',
                },
            };
            const { rerender } = render(
                getSidebar({
                    history: historyMock,
                    docGenSidebarProps: withDocgenFeature,
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            rerender(
                getSidebar({
                    file: { ...file, id: 'new-file' },
                    history: historyMock,
                    docGenSidebarProps: {
                        ...withDocgenFeature,
                        isDocGenTemplate: true,
                    },
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            expect(historyMock.push).toHaveBeenCalledWith('/docgen');
        });
        test('test should redirect to default route if new file is not a docgen template', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/activity/comments/1234',
                },
            };
            const { rerender } = render(
                getSidebar({
                    location: { pathname: '/docgen' },
                    history: historyMock,
                    docGenSidebarProps: {
                        ...withDocgenFeature,
                        isDocGenTemplate: true,
                    },
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            rerender(
                getSidebar({
                    location: { pathname: '/docgen' },
                    file: { ...file, id: 'new-file' },
                    history: historyMock,
                    docGenSidebarProps: withDocgenFeature,
                    metadataSidebarProps: { isFeatureEnabled: true },
                }),
            );
            expect(historyMock.push).toHaveBeenCalledWith('/');
        });
        describe('open state change', () => {
            const mockOnOpenChange = jest.fn();

            afterEach(() => {
                mockOnOpenChange.mockClear();
            });

            test.each`
                prevOpen     | open
                ${false}     | ${true}
                ${true}      | ${false}
                ${undefined} | ${true}
                ${undefined} | ${false}
            `(
                'given previous open state = $prevOpen and new open state = $open should call onOpenChange with $open',
                ({ prevOpen, open }) => {
                    const { rerender } = render(
                        getSidebar({
                            location: {
                                pathname: '/',
                                state: { open: prevOpen },
                            },
                        }),
                    );

                    rerender(
                        getSidebar({
                            location: {
                                pathname: '/',
                                state: { open },
                            },
                            onOpenChange: mockOnOpenChange,
                        }),
                    );

                    expect(mockOnOpenChange).toBeCalledWith(open, false);
                },
            );
            test.each`
                prevOpen | open
                ${false} | ${false}
                ${true}  | ${true}
            `(
                'given previous open state = $prevOpen and new open state = $open should not call onOpenChange',
                ({ prevOpen, open }) => {
                    const { rerender } = render(
                        getSidebar({
                            location: {
                                pathname: '/',
                                state: { open: prevOpen },
                            },
                        }),
                    );

                    rerender(
                        getSidebar({
                            location: {
                                pathname: '/',
                                state: { open },
                            },
                            onOpenChange: mockOnOpenChange,
                        }),
                    );

                    expect(mockOnOpenChange).not.toBeCalled();
                },
            );
        });
    });

    describe('handleVersionHistoryClick', () => {
        test('should handle url with deeplink', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/activity/comments/1234',
                },
            };

            const preventDefaultMock = jest.fn();

            const event = {
                preventDefault: preventDefaultMock,
            };

            render(
                getSidebar({
                    file: { id: '1234', file_version: { id: '4567' } },
                    hasVersions: true,
                    history: historyMock,
                }),
            );

            getSidebarPanelsProps().onVersionHistoryClick(event);

            expect(preventDefaultMock).toHaveBeenCalled();
            expect(historyMock.push).toHaveBeenCalledWith('/activity/versions/4567');
        });

        test('should handle url without deeplink', () => {
            const historyMock = {
                push: jest.fn(),
                location: {
                    pathname: '/details',
                },
            };

            const preventDefaultMock = jest.fn();

            const event = {
                preventDefault: preventDefaultMock,
            };

            render(
                getSidebar({
                    file: { id: '1234', file_version: { id: '4567' } },
                    hasVersions: true,
                    history: historyMock,
                }),
            );

            getSidebarPanelsProps().onVersionHistoryClick(event);

            expect(preventDefaultMock).toHaveBeenCalled();
            expect(historyMock.push).toHaveBeenCalledWith('/details/versions/4567');
        });
    });

    describe('forced open state', () => {
        test('should open the sidebar when it was forced open in LocalStore', () => {
            const mockGetItem = jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN);
            LocalStore.mockImplementationOnce(() => ({
                getItem: mockGetItem,
            }));

            render(getSidebar({ isDefaultOpen: false }));

            expect(mockGetItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(screen.getByTestId('preview-sidebar')).toHaveClass('bcs-is-open');
        });

        test('should fall back to isDefaultOpen when the forced state is not set in LocalStore', () => {
            const mockGetItem = jest.fn(() => null);
            LocalStore.mockImplementationOnce(() => ({
                getItem: mockGetItem,
            }));

            render(getSidebar({ isDefaultOpen: false }));

            expect(mockGetItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY);
            expect(screen.getByTestId('preview-sidebar')).not.toHaveClass('bcs-is-open');
        });

        test('should save the forced open state from the initial location state in LocalStore', () => {
            const mockSetItem = jest.fn();
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: mockSetItem,
            }));

            render(getSidebar({ location: { pathname: '/', state: { open: true } } }));

            expect(mockSetItem).toHaveBeenCalledWith(SIDEBAR_FORCE_KEY, SIDEBAR_FORCE_VALUE_OPEN);
        });
    });

    describe('render', () => {
        test.each`
            forced                        | isDefaultOpen | expected
            ${SIDEBAR_FORCE_VALUE_CLOSED} | ${true}       | ${false}
            ${SIDEBAR_FORCE_VALUE_CLOSED} | ${false}      | ${false}
            ${SIDEBAR_FORCE_VALUE_OPEN}   | ${true}       | ${true}
            ${SIDEBAR_FORCE_VALUE_OPEN}   | ${false}      | ${true}
            ${null}                       | ${true}       | ${true}
            ${null}                       | ${false}      | ${false}
        `(
            'should render the open state correctly with forced set to $forced and isDefaultOpen set to $isDefaultOpen',
            ({ expected, forced, isDefaultOpen }) => {
                LocalStore.mockImplementationOnce(() => ({
                    getItem: jest.fn(() => forced),
                    setItem: jest.fn(() => forced),
                }));

                render(getSidebar({ isDefaultOpen }));

                expect(screen.getByTestId('preview-sidebar').classList.contains('bcs-is-open')).toBe(expected);
            },
        );

        test('should not render SidebarNav when hasNav is false', () => {
            render(getSidebar({ hasNav: false }));

            expect(SidebarNav).not.toHaveBeenCalled();
        });

        describe('SidebarPanels', () => {
            const mockGetItem = jest.fn();

            beforeEach(() => {
                LocalStore.mockImplementationOnce(() => ({
                    getItem: mockGetItem,
                    setItem: jest.fn(),
                }));
            });

            afterEach(() => {
                mockGetItem.mockClear();
            });
            test.each`
                panelSelectionPreservation | savedDefaultPanel | expected
                ${true}                    | ${'activity'}     | ${'activity'}
                ${true}                    | ${'details'}      | ${'details'}
                ${true}                    | ${null}           | ${undefined}
                ${false}                   | ${'activity'}     | ${undefined}
                ${undefined}               | ${'activity'}     | ${undefined}
            `(
                'should render SidebarPanels with defaultPanel prop = $defaultPanel, given sidebar selected panel saved in LocalStore is $defaultPanel and panelSelectionPreservation feature = $panelSelectionPreservation',
                ({ panelSelectionPreservation, savedDefaultPanel, expected }) => {
                    mockGetItem.mockReturnValue(savedDefaultPanel);
                    render(
                        getSidebar({
                            features: { panelSelectionPreservation },
                        }),
                    );
                    expect(mockSidebarPanels).toHaveBeenCalledWith(expect.objectContaining({ defaultPanel: expected }));
                },
            );

            test.each`
                pathname                             | savedDefaultPanel
                ${'/activity/comments/1'}            | ${'details'}
                ${'/activity/tasks/2'}               | ${'boxai'}
                ${'/activity/annotations/3/4'}       | ${null}
                ${'/activity/comments'}              | ${'details'}
                ${'/activity/tasks'}                 | ${'details'}
                ${'/activity/annotations/version-1'} | ${'details'}
            `(
                'should force defaultPanel = "activity" when location.pathname = $pathname (saved panel = $savedDefaultPanel)',
                ({ pathname, savedDefaultPanel }) => {
                    mockGetItem.mockReturnValue(savedDefaultPanel);
                    render(
                        getSidebar({
                            features: { panelSelectionPreservation: true },
                            location: { pathname },
                        }),
                    );
                    expect(mockSidebarPanels).toHaveBeenCalledWith(
                        expect.objectContaining({ defaultPanel: 'activity' }),
                    );
                },
            );

            test.each`
                pathname                            | savedDefaultPanel | expected
                ${'/activity/reactions/1'}          | ${'details'}      | ${'details'}
                ${'/activity/comments/1/replies/2'} | ${'details'}      | ${'details'}
                ${'/activity/annotations'}          | ${'details'}      | ${'details'}
                ${'/activity-log/1'}                | ${'details'}      | ${'details'}
                ${'/activity/reactions/1'}          | ${null}           | ${undefined}
            `(
                'should fall through to persisted panel for unmatched pathname = $pathname (saved = $savedDefaultPanel, expected = $expected)',
                ({ pathname, savedDefaultPanel, expected }) => {
                    mockGetItem.mockReturnValue(savedDefaultPanel);
                    render(
                        getSidebar({
                            features: { panelSelectionPreservation: true },
                            location: { pathname },
                        }),
                    );
                    expect(mockSidebarPanels).toHaveBeenCalledWith(expect.objectContaining({ defaultPanel: expected }));
                },
            );
        });
    });

    describe('refresh()', () => {
        test.each([true, false])('should call panel refresh with the provided boolean', shouldRefreshCache => {
            const sidebarRef = React.createRef();
            render(getSidebar({ ref: sidebarRef }));

            sidebarRef.current.refresh(shouldRefreshCache);

            expect(mockSidebarPanelsRefresh).toHaveBeenCalledWith(shouldRefreshCache);
        });
    });

    describe('resizable', () => {
        const resizableProps = {
            features: { contentSidebar: { resizable: { enabled: true } } },
            size: 'large',
            viewWidth: 1600,
        };

        // pointerdown goes through React synthetic events, pointermove and pointerup are listened to on window
        const dragResizeHandle = (startX, endX) => {
            fireEvent(
                screen.getByTestId('sidebar-resize-handle'),
                Object.assign(new MouseEvent('pointerdown', { bubbles: true, clientX: startX }), { pointerId: 1 }),
            );
            ['pointermove', 'pointerup'].forEach(type => {
                act(() => {
                    window.dispatchEvent(Object.assign(new Event(type), { clientX: endX, pointerId: 1 }));
                });
            });
        };

        test('renders the resize handle and bcs-is-resizable class when feature is on and viewport is large', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));
            render(getSidebar(resizableProps));

            expect(screen.getByTestId('preview-sidebar')).toHaveClass('bcs-is-resizable');
            expect(screen.getByTestId('sidebar-resize-handle')).toBeInTheDocument();
        });

        test('does not render the resize handle when the feature flag is off', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));
            render(
                getSidebar({
                    ...resizableProps,
                    features: { contentSidebar: { resizable: { enabled: false } } },
                }),
            );

            expect(screen.getByTestId('preview-sidebar')).not.toHaveClass('bcs-is-resizable');
            expect(screen.queryByTestId('sidebar-resize-handle')).not.toBeInTheDocument();
        });

        test.each(['small', 'medium'])(
            'does not render the resize handle on %s viewports even when the flag is on',
            size => {
                LocalStore.mockImplementationOnce(() => ({
                    getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                    setItem: jest.fn(),
                }));
                render(getSidebar({ ...resizableProps, size }));

                expect(screen.getByTestId('preview-sidebar')).not.toHaveClass('bcs-is-resizable');
                expect(screen.queryByTestId('sidebar-resize-handle')).not.toBeInTheDocument();
            },
        );

        test('does not render the resize handle when the sidebar is closed', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_CLOSED),
                setItem: jest.fn(),
            }));
            render(getSidebar(resizableProps));

            expect(screen.queryByTestId('sidebar-resize-handle')).not.toBeInTheDocument();
        });

        test('does not apply inline width until the user has dragged', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));
            render(getSidebar(resizableProps));

            expect(screen.getByTestId('preview-sidebar')).not.toHaveAttribute('style');
        });

        test('applies inline width once the user has dragged the resize handle', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));
            render(getSidebar(resizableProps));

            dragResizeHandle(1000, 850);

            expect(screen.getByTestId('preview-sidebar')).toHaveStyle({ width: '550px', maxWidth: '550px' });
        });

        test('caps maxWidth at 50% of the viewport width', () => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));
            render(getSidebar({ ...resizableProps, viewWidth: 1200 }));

            dragResizeHandle(1000, 200);

            expect(screen.getByTestId('preview-sidebar')).toHaveStyle({ width: '600px', maxWidth: '600px' });
        });

        test('records programmatic Resin actions when resizing starts and ends', () => {
            const recordAction = jest.fn();
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(() => SIDEBAR_FORCE_VALUE_OPEN),
                setItem: jest.fn(),
            }));
            render(
                getSidebar({
                    ...resizableProps,
                    fileId: file.id,
                    resin: { recordAction },
                }),
            );

            dragResizeHandle(1000, 850);

            expect(recordAction).toHaveBeenNthCalledWith(1, {
                action: 'programmatic',
                component: 'preview',
                data: {
                    phase: 'resizeStart',
                    startWidth: 400,
                    viewWidth: 1600,
                    width: 400,
                },
                fileExtension: 'pdf',
                fileId: 'id',
                target: 'sidebarresizehandle',
            });
            expect(recordAction).toHaveBeenNthCalledWith(2, {
                action: 'programmatic',
                component: 'preview',
                data: {
                    phase: 'resizeEnd',
                    startWidth: 400,
                    viewWidth: 1600,
                    width: 550,
                },
                fileExtension: 'pdf',
                fileId: 'id',
                target: 'sidebarresizehandle',
            });
        });
    });

    describe('on panel change', () => {
        const mockSetItem = jest.fn();
        const mockPanelName = 'activity';

        beforeEach(() => {
            LocalStore.mockImplementationOnce(() => ({
                getItem: jest.fn(),
                setItem: mockSetItem,
            }));

            SidebarNav.mockImplementationOnce(({ onPanelChange }) => {
                onPanelChange(mockPanelName, false);
                return 'SidebarNav';
            });
        });

        afterEach(() => {
            mockSetItem.mockClear();
        });

        test('should call onPanelChange prop when handling panel change by the user', () => {
            const mockOnPanelChange = jest.fn();
            render(
                getSidebar({
                    hasNav: true,
                    onPanelChange: mockOnPanelChange,
                }),
            );

            expect(mockOnPanelChange).toHaveBeenCalledWith(mockPanelName, false);
        });

        test('should call onPanelChange prop when handling setting of initial panel', () => {
            mockSidebarPanels.mockImplementationOnce(({ onPanelChange }) => {
                onPanelChange(mockPanelName, true);
                return 'SidebarPanels';
            });
            const mockOnPanelChange = jest.fn();
            render(
                getSidebar({
                    onPanelChange: mockOnPanelChange,
                }),
            );

            expect(mockOnPanelChange).toHaveBeenCalledWith(mockPanelName, true);
        });

        test('given panelSelectionPreservation feature = true should save panel name in LocalStore', () => {
            render(
                getSidebar({
                    features: { panelSelectionPreservation: true },
                    hasNav: true,
                }),
            );

            expect(mockSetItem).toHaveBeenCalledWith(SIDEBAR_SELECTED_PANEL_KEY, mockPanelName);
        });

        test.each`
            panelSelectionPreservation
            ${undefined}
            ${false}
        `(
            'given panelSelectionPreservation feature = $panelSelectionPreservation should not save panel name in LocalStore',
            ({ panelSelectionPreservation }) => {
                render(
                    getSidebar({
                        features: { panelSelectionPreservation },
                        hasNav: true,
                    }),
                );

                expect(mockSetItem).not.toHaveBeenCalled();
            },
        );
    });

    describe('comment range drag create', () => {
        const audioFile = { ...file, extension: 'mp3' };
        const dragCreateFeatures = {
            activityFeed: { timestampedComments: { enabled: true } },
            audioPlayerV2: { enabled: true },
        };

        const createViewer = () => {
            const listeners = {};
            const viewer = {
                addListener: (event, handler) => {
                    listeners[event] = handler;
                },
                emit: jest.fn(),
                removeListener: jest.fn(event => {
                    delete listeners[event];
                }),
            };
            return {
                emit: (event, payload) => listeners[event]?.(payload),
                hasListener: event => Boolean(listeners[event]),
                viewer,
            };
        };

        test('should open activity when the viewer emits a drag create', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { emit, viewer } = createViewer();

            render(
                getSidebar({
                    features: dragCreateFeatures,
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            act(() => {
                emit('comment_range_compose', { endMs: 20, startMs: 10 });
            });

            expect(history.push).toHaveBeenCalledWith({ pathname: '/activity', state: { open: true } });
            expect(history.replace).not.toHaveBeenCalled();
        });

        test('should replace the activity route when a drag create arrives while activity is already open', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { emit, viewer } = createViewer();

            render(
                getSidebar({
                    features: dragCreateFeatures,
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/activity' },
                }),
            );

            act(() => {
                emit('comment_range_compose', { endMs: 20, startMs: 10 });
            });

            expect(history.replace).toHaveBeenCalledWith({ pathname: '/activity', state: { open: true } });
            expect(history.push).not.toHaveBeenCalled();
        });

        test('should use the internal navigation handler when the router is disabled', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const internalSidebarNavigationHandler = jest.fn();
            const { emit, viewer } = createViewer();

            render(
                getSidebar({
                    activitySidebarProps: {
                        internalSidebarNavigation: { sidebar: 'details' },
                        internalSidebarNavigationHandler,
                        routerDisabled: true,
                    },
                    features: dragCreateFeatures,
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            act(() => {
                emit('comment_range_compose', { endMs: 20, startMs: 10 });
            });

            expect(internalSidebarNavigationHandler).toHaveBeenCalledWith({ open: true, sidebar: 'activity' }, false);
            expect(history.push).not.toHaveBeenCalled();
            expect(history.replace).not.toHaveBeenCalled();
        });

        test('should not navigate when the viewer dismisses a draft', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { emit, viewer } = createViewer();

            render(
                getSidebar({
                    features: dragCreateFeatures,
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            act(() => {
                emit('comment_range_draft_dismiss');
            });

            expect(history.push).not.toHaveBeenCalled();
            expect(history.replace).not.toHaveBeenCalled();
        });

        test('should not listen when the host has no activity feed', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { hasListener, viewer } = createViewer();

            render(
                getSidebar({
                    features: dragCreateFeatures,
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: false,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            expect(hasListener('comment_range_compose')).toBe(false);
            expect(history.push).not.toHaveBeenCalled();
        });

        test('should not listen when audio player v2 is off', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { hasListener, viewer } = createViewer();

            render(
                getSidebar({
                    features: { activityFeed: { timestampedComments: { enabled: true } } },
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            expect(hasListener('comment_range_compose')).toBe(false);
            expect(history.push).not.toHaveBeenCalled();
        });

        test('should not listen when timestamped comments are off', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { hasListener, viewer } = createViewer();

            render(
                getSidebar({
                    features: { audioPlayerV2: { enabled: true } },
                    file: audioFile,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            expect(hasListener('comment_range_compose')).toBe(false);
            expect(history.push).not.toHaveBeenCalled();
        });

        test('should not listen when the file is not audio', () => {
            const history = { push: jest.fn(), replace: jest.fn() };
            const { hasListener, viewer } = createViewer();

            render(
                getSidebar({
                    features: dragCreateFeatures,
                    file,
                    getViewer: () => viewer,
                    hasActivityFeed: true,
                    history,
                    location: { pathname: '/details' },
                }),
            );

            expect(hasListener('comment_range_compose')).toBe(false);
            expect(history.push).not.toHaveBeenCalled();
        });
    });
});
