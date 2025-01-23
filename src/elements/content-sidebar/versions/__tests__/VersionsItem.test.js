import * as React from 'react';
import { userEvent } from '@testing-library/user-event';
import { screen, render } from '../../../../test-utils/testing-library';
import CustomRouter from '../../../common/routing/customRouter';
import messages from '../messages';
import selectors from '../../../common/selectors/version';
import VersionsItem from '../VersionsItem';
import { FILE_REQUEST_NAME, PLACEHOLDER_USER, VERSION_UPLOAD_ACTION } from '../../../../constants';

jest.mock('../../../../utils/dom', () => ({
    ...jest.requireActual('../../../../utils/dom'),
    scrollIntoView: jest.fn(),
}));

// Mock TetherComponent to avoid findDOMNode warnings
jest.mock('react-tether', () => ({
    __esModule: true,
    default: jest.fn(({ children }) => <div>{children}</div>),
}));

const checkExpectedActionButtonVisibility = (permissionButtonText, isVisible) => {
    if (isVisible) {
        expect(screen.queryByText(permissionButtonText)).toBeVisible();
    } else {
        expect(screen.queryByText(permissionButtonText)).not.toBeInTheDocument();
    }
};

describe('elements/content-sidebar/versions/VersionsItem', () => {
    const defaultDate = new Date('2019-03-01T00:00:00');
    const defaultUser = { name: 'Test User', id: 10 };
    const promotedByUser = { name: 'Promote User', id: 13 };
    const restoreDate = new Date('2019-05-01T00:00:00');
    const restoreUser = { name: 'Restore User', id: 12 };
    const trashedDate = new Date('2019-04-01T00:00:00');
    const trashedUser = { name: 'Delete User', id: 11 };
    const unknownUser = 'Unknown';
    const defaults = {
        created_at: defaultDate,
        extension: 'docx',
        id: '12345',
        is_download_available: true,
        modified_at: defaultDate,
        modified_by: defaultUser,
        permissions: {
            can_delete: true,
            can_preview: true,
        },
        size: 10240,
        version_number: '1',
    };
    const getVersion = (overrides = {}) => ({
        ...defaults,
        ...overrides,
    });
    const renderComponent = (props = {}) => {
        const routerContext = {
            location: { pathname: '/activity/versions/12345' },
            match: {
                params: {
                    activeTab: 'activity',
                    deeplink: 'versions',
                    versionId: props.isSelected ? defaults.id : undefined,
                },
                path: '/:activeTab/:deeplink/:versionId?',
                url: '/activity/versions/12345',
                isExact: true,
            },
        };

        return render(
            <CustomRouter {...routerContext}>
                <VersionsItem fileId="123" version={defaults} {...props} />
            </CustomRouter>,
        );
    };

    beforeEach(() => {
        selectors.getVersionAction = jest.fn().mockReturnValue(VERSION_UPLOAD_ACTION);
        selectors.getVersionUser = jest.fn().mockReturnValue(defaultUser);
    });

    describe('render', () => {
        test.each`
            action       | showDelete | showDownload | showPreview | showPromote | showRestore
            ${'delete'}  | ${false}   | ${false}     | ${false}    | ${false}    | ${true}
            ${'restore'} | ${true}    | ${true}      | ${true}     | ${true}     | ${false}
            ${'upload'}  | ${true}    | ${true}      | ${true}     | ${true}     | ${false}
        `(
            "should show actions correctly when the version's action is $action",
            async ({ action, showDelete, showDownload, showPreview, showPromote, showRestore }) => {
                selectors.getVersionAction.mockReturnValueOnce(action);

                renderComponent({
                    version: getVersion({
                        permissions: {
                            can_delete: true,
                            can_download: true,
                            can_preview: true,
                            can_upload: true,
                        },
                    }),
                });

                const actions = screen.getByRole('button', { name: 'Toggle Actions Menu' });
                const button = screen.getByTestId('versions-item-button');

                await userEvent.click(actions);

                expect(button.getAttribute('aria-disabled')).toBe((!showPreview).toString());
                checkExpectedActionButtonVisibility('Delete', showDelete);
                checkExpectedActionButtonVisibility('Download', showDownload);
                checkExpectedActionButtonVisibility('Make Current', showPromote);
                checkExpectedActionButtonVisibility('Preview', showPreview);
                checkExpectedActionButtonVisibility('Restore', showRestore);
                expect(screen.getByTestId('bcs-VersionsItem-info')).toBeVisible();
            },
        );

        test.each`
            permissions
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: true }}
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: false }}
            ${{ can_delete: true, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: true, can_download: false, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: true, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: false, can_upload: true }}
        `('should show the correct menu items based on permissions', async ({ permissions }) => {
            renderComponent({
                version: getVersion({ permissions }),
                isArchived: false,
            });

            const actions = screen.getByRole('button', { name: 'Toggle Actions Menu' });
            const button = screen.getByTestId('versions-item-button');

            await userEvent.click(actions);

            expect(button.getAttribute('aria-disabled')).toBe((!permissions.can_preview).toString());
            checkExpectedActionButtonVisibility('Delete', permissions.can_delete);
            checkExpectedActionButtonVisibility('Download', permissions.can_download);
            checkExpectedActionButtonVisibility('Make Current', permissions.can_upload);
            checkExpectedActionButtonVisibility('Preview', permissions.can_preview);
            expect(screen.getByTestId('bcs-VersionsItem-info')).toBeVisible();
        });

        test('should render a selected version correctly', async () => {
            renderComponent({ isSelected: true });

            const actions = screen.getByRole('button', { name: 'Toggle Actions Menu' });
            const button = screen.getByTestId('versions-item-button');

            await userEvent.click(actions);

            checkExpectedActionButtonVisibility('Preview', false);
            expect(button.classList.contains('bcs-is-selected')).toBe(true);
        });

        test.each`
            versionUser         | expected
            ${defaultUser}      | ${defaultUser.name}
            ${promotedByUser}   | ${promotedByUser.name}
            ${restoreUser}      | ${restoreUser.name}
            ${trashedUser}      | ${trashedUser.name}
            ${PLACEHOLDER_USER} | ${unknownUser}
        `('should render the correct user name', ({ expected, versionUser }) => {
            selectors.getVersionUser.mockReturnValue(versionUser);

            renderComponent();

            const lastActionLog = screen.queryByTestId('bcs-VersionsItem-log');

            expect(lastActionLog).toHaveTextContent(`Uploaded by ${expected}`);
        });

        test.each`
            versionUser                                         | expected
            ${defaultUser}                                      | ${defaultUser.name}
            ${promotedByUser}                                   | ${promotedByUser.name}
            ${restoreUser}                                      | ${restoreUser.name}
            ${trashedUser}                                      | ${trashedUser.name}
            ${{ ...PLACEHOLDER_USER, name: FILE_REQUEST_NAME }} | ${messages.fileRequestDisplayName.defaultMessage}
        `('should render the correct user name if uploader_user_name present', ({ expected, versionUser }) => {
            selectors.getVersionUser.mockReturnValue(versionUser);

            renderComponent({ version: { ...defaults, uploader_display_name: FILE_REQUEST_NAME } });

            const lastActionLog = screen.queryByTestId('bcs-VersionsItem-log');

            expect(lastActionLog).toHaveTextContent(`Uploaded by ${expected}`);
        });

        test.each`
            created_at     | restored_at    | trashed_at     | expected
            ${defaultDate} | ${null}        | ${null}        | ${'Mar 1, 2019 at 12:00 AM'}
            ${defaultDate} | ${restoreDate} | ${null}        | ${'May 1, 2019 at 12:00 AM'}
            ${defaultDate} | ${restoreDate} | ${trashedDate} | ${'May 1, 2019 at 12:00 AM'}
            ${defaultDate} | ${null}        | ${trashedDate} | ${'Apr 1, 2019 at 12:00 AM'}
        `('should render the correct date and time', ({ expected, created_at, restored_at, trashed_at }) => {
            renderComponent({
                version: getVersion({
                    created_at,
                    restored_at,
                    trashed_at,
                }),
            });

            const dateTimeText = screen
                .getByTestId('bcs-VersionsItem-info')
                .getElementsByTagName('time')[0].textContent;

            expect(dateTimeText).toBe(expected);
        });

        test.each`
            versionLimit | versionNumber | isLimited
            ${1}         | ${1}          | ${true}
            ${1}         | ${5}          | ${true}
            ${5}         | ${3}          | ${true}
            ${5}         | ${7}          | ${false}
            ${10}        | ${1}          | ${false}
            ${100}       | ${3}          | ${false}
            ${Infinity}  | ${3}          | ${false}
            ${Infinity}  | ${3000}       | ${false}
        `(
            'should show version number $versionNumber with a limit of $versionLimit correctly',
            ({ isLimited, versionLimit, versionNumber }) => {
                renderComponent({
                    version: getVersion({ action: 'upload', version_number: versionNumber }),
                    versionCount: 10,
                    versionLimit,
                });
                const button = screen.getByTestId('versions-item-button');
                const actions = screen.queryByRole('button', { name: 'Toggle Actions Menu' });

                expect(button.getAttribute('aria-disabled')).toBe(isLimited.toString());
                if (isLimited) {
                    expect(actions).not.toBeInTheDocument();
                } else {
                    expect(actions).toBeVisible();
                }
            },
        );

        test.each`
            extension | isCurrent | showPreview
            ${'docx'} | ${true}   | ${true}
            ${'xlsb'} | ${true}   | ${true}
            ${'xlsm'} | ${true}   | ${true}
            ${'xlsx'} | ${true}   | ${true}
            ${'docx'} | ${false}  | ${true}
            ${'xlsb'} | ${false}  | ${false}
            ${'xlsm'} | ${false}  | ${false}
            ${'xlsx'} | ${false}  | ${false}
        `(
            'should restrict preview for non-current versions with extensions that could use the office viewer',
            async ({ extension, isCurrent, showPreview }) => {
                renderComponent({
                    isCurrent,
                    version: getVersion({ extension }),
                });

                const actions = screen.queryByRole('button', { name: 'Toggle Actions Menu' });
                const button = screen.getByTestId('versions-item-button');

                await userEvent.click(actions);

                expect(button.getAttribute('aria-disabled')).toBe((!showPreview).toString());
                checkExpectedActionButtonVisibility('Preview', showPreview);
            },
        );

        test('should disable preview if the file is watermarked', async () => {
            renderComponent({
                isWatermarked: true,
            });

            const actions = screen.queryByRole('button', { name: 'Toggle Actions Menu' });
            const button = screen.getByTestId('versions-item-button');

            await userEvent.click(actions);

            expect(button.getAttribute('aria-disabled')).toBe('true');
            checkExpectedActionButtonVisibility('Preview', false);
        });

        test('should disable actions as needed and render retention info if retention is provided', async () => {
            const dispositionAt = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000); // Future time
            renderComponent({
                version: getVersion({
                    retention: {
                        applied_at: defaultDate,
                        disposition_at: dispositionAt,
                        winning_retention_policy: {
                            disposition_action: 'permanently_delete',
                        },
                    },
                    permissions: {
                        can_delete: true,
                        can_download: true,
                        can_preview: true,
                        can_upload: true,
                    },
                }),
            });

            const actions = screen.queryByRole('button', { name: 'Toggle Actions Menu' });
            const retention = screen.queryByTestId('bcs-VersionsItem-retention');

            await userEvent.click(actions);

            const deleteButton = screen.queryByText('Delete');

            expect(retention).toBeVisible();
            expect(deleteButton).toBeVisible();
            expect(deleteButton.getAttribute('aria-disabled')).toBeTruthy();
        });

        test.each`
            permissions
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: true }}
            ${{ can_delete: true, can_download: true, can_preview: true, can_upload: false }}
            ${{ can_delete: true, can_download: true, can_preview: false, can_upload: true }}
            ${{ can_delete: true, can_download: false, can_preview: true, can_upload: true }}
            ${{ can_delete: false, can_download: true, can_preview: true, can_upload: true }}
            ${{ can_delete: true, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: true, can_download: false, can_preview: true, can_upload: false }}
            ${{ can_delete: false, can_download: true, can_preview: true, can_upload: false }}
            ${{ can_delete: false, can_download: true, can_preview: false, can_upload: true }}
            ${{ can_delete: false, can_download: false, can_preview: true, can_upload: true }}
            ${{ can_delete: false, can_download: true, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: true, can_upload: false }}
        `(
            'should disable the correct menu items based on permissions when is archive file',
            async ({ permissions }) => {
                renderComponent({
                    version: getVersion({ permissions }),
                    isArchived: true,
                });

                const actions = screen.getByRole('button', { name: 'Toggle Actions Menu' });
                const button = screen.getByTestId('versions-item-button');

                await userEvent.click(actions);

                expect(button.getAttribute('aria-disabled')).toBe((!permissions.can_preview).toString());
                checkExpectedActionButtonVisibility('Delete', false);
                checkExpectedActionButtonVisibility('Download', permissions.can_download);
                checkExpectedActionButtonVisibility('Make Current', false);
                checkExpectedActionButtonVisibility('Preview', permissions.can_preview);
                expect(screen.getByTestId('bcs-VersionsItem-info')).toBeVisible();
            },
        );

        test.each`
            permissions
            ${{ can_delete: true, can_download: false, can_preview: false, can_upload: true }}
            ${{ can_delete: true, can_download: false, can_preview: false, can_upload: false }}
            ${{ can_delete: false, can_download: false, can_preview: false, can_upload: true }}
            ${{ can_delete: false, can_download: false, can_preview: false, can_upload: false }}
        `('should not render actions based on permissions when is archive file', ({ permissions }) => {
            renderComponent({
                version: getVersion({ permissions }),
                isArchived: true,
            });

            const actions = screen.queryByRole('button', { name: 'Toggle Actions Menu' });
            const button = screen.getByTestId('versions-item-button');

            expect(button.getAttribute('aria-disabled')).toBe((!permissions.can_preview).toString());
            expect(actions).not.toBeInTheDocument();
            expect(screen.getByTestId('bcs-VersionsItem-info')).toBeVisible();
        });

        test.each`
            action       | showDelete | showDownload | showPreview | showPromote | showRestore
            ${'restore'} | ${false}   | ${true}      | ${true}     | ${false}    | ${false}
            ${'upload'}  | ${false}   | ${true}      | ${true}     | ${false}    | ${false}
        `(
            "should show actions correctly when the version's action is $action and is archive file",
            async ({ action, showDelete, showDownload, showPreview, showPromote, showRestore }) => {
                selectors.getVersionAction.mockReturnValueOnce(action);

                renderComponent({
                    version: getVersion({
                        permissions: {
                            can_delete: true,
                            can_download: true,
                            can_preview: true,
                            can_upload: true,
                        },
                    }),
                    isArchived: true,
                });

                const actions = screen.getByRole('button', { name: 'Toggle Actions Menu' });
                const button = screen.getByTestId('versions-item-button');

                await userEvent.click(actions);

                expect(button.getAttribute('aria-disabled')).toBe((!showPreview).toString());
                checkExpectedActionButtonVisibility('Delete', showDelete);
                checkExpectedActionButtonVisibility('Download', showDownload);
                checkExpectedActionButtonVisibility('Make Current', showPromote);
                checkExpectedActionButtonVisibility('Preview', showPreview);
                checkExpectedActionButtonVisibility('Restore', showRestore);
                expect(screen.getByTestId('bcs-VersionsItem-info')).toBeVisible();
            },
        );
    });
});
