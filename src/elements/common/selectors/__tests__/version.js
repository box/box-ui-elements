import selectors from '../version';
import {
    FILE_REQUEST_NAME,
    PLACEHOLDER_USER,
    VERSION_DELETE_ACTION,
    VERSION_PROMOTE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../../../../constants';

describe('elements/common/selectors/version', () => {
    const defaultUser = { name: 'Test User', id: 10 };
    const promotedByUser = { name: 'Promote User', id: 13 };
    const restoreDate = '2019-04-01T00:00:00';
    const restoreUser = { name: 'Restore User', id: 12 };
    const trashedDate = '2019-05-01T00:00:00';
    const trashedUser = { name: 'Delete User', id: 11 };

    describe('getVersionAction()', () => {
        test.each`
            restored_at    | trashed_at     | version_promoted | expected
            ${null}        | ${null}        | ${null}          | ${VERSION_UPLOAD_ACTION}
            ${restoreDate} | ${null}        | ${null}          | ${VERSION_RESTORE_ACTION}
            ${restoreDate} | ${trashedDate} | ${null}          | ${VERSION_RESTORE_ACTION}
            ${null}        | ${null}        | ${'1'}           | ${VERSION_PROMOTE_ACTION}
            ${null}        | ${trashedDate} | ${null}          | ${VERSION_DELETE_ACTION}
        `('should return the most relevant action', ({ expected, restored_at, trashed_at, version_promoted }) => {
            const version = {
                restored_at,
                trashed_at,
                version_promoted,
            };

            expect(selectors.getVersionAction(version)).toEqual(expected);
        });
    });

    describe('getVersionUser()', () => {
        test.each`
            description                                      | modified_by         | promoted_by       | restored_by    | trashed_by     | uploader_display_name | expected
            ${'All null values'}                             | ${null}             | ${null}           | ${null}        | ${null}        | ${null}               | ${PLACEHOLDER_USER}
            ${'Uploader Display Name'}                       | ${null}             | ${null}           | ${null}        | ${null}        | ${FILE_REQUEST_NAME}  | ${{ ...PLACEHOLDER_USER, name: FILE_REQUEST_NAME }}
            ${'Placeholder User'}                            | ${PLACEHOLDER_USER} | ${null}           | ${null}        | ${null}        | ${null}               | ${PLACEHOLDER_USER}
            ${'Placeholder User with Uploader Display Name'} | ${PLACEHOLDER_USER} | ${null}           | ${null}        | ${null}        | ${FILE_REQUEST_NAME}  | ${{ ...PLACEHOLDER_USER, name: FILE_REQUEST_NAME }}
            ${'Default User'}                                | ${defaultUser}      | ${null}           | ${null}        | ${null}        | ${null}               | ${defaultUser}
            ${'Promoted User'}                               | ${defaultUser}      | ${promotedByUser} | ${null}        | ${null}        | ${null}               | ${promotedByUser}
            ${'Restored User'}                               | ${defaultUser}      | ${promotedByUser} | ${restoreUser} | ${null}        | ${null}               | ${restoreUser}
            ${'Trashed User'}                                | ${defaultUser}      | ${promotedByUser} | ${restoreUser} | ${trashedUser} | ${null}               | ${restoreUser}
        `(
            'should return the most relevant user - $description',
            ({ expected, modified_by, promoted_by, restored_by, trashed_by, uploader_display_name }) => {
                const version = {
                    modified_by,
                    promoted_by,
                    restored_by,
                    trashed_by,
                    uploader_display_name,
                };

                expect(selectors.getVersionUser(version)).toEqual(expected);
            },
        );
    });
});
