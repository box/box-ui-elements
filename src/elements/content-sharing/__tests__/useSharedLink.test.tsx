// @flow

import React, { act } from 'react';
import { mount } from 'enzyme';
import API from '../../../api';
import useSharedLink from '../hooks/useSharedLink';
import { ACCESS_NONE, PERMISSION_CAN_DOWNLOAD, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import {
    MOCK_ITEM_API_RESPONSE,
    MOCK_ITEM_ID,
    MOCK_ITEM_PERMISSIONS,
    MOCK_SETTINGS_WITH_ALL_FEATURES,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import { ANYONE_IN_COMPANY, CAN_VIEW_DOWNLOAD, PEOPLE_IN_ITEM } from '../../../features/unified-share-modal/constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import { BoxItemPermission } from '../../../common/types/core';
import { SharedLinkUpdateLevelFnType } from '../types';

type MockSuccessCallback = (data: MockAPIResponse) => void;
type MockFailureCallback = () => void;

type ShareMockType = jest.Mock<
    void,
    [Record<string, unknown>, string, MockSuccessCallback, MockFailureCallback, Record<string, unknown>]
>;
type UpdateSharedLinkMockType = jest.Mock<
    void,
    [
        Record<string, unknown>,
        Record<string, unknown>,
        MockSuccessCallback,
        MockFailureCallback,
        Record<string, unknown>,
    ]
>;

interface MockAPIInstance {
    share: ShareMockType;
    updateSharedLink: UpdateSharedLinkMockType;
}

type MockAPIResponse = typeof MOCK_ITEM_API_RESPONSE;

interface MockAPI {
    getFileAPI: jest.Mock<MockAPIInstance, []>;
    getFolderAPI: jest.Mock<MockAPIInstance, []>;
}

const handleRemoveSharedLinkError = jest.fn();
const handleUpdateSharedLinkError = jest.fn<void, []>();
const handleRemoveSharedLinkSuccess = jest.fn<MockAPIResponse, []>().mockReturnValue(MOCK_ITEM_API_RESPONSE);
const handleUpdateSharedLinkSuccess = jest.fn<MockAPIResponse, []>().mockReturnValue(MOCK_ITEM_API_RESPONSE);

// Removing unused type

interface FakeComponentProps {
    api: API;
    itemType: string;
    options: Record<string, unknown>;
    permissions?: BoxItemPermission;
}

function FakeComponent({ api, itemType, permissions = MOCK_ITEM_PERMISSIONS, options }: FakeComponentProps) {
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [changeSharedLinkAccessLevel, setChangeSharedLinkAccessLevel] =
        React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [changeSharedLinkPermissionLevel, setChangeSharedLinkPermissionLevel] =
        React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [onSubmitSettings, setOnSubmitSettings] = React.useState<
        null | ((settings: Record<string, unknown>) => Promise<void>)
    >(null);
    const [generatedFunctions, setGeneratedFunctions] = React.useState<boolean>(false);

    const {
        changeSharedLinkAccessLevel: updatedAccessFn,
        changeSharedLinkPermissionLevel: updatedPermissionFn,
        onAddLink: updatedAddFn,
        onRemoveLink: updatedRemoveFn,
        onSubmitSettings: updatedSettingsFn,
    } = useSharedLink(api, MOCK_ITEM_ID, itemType, permissions, PEOPLE_IN_ITEM, options);

    if (
        updatedAccessFn &&
        updatedPermissionFn &&
        updatedAddFn &&
        updatedRemoveFn &&
        updatedSettingsFn &&
        !generatedFunctions
    ) {
        setChangeSharedLinkAccessLevel(() => updatedAccessFn);
        setChangeSharedLinkPermissionLevel(() => updatedPermissionFn);
        setOnAddLink(() => updatedAddFn);
        setOnRemoveLink(() => updatedRemoveFn);
        setOnSubmitSettings(() => updatedSettingsFn);
        setGeneratedFunctions(true);
    }

    return (
        generatedFunctions && (
            <>
                <button
                    onClick={() => changeSharedLinkAccessLevel && changeSharedLinkAccessLevel(ANYONE_IN_COMPANY)}
                    type="submit"
                >
                    &#9835; changeSharedLinkAccessLevel &#9835;
                </button>
                <button
                    onClick={() =>
                        changeSharedLinkPermissionLevel && changeSharedLinkPermissionLevel(CAN_VIEW_DOWNLOAD)
                    }
                    type="submit"
                >
                    &#9835; changeSharedLinkPermissionLevel &#9835;
                </button>
                <button onClick={() => onAddLink && onAddLink()} type="submit">
                    &#9835; onAddLink &#9835;
                </button>
                <button onClick={() => onRemoveLink && onRemoveLink()} type="submit">
                    &#9835; onRemoveLink &#9835;
                </button>
                <button
                    onClick={() => onSubmitSettings && onSubmitSettings(MOCK_SETTINGS_WITH_ALL_FEATURES)}
                    type="submit"
                >
                    &#9835; onSubmitSettings &#9835;
                </button>
            </>
        )
    );
}

describe('elements/content-sharing/hooks/useSharedLink', () => {
    const MOCK_ITEM_DATA = {
        id: MOCK_ITEM_ID,
        permissions: MOCK_ITEM_PERMISSIONS,
    };
    let mockAPI: MockAPI;
    let share: jest.Mock<
        void,
        [Record<string, unknown>, string, MockSuccessCallback, MockFailureCallback, Record<string, unknown>]
    >;
    let updateSharedLink: jest.Mock<
        void,
        [
            Record<string, unknown>,
            Record<string, unknown>,
            MockSuccessCallback,
            MockFailureCallback,
            Record<string, unknown>,
        ]
    >;

    const transformAccess = jest.fn((accessType: string) => {
        if (accessType === ANYONE_IN_COMPANY) return 'peopleInYourCompany';
        return accessType;
    });
    const transformPermissions = jest.fn((permissionLevel: string) => {
        if (permissionLevel === CAN_VIEW_DOWNLOAD) return 'canViewDownload';
        return permissionLevel;
    });
    const transformSettings = jest.fn((settings: Record<string, unknown>) => settings);

    describe('with successful API calls', () => {
        beforeEach(() => {
            transformAccess.mockClear();
            transformPermissions.mockClear();
            transformSettings.mockClear();
            share = jest
                .fn()
                .mockImplementation(
                    (dataForAPI: Record<string, unknown>, accessType: string, successFn: MockSuccessCallback) => {
                        successFn(MOCK_ITEM_API_RESPONSE);
                    },
                );
            updateSharedLink = jest
                .fn()
                .mockImplementation(
                    (
                        dataForAPI: Record<string, unknown>,
                        sharedLinkParams: Record<string, unknown>,
                        successFn: MockSuccessCallback,
                    ) => {
                        successFn(MOCK_ITEM_API_RESPONSE);
                    },
                );
            transformPermissions.mockReturnValue('can_download');
            transformAccess.mockReturnValue('can_download');
            transformSettings.mockReturnValue({ permissions: 'can_download' });
            const apiMethods: MockAPIInstance = {
                share,
                updateSharedLink,
            };
            const getAPI = jest.fn().mockReturnValue(apiMethods) as jest.Mock<MockAPIInstance>;
            mockAPI = {
                getFileAPI: getAPI,
                getFolderAPI: getAPI,
            };
        });

        test.each`
            itemType       | buttonIndex | invokedFunctionArg   | shareAccess          | description
            ${TYPE_FILE}   | ${0}        | ${ANYONE_IN_COMPANY} | ${ANYONE_IN_COMPANY} | ${'changeSharedLinkAccessLevel'}
            ${TYPE_FILE}   | ${2}        | ${undefined}         | ${undefined}         | ${'onAddLink'}
            ${TYPE_FOLDER} | ${0}        | ${ANYONE_IN_COMPANY} | ${ANYONE_IN_COMPANY} | ${'changeSharedLinkAccessLevel'}
            ${TYPE_FOLDER} | ${2}        | ${undefined}         | ${undefined}         | ${'onAddLink'}
        `(
            'should set $description() and call success functions when invoked for a $itemType',
            ({ itemType, buttonIndex }) => {
                let fakeComponent;

                act(() => {
                    fakeComponent = mount(
                        <FakeComponent
                            api={mockAPI}
                            itemType={itemType}
                            permissions={MOCK_ITEM_PERMISSIONS}
                            options={{ handleUpdateSharedLinkError, handleUpdateSharedLinkSuccess }}
                        />,
                    );
                });
                fakeComponent.update();

                const btn = fakeComponent.find('button').at(buttonIndex);
                expect(btn.prop('onClick')).toBeDefined();

                btn.invoke('onClick')();
                expect(share).toHaveBeenCalledWith(
                    MOCK_ITEM_DATA,
                    ANYONE_IN_COMPANY,
                    expect.anything(),
                    handleUpdateSharedLinkError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
                expect(handleUpdateSharedLinkSuccess).toHaveBeenCalled();
            },
        );

        test.each([TYPE_FILE, TYPE_FOLDER])(
            'should set onRemoveLink() and call success functions when invoked for a %s',
            itemType => {
                let fakeComponent;

                act(() => {
                    fakeComponent = mount(
                        <FakeComponent
                            api={mockAPI}
                            itemType={itemType}
                            permissions={MOCK_ITEM_PERMISSIONS}
                            options={{ handleRemoveSharedLinkError, handleRemoveSharedLinkSuccess }}
                        />,
                    );
                });
                fakeComponent.update();

                const btn = fakeComponent.find('button').at(3);
                expect(btn.prop('onClick')).toBeDefined();

                btn.invoke('onClick')();

                expect(share).toHaveBeenCalledWith(
                    MOCK_ITEM_DATA,
                    ACCESS_NONE,
                    expect.anything(),
                    handleRemoveSharedLinkError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
                expect(handleRemoveSharedLinkSuccess).toHaveBeenCalled();
            },
        );

        test.each`
            itemType       | buttonIndex | invokedFunctionArg                 | sharedLinkData                              | permissions                | description
            ${TYPE_FILE}   | ${1}        | ${PERMISSION_CAN_DOWNLOAD}         | ${{ permissions: PERMISSION_CAN_DOWNLOAD }} | ${PERMISSION_CAN_DOWNLOAD} | ${'changeSharedLinkPermissionLevel'}
            ${TYPE_FILE}   | ${4}        | ${MOCK_SETTINGS_WITH_ALL_FEATURES} | ${MOCK_SETTINGS_WITH_ALL_FEATURES}          | ${MOCK_ITEM_PERMISSIONS}   | ${'onSubmitSettings'}
            ${TYPE_FOLDER} | ${1}        | ${PERMISSION_CAN_DOWNLOAD}         | ${{ permissions: PERMISSION_CAN_DOWNLOAD }} | ${PERMISSION_CAN_DOWNLOAD} | ${'changeSharedLinkPermissionLevel'}
            ${TYPE_FOLDER} | ${4}        | ${MOCK_SETTINGS_WITH_ALL_FEATURES} | ${MOCK_SETTINGS_WITH_ALL_FEATURES}          | ${MOCK_ITEM_PERMISSIONS}   | ${'onSubmitSettings'}
        `(
            'should set $description() and call success functions when invoked for a $itemType',
            ({ itemType, buttonIndex, permissions }) => {
                let fakeComponent;

                act(() => {
                    fakeComponent = mount(
                        <FakeComponent
                            api={mockAPI}
                            itemType={itemType}
                            permissions={permissions}
                            options={{ handleUpdateSharedLinkError, handleUpdateSharedLinkSuccess }}
                        />,
                    );
                });
                fakeComponent.update();

                const btn = fakeComponent.find('button').at(buttonIndex);
                expect(btn.prop('onClick')).toBeDefined();

                btn.prop('onClick')();
                expect(updateSharedLink).toHaveBeenCalledWith(
                    { id: MOCK_ITEM_ID, permissions: MOCK_ITEM_PERMISSIONS },
                    { permissions: 'can_download' },
                    expect.anything(),
                    handleUpdateSharedLinkError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
                expect(handleUpdateSharedLinkSuccess).toHaveBeenCalled();
            },
        );

        test('should call transformAccess() when changeSharedLinkAccessLevel() is invoked', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        itemType={TYPE_FILE}
                        permissions={MOCK_ITEM_PERMISSIONS}
                        options={{ handleUpdateSharedLinkError, transformAccess }}
                    />,
                );
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button').at(0);
            btn.invoke('onClick')(ANYONE_IN_COMPANY);
            expect(transformAccess).toHaveBeenCalledWith(ANYONE_IN_COMPANY);
        });

        test('should call transformPermissions() handler when changeSharedLinkPermissionsLevel() is invoked', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        itemType={TYPE_FILE}
                        permissions={MOCK_ITEM_PERMISSIONS}
                        options={{ handleUpdateSharedLinkError, transformPermissions }}
                    />,
                );
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button').at(1);
            btn.invoke('onClick')(CAN_VIEW_DOWNLOAD);
            expect(transformPermissions).toHaveBeenCalledWith(CAN_VIEW_DOWNLOAD);
        });

        test('should call transformSettings() when onSubmitSettings() is invoked', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        itemType={TYPE_FILE}
                        permissions={MOCK_ITEM_PERMISSIONS}
                        options={{ handleUpdateSharedLinkError, transformSettings }}
                    />,
                );
            });
            fakeComponent.update();

            const btn = fakeComponent.find('button').at(4);
            btn.invoke('onClick')(MOCK_SETTINGS_WITH_ALL_FEATURES);
            expect(transformSettings).toHaveBeenCalledWith(MOCK_SETTINGS_WITH_ALL_FEATURES, PEOPLE_IN_ITEM);
        });
    });

    describe('with failed API calls', () => {
        const createShareFailureMock = () => {
            return jest
                .fn()
                .mockImplementation(
                    (
                        _dataForAPI: Record<string, unknown>,
                        _accessType: string,
                        _successFn: MockSuccessCallback,
                        failureFn: MockFailureCallback,
                    ) => failureFn(),
                ) as ShareMockType;
        };

        const createUpdateSharedLinkFailureMock = () => {
            return jest
                .fn()
                .mockImplementation(
                    (
                        _dataForAPI: Record<string, unknown>,
                        _sharedLinkParams: Record<string, unknown>,
                        _successFn: MockSuccessCallback,
                        failureFn: MockFailureCallback,
                    ) => failureFn(),
                ) as UpdateSharedLinkMockType;
        };

        beforeAll(() => {
            share = createShareFailureMock();
            updateSharedLink = createUpdateSharedLinkFailureMock();

            const apiMethods: MockAPIInstance = {
                share,
                updateSharedLink,
            };
            const getAPI = jest.fn().mockReturnValue(apiMethods) as jest.Mock<MockAPIInstance>;
            mockAPI = {
                getFileAPI: getAPI,
                getFolderAPI: getAPI,
            };
        });

        test.each`
            itemType       | buttonIndex | invokedFunctionArg                 | errorFn                        | description
            ${TYPE_FILE}   | ${0}        | ${ANYONE_IN_COMPANY}               | ${handleUpdateSharedLinkError} | ${'changeSharedLinkAccessLevel'}
            ${TYPE_FILE}   | ${1}        | ${PERMISSION_CAN_DOWNLOAD}         | ${handleUpdateSharedLinkError} | ${'changeSharedLinkPermissionLevel'}
            ${TYPE_FILE}   | ${2}        | ${undefined}                       | ${handleUpdateSharedLinkError} | ${'onAddLink'}
            ${TYPE_FILE}   | ${3}        | ${undefined}                       | ${handleRemoveSharedLinkError} | ${'onRemoveLink'}
            ${TYPE_FILE}   | ${4}        | ${MOCK_SETTINGS_WITH_ALL_FEATURES} | ${handleUpdateSharedLinkError} | ${'onSubmitSettings'}
            ${TYPE_FOLDER} | ${0}        | ${ANYONE_IN_COMPANY}               | ${handleUpdateSharedLinkError} | ${'changeSharedLinkAccessLevel'}
            ${TYPE_FOLDER} | ${1}        | ${PERMISSION_CAN_DOWNLOAD}         | ${handleUpdateSharedLinkError} | ${'changeSharedLinkPermissionLevel'}
            ${TYPE_FOLDER} | ${2}        | ${undefined}                       | ${handleUpdateSharedLinkError} | ${'onAddLink'}
            ${TYPE_FOLDER} | ${3}        | ${undefined}                       | ${handleRemoveSharedLinkError} | ${'onRemoveLink'}
            ${TYPE_FOLDER} | ${4}        | ${MOCK_SETTINGS_WITH_ALL_FEATURES} | ${handleUpdateSharedLinkError} | ${'onSubmitSettings'}
        `(
            'should set $description() and call handleUpdateSharedLinkError() when invoked',
            ({ itemType, buttonIndex, errorFn }) => {
                let fakeComponent;

                act(() => {
                    fakeComponent = mount(
                        <FakeComponent
                            api={mockAPI}
                            itemType={itemType}
                            permissions={MOCK_ITEM_PERMISSIONS}
                            options={{ handleUpdateSharedLinkError, handleRemoveSharedLinkError }}
                        />,
                    );
                });
                fakeComponent.update();

                const btn = fakeComponent.find('button').at(buttonIndex);
                expect(btn.prop('onClick')).toBeDefined();
                btn.prop('onClick')();
                expect(errorFn).toHaveBeenCalled();
            },
        );
    });
});
