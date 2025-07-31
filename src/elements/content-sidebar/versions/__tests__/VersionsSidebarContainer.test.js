import * as React from 'react';
import { shallow } from 'enzyme/build';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, waitFor, act, screen } from '../../../../test-utils/testing-library';
import messages from '../messages';
import VersionsSidebarAPI from '../VersionsSidebarAPI';
import VersionsSidebar from '../VersionsSidebar';
import { VersionsSidebarContainerComponent } from '../VersionsSidebarContainer';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    withRouter: Component => Component,
}));

jest.mock('../../../common/api-context', () => ({
    withAPIContext: Component => Component,
}));

jest.mock('../../../../utils/iframe', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../VersionsSidebarAPI');

jest.mock('../VersionsSidebar', () => jest.fn(() => <div data-testid="versions-sidebar" />));

const versions = [
    { id: '123', name: 'Version 1' },
    { id: '456', name: 'Version 2' },
    { id: '789', name: 'Version 3' },
];

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const mockedAPIMethods = {
        fetchData: jest.fn().mockResolvedValue([{}, {}]),
        deleteVersion: jest.fn().mockResolvedValue(),
        fetchVersion: jest.fn().mockResolvedValue({}),
        fetchDownloadUrl: jest.fn().mockResolvedValue(),
        promoteVersion: jest.fn().mockResolvedValue(),
        restoreVersion: jest.fn().mockResolvedValue(),
        addPermissions: jest.fn(),
        sortVersions: jest.fn(),
    };

    const versionsAPI = {
        ...mockedAPIMethods,
    };

    const api = {
        getVersionsAPI: () => versionsAPI,
    };

    VersionsSidebarAPI.mockImplementation(() => mockedAPIMethods);

    const getWrapper = ({ ...props } = {}) =>
        shallow(<VersionsSidebarContainerComponent api={api} fileId="12345" {...props} />);

    const history = createBrowserHistory();

    const renderComponent = (props = {}) => {
        return render(
            <Router history={history}>
                <VersionsSidebarContainerComponent api={api} fileId="12345" match={{}} history={history} {...props} />
            </Router>,
        );
    };

    const renderComponentWithoutRouter = (props = {}) => {
        return render(<VersionsSidebarContainerComponent api={api} fileId="12345" routerDisabled={true} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset default resolved values
        mockedAPIMethods.fetchData.mockResolvedValue([{}, {}]);
        mockedAPIMethods.deleteVersion.mockResolvedValue();
        mockedAPIMethods.fetchVersion.mockResolvedValue({});
        mockedAPIMethods.fetchDownloadUrl.mockResolvedValue();
        mockedAPIMethods.promoteVersion.mockResolvedValue();
        mockedAPIMethods.restoreVersion.mockResolvedValue();
    });

    describe('componentDidMount', () => {
        beforeEach(() => {
            history.push = jest.fn();
            mockedAPIMethods.fetchData.mockClear();
        });

        test('should call onLoad after a successful fetchData() call', async () => {
            const onLoad = jest.fn();
            mockedAPIMethods.fetchData.mockResolvedValue([{}, {}]);

            await act(async () => {
                renderComponent({ onLoad });
            });

            await waitFor(() => {
                expect(onLoad).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('handleActionDelete', () => {
        test.each`
            scenario                        | versionIdToDelete | currentVersionId | shouldCallHistoryPush | expectedHistoryPath
            ${'non-selected version'}       | ${'456'}          | ${'123'}         | ${false}              | ${null}
            ${'currently selected version'} | ${'456'}          | ${'456'}         | ${true}               | ${'/versions/123'}
        `(
            'should handle delete operation correctly when deleting $scenario',
            async ({ versionIdToDelete, currentVersionId, shouldCallHistoryPush, expectedHistoryPath }) => {
                const handleDelete = jest.fn();
                const newVersion = { id: versionIdToDelete, trash_at: '' };
                const expectedVersion = {
                    id: versionIdToDelete,
                    name: 'Version 1',
                    created_at: '2023-01-01T00:00:00Z',
                };
                const currentVersion = { id: '123', name: 'Current Version', created_at: '2023-01-02T00:00:00Z' };

                let triggerDelete;
                VersionsSidebar.mockImplementation(({ onDelete, versions: versionsList }) => {
                    triggerDelete = () => onDelete(versionIdToDelete);
                    return (
                        <div data-testid="versions-sidebar">
                            {versionsList && versionsList.length > 0 && (
                                <div data-testid="versions-loaded">Versions loaded</div>
                            )}
                        </div>
                    );
                });

                // Include both versions so verifyVersion can find the current version
                const mockVersionsResponse = { entries: [currentVersion, expectedVersion], total_count: 2 };
                const mockFileResponse = { version_limit: null };

                mockedAPIMethods.addPermissions.mockReturnValue(mockVersionsResponse);
                mockedAPIMethods.fetchData.mockResolvedValue([mockFileResponse, mockVersionsResponse]);
                mockedAPIMethods.deleteVersion.mockResolvedValue();
                mockedAPIMethods.fetchVersion.mockResolvedValue(newVersion);

                const historyPushSpy = jest.fn();

                renderComponent({
                    onVersionDelete: handleDelete,
                    versionId: currentVersionId,
                    history: { ...history, push: historyPushSpy },
                    match: { path: '/versions/:versionId', params: { versionId: currentVersionId } },
                });

                await waitFor(() => {
                    expect(screen.getByTestId('versions-sidebar')).toBeInTheDocument();
                });
                await waitFor(() => {
                    expect(screen.queryByTestId('versions-loaded')).toBeInTheDocument();
                });

                await act(async () => {
                    triggerDelete();
                });

                await waitFor(() => {
                    expect(mockedAPIMethods.deleteVersion).toHaveBeenCalledWith(expectedVersion);
                    expect(mockedAPIMethods.fetchVersion).toHaveBeenCalledWith(expectedVersion.id);
                    expect(handleDelete).toHaveBeenCalledWith(expectedVersion.id);

                    if (shouldCallHistoryPush) {
                        expect(historyPushSpy).toHaveBeenCalledWith(expect.stringContaining(expectedHistoryPath));
                    } else {
                        expect(historyPushSpy).not.toHaveBeenCalled();
                    }
                });
            },
        );
    });

    describe('handleActionDelete - Router Disabled', () => {
        test.each`
            scenario                        | versionIdToDelete | currentVersionId | shouldCallNavigationHandler | expectedNavigationCall
            ${'non-selected version'}       | ${'456'}          | ${'123'}         | ${false}                    | ${null}
            ${'currently selected version'} | ${'456'}          | ${'456'}         | ${true}                     | ${{ versionId: '123' }}
        `(
            'should handle delete operation correctly when deleting $scenario',
            async ({ versionIdToDelete, currentVersionId, shouldCallNavigationHandler, expectedNavigationCall }) => {
                const handleDelete = jest.fn();
                const mockInternalSidebarNavigationHandler = jest.fn();
                const newVersion = { id: versionIdToDelete, trash_at: '' };
                const expectedVersion = {
                    id: versionIdToDelete,
                    name: 'Version 1',
                    created_at: '2023-01-01T00:00:00Z',
                };
                const currentVersion = { id: '123', name: 'Current Version', created_at: '2023-01-02T00:00:00Z' };
                const mockInternalSidebarNavigation = {
                    sidebar: 'activity',
                    activeFeedEntryType: 'comments',
                    activeFeedEntryId: '789',
                };

                let triggerDelete;
                VersionsSidebar.mockImplementation(({ onDelete, versions: versionsList }) => {
                    triggerDelete = () => onDelete(versionIdToDelete);
                    return (
                        <div data-testid="versions-sidebar">
                            {versionsList && versionsList.length > 0 && (
                                <div data-testid="versions-loaded">Versions loaded</div>
                            )}
                        </div>
                    );
                });

                // Include both versions so verifyVersion can find the current version
                const mockVersionsResponse = { entries: [currentVersion, expectedVersion], total_count: 2 };
                const mockFileResponse = { version_limit: null };

                mockedAPIMethods.addPermissions.mockReturnValue(mockVersionsResponse);
                mockedAPIMethods.fetchData.mockResolvedValue([mockFileResponse, mockVersionsResponse]);
                mockedAPIMethods.deleteVersion.mockResolvedValue();
                mockedAPIMethods.fetchVersion.mockResolvedValue(newVersion);

                renderComponentWithoutRouter({
                    onVersionDelete: handleDelete,
                    versionId: currentVersionId,
                    internalSidebarNavigation: mockInternalSidebarNavigation,
                    internalSidebarNavigationHandler: mockInternalSidebarNavigationHandler,
                });

                await waitFor(() => {
                    expect(screen.getByTestId('versions-sidebar')).toBeInTheDocument();
                });
                await waitFor(() => {
                    expect(screen.queryByTestId('versions-loaded')).toBeInTheDocument();
                });

                await act(async () => {
                    triggerDelete();
                });

                await waitFor(() => {
                    expect(mockedAPIMethods.deleteVersion).toHaveBeenCalledWith(expectedVersion);
                    expect(mockedAPIMethods.fetchVersion).toHaveBeenCalledWith(expectedVersion.id);
                    expect(handleDelete).toHaveBeenCalledWith(expectedVersion.id);

                    if (shouldCallNavigationHandler) {
                        expect(mockInternalSidebarNavigationHandler).toHaveBeenCalledWith({
                            ...mockInternalSidebarNavigation,
                            ...expectedNavigationCall,
                        });
                    } else {
                        expect(mockInternalSidebarNavigationHandler).not.toHaveBeenCalled();
                    }
                });
            },
        );
    });

    // ... all other tests unchanged ...

    describe('initialize', () => {
        test('should create VersionsSidebarAPI with correct parameters', () => {
            const features = { 'contentSidebar.archive.enabled': true };
            const wrapper = getWrapper({ features, fileId: '12345' });
            const instance = wrapper.instance();

            instance.initialize();

            expect(VersionsSidebarAPI).toHaveBeenCalledWith({
                api,
                fileId: '12345',
                isArchiveFeatureEnabled: true,
            });
        });

        test('should handle disabled archive feature', () => {
            const features = { 'contentSidebar.archive.enabled': false };
            const wrapper = getWrapper({ features, fileId: '12345' });
            const instance = wrapper.instance();

            instance.initialize();

            expect(VersionsSidebarAPI).toHaveBeenCalledWith({
                api,
                fileId: '12345',
                isArchiveFeatureEnabled: false,
            });
        });
    });

    describe('Render Method Edge Cases', () => {
        test('should render StaticVersionsSidebar when onUpgradeClick is provided', () => {
            const onUpgradeClick = jest.fn();
            const wrapper = getWrapper({ 
                onUpgradeClick,
                parentName: 'activity',
                routerDisabled: true,
                internalSidebarNavigation: { sidebar: 'activity' },
                internalSidebarNavigationHandler: jest.fn()
            });

            expect(wrapper.find('StaticVersionsSidebar')).toHaveLength(1);
            expect(wrapper.find('VersionsSidebar')).toHaveLength(0);
        });

        test('should pass all state props to StaticVersionsSidebar', () => {
            const onUpgradeClick = jest.fn();
            const wrapper = getWrapper({ onUpgradeClick });
            
            wrapper.setState({
                error: messages.versionFetchError,
                isArchived: true,
                isLoading: false,
                isWatermarked: true,
                versionCount: 5,
                versionLimit: 10,
                versions,
            });

            const staticSidebar = wrapper.find('StaticVersionsSidebar');
            expect(staticSidebar.props()).toMatchObject({
                error: messages.versionFetchError,
                isArchived: true,
                isLoading: false,
                isWatermarked: true,
                versionCount: 5,
                versionLimit: 10,
                versions,
            });
        });

        test('should render VersionsSidebar with all action handlers', () => {
            const wrapper = getWrapper({ fileId: '12345', parentName: 'activity' });
            const versionsSidebar = wrapper.find('VersionsSidebar');

            expect(versionsSidebar.prop('onDelete')).toBe(wrapper.instance().handleActionDelete);
            expect(versionsSidebar.prop('onDownload')).toBe(wrapper.instance().handleActionDownload);
            expect(versionsSidebar.prop('onPreview')).toBe(wrapper.instance().handleActionPreview);
            expect(versionsSidebar.prop('onPromote')).toBe(wrapper.instance().handleActionPromote);
            expect(versionsSidebar.prop('onRestore')).toBe(wrapper.instance().handleActionRestore);
        });
    });

    // ... rest of file unchanged ...
});