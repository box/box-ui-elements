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
import type { BoxItemPermission } from '../../../common/types/core';

const handleRemoveSharedLinkError = jest.fn();
const handleUpdateSharedLinkError = jest.fn();
const handleRemoveSharedLinkSuccess = jest.fn().mockReturnValue(MOCK_ITEM_API_RESPONSE);
const handleUpdateSharedLinkSuccess = jest.fn().mockReturnValue(MOCK_ITEM_API_RESPONSE);

function FakeComponent({
    api,
    itemType,
    permissions = MOCK_ITEM_PERMISSIONS,
    options,
}: {
    api: API,
    itemType: string,
    options: Object,
    permissions: BoxItemPermission,
}) {
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateFnType>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<null | SharedLinkUpdateFnType>(null);
    const [changeSharedLinkAccessLevel, setChangeSharedLinkAccessLevel] = React.useState<null | SharedLinkUpdateFnType>(
        null,
    );
    const [changeSharedLinkPermissionLevel, setChangeSharedLinkPermissionLevel] =
        React.useState<null | SharedLinkUpdateFnType>(null);
    const [onSubmitSettings, setOnSubmitSettings] = React.useState<null | Function>(null);
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
                <button onClick={changeSharedLinkAccessLevel} type="submit">
                    &#9835; changeSharedLinkAccessLevel &#9835;
                </button>
                <button onClick={changeSharedLinkPermissionLevel} type="submit">
                    &#9835; changeSharedLinkPermissionLevel &#9835;
                </button>
                <button onClick={onAddLink} type="submit">
                    &#9835; onAddLink &#9835;
                </button>
                <button onClick={onRemoveLink} type="submit">
                    &#9835; onRemoveLink &#9835;
                </button>
                <button onClick={onSubmitSettings} type="submit">
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
    let mockAPI;
    let share;
    let updateSharedLink;

    describe('with successful API calls', () => {
        beforeAll(() => {
            share = jest
                .fn()
                .mockImplementation((dataForAPI, accessType, successFn) => successFn(MOCK_ITEM_API_RESPONSE));
            updateSharedLink = jest
                .fn()
                .mockImplementation((dataForAPI, sharedLinkParams, successFn) => successFn(MOCK_ITEM_API_RESPONSE));
            mockAPI = {
                getFileAPI: jest.fn().mockReturnValue({
                    share,
                    updateSharedLink,
                }),
                getFolderAPI: jest.fn().mockReturnValue({
                    share,
                    updateSharedLink,
                }),
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
            ({ itemType, buttonIndex, invokedFunctionArg, shareAccess }) => {
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

                btn.invoke('onClick')(invokedFunctionArg);

                expect(share).toHaveBeenCalledWith(
                    MOCK_ITEM_DATA,
                    shareAccess,
                    expect.anything(Function),
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
                    expect.anything(Function),
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
            ({ itemType, buttonIndex, invokedFunctionArg, sharedLinkData, permissions }) => {
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

                btn.invoke('onClick')(invokedFunctionArg);

                expect(updateSharedLink).toHaveBeenCalledWith(
                    { id: MOCK_ITEM_ID, permissions },
                    sharedLinkData,
                    expect.anything(Function),
                    handleUpdateSharedLinkError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
                expect(handleUpdateSharedLinkSuccess).toHaveBeenCalled();
            },
        );

        const transformAccess = jest.fn();
        const transformPermissions = jest.fn();
        const transformSettings = jest.fn();

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
        const createShareFailureMock = () =>
            jest.fn().mockImplementation((dataForAPI, accessType, successFn, failureFn) => failureFn());
        beforeAll(() => {
            share = createShareFailureMock();
            updateSharedLink = createShareFailureMock();

            mockAPI = {
                getFileAPI: jest.fn().mockReturnValue({
                    share,
                    updateSharedLink,
                }),
                getFolderAPI: jest.fn().mockReturnValue({
                    share,
                    updateSharedLink,
                }),
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
            ({ itemType, buttonIndex, invokedFunctionArg, errorFn }) => {
                let fakeComponent;

                act(() => {
                    fakeComponent = mount(
                        <FakeComponent
                            api={mockAPI}
                            itemType={itemType}
                            options={{ handleUpdateSharedLinkError, handleRemoveSharedLinkError }}
                        />,
                    );
                });
                fakeComponent.update();

                const btn = fakeComponent.find('button').at(buttonIndex);
                expect(btn.prop('onClick')).toBeDefined();
                btn.invoke('onClick')(invokedFunctionArg);
                expect(errorFn).toHaveBeenCalled();
            },
        );
    });
});
