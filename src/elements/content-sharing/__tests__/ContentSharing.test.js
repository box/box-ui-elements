import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import API from '../../../api';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import ContentSharing from '../ContentSharing';
import UnifiedShareModal from '../../../features/unified-share-modal/UnifiedShareModal';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
    ACCESS_OPEN,
    DEFAULT_HOSTNAME_API,
    TYPE_FILE,
    TYPE_FOLDER,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
} from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import {
    ANYONE_WITH_LINK,
    ANYONE_IN_COMPANY,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    PEOPLE_IN_ITEM,
} from '../../../features/unified-share-modal/constants';
import { convertItemResponse, convertUserResponse } from '../../../features/unified-share-modal/utils/convertData';
import {
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK,
    MOCK_CONVERTED_USER_DATA,
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE,
    MOCK_ITEM_ID,
    MOCK_NULL_SHARED_LINK,
    MOCK_PERMISSIONS,
    MOCK_SHARED_LINK,
    MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    MOCK_USER_API_RESPONSE,
    MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

describe('elements/unified-share-modal-element/ContentSharing', () => {
    const getWrapper = props =>
        mount(<ContentSharing apiHost={DEFAULT_HOSTNAME_API} itemID={MOCK_ITEM_ID} language="" token="" {...props} />);

    const createSuccessMock = responseFromAPI => (id, successFn) => {
        return Promise.resolve(responseFromAPI).then(response => {
            successFn(response);
        });
    };

    beforeEach(() => {
        convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA);
        convertUserResponse.mockReturnValue(MOCK_CONVERTED_USER_DATA);
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('with successful GET requests to the Item and Users API', () => {
        test.only('should call getFileAPI().getFile() if itemType is "file"', async () => {
            const getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            API.mockImplementation(() => ({
                getFileAPI: jest.fn().mockReturnValue({ getFile }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser: jest.fn() }),
            }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });

            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);

            expect(getFile).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
        });

        test('should call getFolderAPI().getFolderFields() if itemType is "folder"', async () => {
            const getFolderFields = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));

            API.mockImplementation(() => ({
                getFolderAPI: jest.fn().mockReturnValue({ getFolderFields }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser: jest.fn() }),
            }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);
            expect(getFolderFields).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
        });

        test('should call getUsersAPI().getUser() if item and sharedLink are defined, but currentUserID is not', async () => {
            const getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            const getUser = jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE));

            API.mockImplementation(() => ({
                getFileAPI: jest.fn().mockReturnValue({ getFile }),
                getFolderAPI: jest.fn().mockReturnValue({ getFolderFields: jest.fn() }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);
            expect(getFile).toHaveBeenCalled();
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).toHaveBeenCalledWith(MOCK_USER_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION);
        });
    });

    describe('with failed GET requests to the Item and/or Users API', () => {
        test('should show the ErrorMask and skip the call to getUser() if the call to getFile() fails', async () => {
            const getFile = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            const getUser = jest.fn();
            API.mockImplementation(() => ({
                getFileAPI: jest.fn().mockReturnValue({ getFile }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(getFile).toHaveBeenCalled();
            expect(getUser).not.toHaveBeenCalled();
            expect(convertItemResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
        });

        test('should show the ErrorMask and skip the call to getUser() if the call to getFolderFields() fails', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            const getUser = jest.fn();
            API.mockImplementation(() => ({
                getFolderAPI: jest.fn().mockReturnValue({ getFolderFields }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(getUser).not.toHaveBeenCalled();
            expect(convertItemResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
        });
    });

    describe('with successful item API calls, but an unsuccessful users API call', () => {
        let getFile;
        let getFolderFields;
        let getUser;
        beforeAll(() => {
            getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getFolderFields = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getUser = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            API.mockImplementation(() => ({
                getFileAPI: jest.fn().mockReturnValue({ getFile }),
                getFolderAPI: jest.fn().mockReturnValue({ getFolderFields }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            }));
        });

        test('should show the ErrorMask if the call to getFile() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(getFile).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
        });

        test('should show the ErrorMask if the call to getFolderFields() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
        });
    });

    describe('with specific errors', () => {
        test.each`
            status   | expectedErrorName
            ${'400'} | ${'badRequestError'}
            ${'401'} | ${'noAccessError'}
            ${'403'} | ${'noAccessError'}
            ${'404'} | ${'notFoundError'}
            ${'500'} | ${'loadingError'}
        `(
            'should show the correct error message when a call fails with a $status and the response is of type "ErrorResponseData"',
            async ({ status, expectedErrorName }) => {
                const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                    return Promise.reject(new Error()).catch(() => {
                        failureFn({ status });
                    });
                });
                const getUser = jest.fn();
                API.mockImplementation(() => ({
                    getFolderAPI: jest.fn().mockReturnValue({ getFolderFields }),
                    getUsersAPI: jest.fn().mockReturnValue({ getUser }),
                }));

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();
                expect(getFolderFields).toHaveBeenCalled();
                expect(wrapper.exists(ErrorMask)).toBe(true);
                expect(
                    wrapper
                        .find(ErrorMask)
                        .find(FormattedMessage)
                        .at(1) // the error header appears after the IconSadCloud title
                        .prop('id'),
                ).toBe(`be.contentSharing.${expectedErrorName}`);
            },
        );

        test.each`
            status   | expectedErrorName
            ${'400'} | ${'badRequestError'}
            ${'401'} | ${'noAccessError'}
            ${'403'} | ${'noAccessError'}
            ${'404'} | ${'notFoundError'}
            ${'500'} | ${'loadingError'}
        `(
            'should show the correct error message when a call fails with a $status and the response is of type "$AxiosError"',
            async ({ status, expectedErrorName }) => {
                const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                    return Promise.reject(new Error()).catch(() => {
                        failureFn({ response: { status } });
                    });
                });
                const getUser = jest.fn();
                API.mockImplementation(() => ({
                    getFolderAPI: jest.fn().mockReturnValue({ getFolderFields }),
                    getUsersAPI: jest.fn().mockReturnValue({ getUser }),
                }));

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();
                expect(getFolderFields).toHaveBeenCalled();
                expect(wrapper.exists(ErrorMask)).toBe(true);
                expect(
                    wrapper
                        .find(ErrorMask)
                        .find(FormattedMessage)
                        .at(1)
                        .prop('id'),
                ).toBe(`be.contentSharing.${expectedErrorName}`);
            },
        );

        test('should show the default error message when a call fails and the response is unparseable', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error()).catch(() => {
                    failureFn({ response: undefined });
                });
            });
            const getUser = jest.fn();
            API.mockImplementation(() => ({
                getFolderAPI: jest.fn().mockReturnValue({ getFolderFields }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser }),
            }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(
                wrapper
                    .find(ErrorMask)
                    .find(FormattedMessage)
                    .at(1)
                    .prop('id'),
            ).toBe(`be.contentSharing.loadingError`);
        });
    });

    describe.only('with successful PUT requests to the Item API', () => {
        let share;
        beforeAll(() => {
            share = jest.fn().mockImplementation((dataForAPI, accessType, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });
            API.mockImplementation(() => ({
                getFileAPI: jest
                    .fn()
                    .mockReturnValue({ getFile: createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK), share }),
                getFolderAPI: jest.fn().mockReturnValue({
                    getFolderFields: createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK),
                    share,
                }),
                getUsersAPI: jest.fn().mockReturnValue({ getUser: jest.fn() }),
            }));
        });

        test('should call share() from onAddLink()', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            await act(async () => {
                usm.invoke('onAddLink')();
            });
            expect(share).toHaveBeenCalledWith(
                { id: MOCK_ITEM_ID, permissions: MOCK_PERMISSIONS },
                ACCESS_COLLAB,
                expect.anything(),
                expect.anything(),
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                undefined,
            );
        });

        test('should call share() from onRemoveLink()', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            await act(async () => {
                usm.invoke('onRemoveLink')();
            });
            expect(share).toHaveBeenCalledWith(
                { id: MOCK_ITEM_ID, permissions: MOCK_PERMISSIONS },
                ACCESS_NONE,
                expect.anything(),
                expect.anything(),
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                undefined,
            );
        });

        test.each`
            accessLevelFromUSM   | accessLevelForAPI
            ${ANYONE_IN_COMPANY} | ${ACCESS_COMPANY}
            ${ANYONE_WITH_LINK}  | ${ACCESS_OPEN}
            ${PEOPLE_IN_ITEM}    | ${ACCESS_COLLAB}
        `(
            'should call share() from changeSharedLinkAccessLevel() when given access $accessLevelFromUSM',
            async ({ accessLevelFromUSM, accessLevelForAPI }) => {
                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                await act(async () => {
                    usm.invoke('changeSharedLinkAccessLevel')(accessLevelFromUSM);
                });
                expect(share).toHaveBeenCalledWith(
                    { id: MOCK_ITEM_ID, permissions: MOCK_PERMISSIONS },
                    accessLevelForAPI,
                    expect.anything(),
                    expect.anything(),
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                    undefined,
                );
            },
        );

        test.each`
            permissionLevelFromUSM | permissionLevelObjectForAPI
            ${CAN_VIEW_ONLY}       | ${{ permissions: { [PERMISSION_CAN_DOWNLOAD]: false, [PERMISSION_CAN_PREVIEW]: true } }}
            ${CAN_VIEW_DOWNLOAD}   | ${{ permissions: { [PERMISSION_CAN_DOWNLOAD]: true, [PERMISSION_CAN_PREVIEW]: false } }}
        `(
            'should call share() from changeSharedLinkPermissionLevel() when given permission $permissionLevelFromUSM',
            async ({ permissionLevelFromUSM, permissionLevelObjectForAPI }) => {
                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                await act(async () => {
                    usm.invoke('changeSharedLinkPermissionLevel')(permissionLevelFromUSM);
                });
                expect(share).toHaveBeenCalledWith(
                    { id: MOCK_ITEM_ID, permissions: MOCK_PERMISSIONS },
                    undefined,
                    expect.anything(),
                    expect.anything(),
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                    permissionLevelObjectForAPI,
                );
            },
        );
    });
});
