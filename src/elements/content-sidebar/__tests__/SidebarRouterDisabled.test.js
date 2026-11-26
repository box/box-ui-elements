import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { act, render, screen } from '../../../test-utils/testing-library';
import {
    SIDEBAR_FORCE_KEY,
    SIDEBAR_FORCE_VALUE_CLOSED,
    SIDEBAR_SELECTED_PANEL_KEY,
    SidebarDispatcherComponent as SidebarDispatcher,
    SidebarRouterDisabledComponent as SidebarRouterDisabled,
} from '../Sidebar';
import LocalStore from '../../../utils/LocalStore';

const mockSidebarNav = jest.fn(() => 'SidebarNav');
const mockSidebarPanels = jest.fn(() => 'SidebarPanels');
const mockSidebarPanelsRefresh = jest.fn();

jest.mock('../SidebarNav', () => ({
    __esModule: true,
    default: props => mockSidebarNav(props),
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

describe('elements/content-sidebar/SidebarRouterDisabled', () => {
    const file = {
        extension: 'pdf',
        id: 'id',
        file_version: {
            id: '123',
        },
    };

    const defaultProps = {
        docGenSidebarProps: { enabled: false, checkDocGenTemplate: jest.fn(), isDocGenTemplate: false },
        file,
        fileId: file.id,
        hasNav: true,
        metadataSidebarProps: {},
    };

    let storage;

    const getSidebar = props => <SidebarRouterDisabled {...defaultProps} {...props} />;

    const getSidebarPanelsProps = () => mockSidebarPanels.mock.lastCall[0];

    const navigate = (navigation, replace) =>
        act(() => {
            getSidebarPanelsProps().internalSidebarNavigationHandler(navigation, replace);
        });

    beforeEach(() => {
        // In-memory LocalStore, so that the forced open state behaves as in the browser
        storage = new Map();
        LocalStore.mockImplementation(() => ({
            getItem: key => (storage.has(key) ? storage.get(key) : null),
            setItem: (key, value) => storage.set(key, value),
        }));
    });

    describe('render', () => {
        test('should pass the internal navigation to SidebarNav and SidebarPanels', () => {
            const sidebarNavigation = { sidebar: 'activity', activeFeedEntryType: 'comments', activeFeedEntryId: '1' };
            render(getSidebar({ sidebarNavigation }));

            const sidebarPanelsProps = getSidebarPanelsProps();
            const sidebarNavProps = mockSidebarNav.mock.lastCall[0];
            expect(sidebarPanelsProps).toEqual(
                expect.objectContaining({ internalSidebarNavigation: sidebarNavigation, routerDisabled: true }),
            );
            expect(sidebarNavProps).toEqual(
                expect.objectContaining({ internalSidebarNavigation: sidebarNavigation, routerDisabled: true }),
            );
            expect(sidebarNavProps.internalSidebarNavigationHandler).toBe(
                sidebarPanelsProps.internalSidebarNavigationHandler,
            );
        });

        test('should start with an empty navigation when sidebarNavigation is not provided', () => {
            render(getSidebar());

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({});
        });

        test.each`
            sidebarNavigation                                                                    | expectedDefaultPanel
            ${{ sidebar: 'activity', activeFeedEntryType: 'comments', activeFeedEntryId: '1' }}  | ${'activity'}
            ${{ sidebar: 'activity', activeFeedEntryType: 'tasks' }}                             | ${'activity'}
            ${{ sidebar: 'activity', activeFeedEntryType: 'annotations', fileVersionId: '123' }} | ${'activity'}
            ${{ sidebar: 'activity', activeFeedEntryType: 'annotations' }}                       | ${'details'}
            ${{ sidebar: 'activity' }}                                                           | ${'details'}
            ${{ sidebar: 'details', activeFeedEntryType: 'comments', activeFeedEntryId: '1' }}   | ${'details'}
        `(
            'should use $expectedDefaultPanel as the default panel for $sidebarNavigation',
            ({ sidebarNavigation, expectedDefaultPanel }) => {
                storage.set(SIDEBAR_SELECTED_PANEL_KEY, 'details');
                render(getSidebar({ features: { panelSelectionPreservation: true }, sidebarNavigation }));

                expect(getSidebarPanelsProps().defaultPanel).toBe(expectedDefaultPanel);
            },
        );
    });

    describe('navigation', () => {
        test('should navigate and notify the host', () => {
            const sidebarNavigationHandler = jest.fn();
            render(getSidebar({ sidebarNavigation: { sidebar: 'activity' }, sidebarNavigationHandler }));

            navigate({ sidebar: 'details', open: true }, true);

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'details', open: true });
            expect(sidebarNavigationHandler).toHaveBeenCalledWith({ sidebar: 'details', open: true }, true);
        });

        test('should not navigate nor notify the host when the navigation has not changed', () => {
            const sidebarNavigationHandler = jest.fn();
            render(getSidebar({ sidebarNavigation: { sidebar: 'activity' }, sidebarNavigationHandler }));

            navigate({ sidebar: 'activity' }, true);

            expect(sidebarNavigationHandler).not.toHaveBeenCalled();
        });

        test('should not keep silent in the navigation', () => {
            const onOpenChange = jest.fn();
            const sidebarNavigationHandler = jest.fn();
            render(getSidebar({ onOpenChange, sidebarNavigationHandler }));

            navigate({ sidebar: 'activity', silent: true }, true);

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'activity' });
            expect(sidebarNavigationHandler).toHaveBeenCalledWith({ sidebar: 'activity' }, true);

            // A toggle built from the current navigation is a user action, not a silent one
            navigate({ ...getSidebarPanelsProps().internalSidebarNavigation, open: false }, true);

            expect(onOpenChange).toHaveBeenLastCalledWith(false, false);
            expect(storage.get(SIDEBAR_FORCE_KEY)).toBe(SIDEBAR_FORCE_VALUE_CLOSED);
        });

        test('should close the sidebar and report it when the user toggles it', () => {
            const onOpenChange = jest.fn();
            render(getSidebar({ onOpenChange, sidebarNavigation: { sidebar: 'activity' } }));

            expect(screen.getByTestId('preview-sidebar')).toHaveClass('bcs-is-open');
            expect(onOpenChange).toHaveBeenCalledWith(true, true);

            navigate({ sidebar: 'activity', open: false }, true);

            expect(screen.getByTestId('preview-sidebar')).not.toHaveClass('bcs-is-open');
            expect(onOpenChange).toHaveBeenLastCalledWith(false, false);
        });

        test('should not report open changes for silent navigations', () => {
            const onOpenChange = jest.fn();
            render(getSidebar({ onOpenChange }));

            navigate({ sidebar: 'activity', open: false, silent: true }, true);

            expect(onOpenChange).toHaveBeenCalledTimes(1);
            expect(storage.has(SIDEBAR_FORCE_KEY)).toBe(false);
        });

        test('should follow navigation changes from the host without notifying it back', () => {
            const sidebarNavigationHandler = jest.fn();
            const { rerender } = render(
                getSidebar({ sidebarNavigation: { sidebar: 'activity' }, sidebarNavigationHandler }),
            );

            rerender(getSidebar({ sidebarNavigation: { sidebar: 'metadata' }, sidebarNavigationHandler }));

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'metadata' });
            expect(sidebarNavigationHandler).not.toHaveBeenCalled();
        });

        test('should keep the internal navigation when the host passes the same navigation again', () => {
            const { rerender } = render(getSidebar({ sidebarNavigation: { sidebar: 'activity' } }));

            navigate({ sidebar: 'details', open: true });
            rerender(getSidebar({ sidebarNavigation: { sidebar: 'activity' } }));

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'details', open: true });
        });
    });

    describe('file change', () => {
        test('should reset the navigation on file change when the user has not navigated the sidebar', () => {
            const sidebarNavigationHandler = jest.fn();
            const { rerender } = render(
                getSidebar({ fileId: 'file-1', sidebarNavigation: { sidebar: 'details' }, sidebarNavigationHandler }),
            );

            rerender(
                getSidebar({ fileId: 'file-2', sidebarNavigation: { sidebar: 'details' }, sidebarNavigationHandler }),
            );

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({});
            expect(sidebarNavigationHandler).toHaveBeenCalledWith({}, true);
        });

        test('should keep the host navigation when the host changes the file and the navigation together', () => {
            const sidebarNavigationHandler = jest.fn();
            const { rerender } = render(
                getSidebar({ fileId: 'file-1', sidebarNavigation: { sidebar: 'details' }, sidebarNavigationHandler }),
            );

            rerender(
                getSidebar({ fileId: 'file-2', sidebarNavigation: { sidebar: 'activity' }, sidebarNavigationHandler }),
            );

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'activity' });
            expect(sidebarNavigationHandler).not.toHaveBeenCalled();
        });

        test('should not reset the navigation on file change after the user has navigated the sidebar', () => {
            const sidebarNavigationHandler = jest.fn();
            const { rerender } = render(getSidebar({ fileId: 'file-1', sidebarNavigationHandler }));

            navigate({ sidebar: 'details', open: true });
            rerender(getSidebar({ fileId: 'file-2', sidebarNavigationHandler }));

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'details', open: true });
            expect(sidebarNavigationHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleVersionHistoryClick', () => {
        test.each`
            fileVersion      | expectedNavigation
            ${{ id: '123' }} | ${{ sidebar: 'details', activeFeedEntryType: 'versions', versionId: '123' }}
            ${undefined}     | ${{ sidebar: 'details', activeFeedEntryType: 'versions' }}
        `('should navigate to $expectedNavigation', ({ fileVersion, expectedNavigation }) => {
            const event = { preventDefault: jest.fn() };
            render(
                getSidebar({
                    file: { ...file, file_version: fileVersion },
                    hasVersions: true,
                    sidebarNavigation: { sidebar: 'details' },
                }),
            );

            act(() => {
                getSidebarPanelsProps().onVersionHistoryClick(event);
            });

            expect(event.preventDefault).toHaveBeenCalled();
            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual(expectedNavigation);
        });
    });

    describe('docgen', () => {
        const docGenSidebarProps = { enabled: true, checkDocGenTemplate: jest.fn(), isDocGenTemplate: false };

        test('should navigate to the docgen sidebar when the file turns out to be a docgen template', () => {
            const { rerender } = render(getSidebar({ docGenSidebarProps, sidebarNavigation: { sidebar: 'details' } }));

            rerender(
                getSidebar({
                    docGenSidebarProps: { ...docGenSidebarProps, isDocGenTemplate: true },
                    sidebarNavigation: { sidebar: 'details' },
                }),
            );

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'docgen' });
        });

        test('should leave the docgen sidebar when the file is no longer a docgen template', () => {
            const sidebarNavigation = { sidebar: 'docgen' };
            const { rerender } = render(
                getSidebar({
                    docGenSidebarProps: { ...docGenSidebarProps, isDocGenTemplate: true },
                    sidebarNavigation,
                }),
            );

            rerender(getSidebar({ docGenSidebarProps, sidebarNavigation }));

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({});
        });
    });

    describe('metadata unsaved changes guard', () => {
        const features = { metadata: { confidenceScore: { enabled: true } } };

        const startMetadataEditing = (openWarningModal = jest.fn()) => {
            act(() => {
                const { metadataSidebarProps } = getSidebarPanelsProps();
                metadataSidebarProps.registerOpenWarningModalCallback(openWarningModal);
                metadataSidebarProps.onEditingStateChange(true);
            });
            return openWarningModal;
        };

        test('should open the warning modal instead of leaving the metadata sidebar while editing', () => {
            const sidebarNavigationHandler = jest.fn();
            render(getSidebar({ features, sidebarNavigation: { sidebar: 'metadata' }, sidebarNavigationHandler }));
            const openWarningModal = startMetadataEditing();

            navigate({ sidebar: 'activity', open: true });

            expect(openWarningModal).toHaveBeenCalledWith(true);
            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'metadata' });
            expect(sidebarNavigationHandler).not.toHaveBeenCalled();
        });

        test('should navigate once the user discards the unsaved changes', () => {
            const onWarningModalDiscard = jest.fn();
            const sidebarNavigationHandler = jest.fn();
            render(
                getSidebar({
                    features,
                    metadataSidebarProps: { onWarningModalDiscard },
                    sidebarNavigation: { sidebar: 'metadata' },
                    sidebarNavigationHandler,
                }),
            );
            startMetadataEditing();
            navigate({ sidebar: 'activity', open: true }, true);

            act(() => {
                getSidebarPanelsProps().metadataSidebarProps.onWarningModalDiscard();
            });

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'activity', open: true });
            expect(sidebarNavigationHandler).toHaveBeenCalledWith({ sidebar: 'activity', open: true }, true);
            expect(onWarningModalDiscard).toHaveBeenCalled();
        });

        test('should drop the blocked navigation when the user keeps editing', () => {
            const onWarningModalClose = jest.fn();
            render(
                getSidebar({
                    features,
                    metadataSidebarProps: { onWarningModalClose },
                    sidebarNavigation: { sidebar: 'metadata' },
                }),
            );
            startMetadataEditing();
            navigate({ sidebar: 'activity', open: true });

            act(() => {
                const { metadataSidebarProps } = getSidebarPanelsProps();
                metadataSidebarProps.onWarningModalClose();
                metadataSidebarProps.onWarningModalDiscard();
            });

            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'metadata' });
            expect(onWarningModalClose).toHaveBeenCalled();
        });

        test.each`
            scenario                              | sidebarFeatures | navigation
            ${'the guard feature is disabled'}    | ${{}}           | ${{ sidebar: 'activity', open: true }}
            ${'the navigation stays on metadata'} | ${features}     | ${{ sidebar: 'metadata', open: false }}
            ${'the navigation is silent'}         | ${features}     | ${{ sidebar: 'activity', silent: true }}
        `('should not block the navigation while editing when $scenario', ({ sidebarFeatures, navigation }) => {
            const { silent, ...expectedNavigation } = navigation;
            render(getSidebar({ features: sidebarFeatures, sidebarNavigation: { sidebar: 'metadata' } }));
            const openWarningModal = startMetadataEditing();

            navigate(navigation);

            expect(openWarningModal).not.toHaveBeenCalled();
            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual(expectedNavigation);
        });

        test('should not block the navigation after editing has ended', () => {
            render(getSidebar({ features, sidebarNavigation: { sidebar: 'metadata' } }));
            const openWarningModal = startMetadataEditing();

            act(() => {
                getSidebarPanelsProps().metadataSidebarProps.onEditingStateChange(false);
            });
            navigate({ sidebar: 'activity', open: true });

            expect(openWarningModal).not.toHaveBeenCalled();
            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'activity', open: true });
        });

        test('should end editing when the host navigates away from the metadata sidebar', () => {
            const onEditingStateChange = jest.fn();
            const props = { features, metadataSidebarProps: { onEditingStateChange } };
            const { rerender } = render(getSidebar({ ...props, sidebarNavigation: { sidebar: 'metadata' } }));
            const openWarningModal = startMetadataEditing();

            rerender(getSidebar({ ...props, sidebarNavigation: { sidebar: 'details' } }));
            navigate({ sidebar: 'activity', open: true });

            expect(onEditingStateChange).toHaveBeenLastCalledWith(false);
            expect(openWarningModal).not.toHaveBeenCalled();
            expect(getSidebarPanelsProps().internalSidebarNavigation).toEqual({ sidebar: 'activity', open: true });
        });

        test('should pass the metadata sidebar callbacks on to the host', () => {
            const metadataSidebarProps = {
                isFeatureEnabled: true,
                onEditingStateChange: jest.fn(),
                registerOpenWarningModalCallback: jest.fn(),
            };
            render(getSidebar({ features, metadataSidebarProps }));

            const openWarningModal = startMetadataEditing();

            expect(getSidebarPanelsProps().metadataSidebarProps.isFeatureEnabled).toBe(true);
            expect(metadataSidebarProps.onEditingStateChange).toHaveBeenCalledWith(true);
            expect(metadataSidebarProps.registerOpenWarningModalCallback).toHaveBeenCalledWith(openWarningModal);
        });
    });

    describe('refresh()', () => {
        test('should call panel refresh', () => {
            const sidebarRef = React.createRef();
            render(getSidebar({ ref: sidebarRef }));

            sidebarRef.current.refresh(false);

            expect(mockSidebarPanelsRefresh).toHaveBeenCalledWith(false);
        });
    });
});

describe('elements/content-sidebar/Sidebar dispatcher', () => {
    const file = { extension: 'pdf', id: 'id' };

    const defaultProps = {
        docGenSidebarProps: { enabled: false },
        file,
        fileId: file.id,
        metadataSidebarProps: {},
    };

    beforeEach(() => {
        LocalStore.mockImplementation(() => ({ getItem: () => null, setItem: jest.fn() }));
    });

    test.each`
        scenario                         | props
        ${'routerDisabled is set'}       | ${{ routerDisabled: true }}
        ${'the feature flag is enabled'} | ${{ features: { routerDisabled: { value: true } } }}
    `('should render the router-less sidebar without a router when $scenario', ({ props }) => {
        const wrappedComponentRef = React.createRef();
        render(<SidebarDispatcher {...defaultProps} {...props} wrappedComponentRef={wrappedComponentRef} />);

        wrappedComponentRef.current.refresh(false);

        expect(wrappedComponentRef.current).toBeInstanceOf(SidebarRouterDisabled);
        expect(mockSidebarPanels.mock.lastCall[0].routerDisabled).toBe(true);
        expect(mockSidebarPanelsRefresh).toHaveBeenCalledWith(false);
    });

    test('should render the router version when the router is not disabled', () => {
        const wrappedComponentRef = React.createRef();
        render(
            <MemoryRouter initialEntries={['/activity']}>
                <SidebarDispatcher {...defaultProps} wrappedComponentRef={wrappedComponentRef} />
            </MemoryRouter>,
        );

        wrappedComponentRef.current.refresh(false);

        expect(wrappedComponentRef.current).not.toBeInstanceOf(SidebarRouterDisabled);
        expect(mockSidebarPanels.mock.lastCall[0].routerDisabled).toBeUndefined();
        expect(mockSidebarPanelsRefresh).toHaveBeenCalledWith(false);
    });
});
