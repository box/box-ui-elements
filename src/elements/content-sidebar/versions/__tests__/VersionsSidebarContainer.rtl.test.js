import * as React from 'react';
import { createBrowserHistory } from 'history';
import { userEvent } from '@testing-library/user-event';

import { screen, render } from '../../../../test-utils/testing-library';
import VersionsSidebarAPI from '../VersionsSidebarAPI';
import VersionsSidebarContainer from '../VersionsSidebarContainer';
import CustomRouter from '../../../common/routing/customRouter';

jest.mock('../../../common/api-context', () => ({
    withAPIContext: Component => Component,
}));

const mockedFetchData = jest.fn();

jest.mock('../VersionsSidebarAPI', () =>
    jest.fn().mockImplementation(() => ({
        fetchData: mockedFetchData,
    })),
);

describe('elements/content-sidebar/versions/VersionsSidebarContainer', () => {
    const versionsAPI = {
        addPermissions: jest.fn(),
    };
    const api = {
        getVersionsAPI: () => versionsAPI,
    };

    const history = createBrowserHistory();

    const renderComponent = ({ ...props } = {}, wrapperProps) => {
        const routerContext = {
            history,
            location: { pathname: '/activity/versions/321' },
            match: {
                params: {
                    activeTab: 'activity',
                    deeplink: 'versions',
                    versionId: '321',
                },
                path: '/:activeTab/:deeplink/:versionId?',
                url: '/activity/versions/321',
                isExact: true,
            },
        };

        return render(
            <CustomRouter {...routerContext}>
                <VersionsSidebarContainer api={api} fileId="12345" versionId="321" {...props} />
            </CustomRouter>,
            { wrapperProps },
        );
    };

    describe('archive tests', () => {
        const file = {
            id: '12345',
            permissions: { can_delete: true, can_preview: true, can_upload: true },
            version_limit: 10,
        };
        const version = { id: '123', permissions: { can_delete: true, can_preview: true, can_upload: true } };
        const currentVersion = {
            entries: [{ id: '321', permissions: { can_delete: true, can_preview: true, can_upload: true } }],
            total_count: 1,
        };
        const versionsWithCurrent = { entries: [version, ...currentVersion.entries], total_count: 2 };

        beforeEach(() => {
            versionsAPI.addPermissions.mockReturnValueOnce(versionsWithCurrent);
        });

        test("should not show 'delete' and 'make current' buttons if file is an archive file", async () => {
            const archiveFile = {
                ...file,
                metadata: { global: { archivedItemTemplate: { archiveDate: '1726832355' } } },
            };
            mockedFetchData.mockResolvedValueOnce([archiveFile, versionsWithCurrent]);

            renderComponent({}, { features: { contentSidebar: { archive: { enabled: true } } } });

            expect(VersionsSidebarAPI).toHaveBeenCalledWith({ api, fileId: '12345', isArchiveFeatureEnabled: true });

            expect(await screen.findByTestId('bcs-Versions-menu')).toBeVisible();

            const actions = screen.getAllByRole('button', { name: 'Toggle Actions Menu' })[1];

            await userEvent.click(actions);

            expect(screen.queryByText('Preview')).toBeVisible();
            expect(screen.queryByText('Make Current')).not.toBeInTheDocument();
            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });

        test("should show 'delete' and 'make current' buttons if file is not an archive file", async () => {
            mockedFetchData.mockResolvedValueOnce([file, versionsWithCurrent]);

            renderComponent({}, { features: { contentSidebar: { archive: { enabled: true } } } });

            expect(VersionsSidebarAPI).toHaveBeenCalledWith({ api, fileId: '12345', isArchiveFeatureEnabled: true });

            expect(await screen.findByTestId('bcs-Versions-menu')).toBeVisible();

            const actions = screen.getAllByRole('button', { name: 'Toggle Actions Menu' })[1];

            await userEvent.click(actions);

            expect(screen.queryByText('Preview')).toBeVisible();
            expect(screen.queryByText('Make Current')).toBeVisible();
            expect(screen.queryByText('Delete')).toBeVisible();
        });
    });
});
