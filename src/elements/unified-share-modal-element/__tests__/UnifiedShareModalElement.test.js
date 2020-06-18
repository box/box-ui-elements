import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import API from '../../../api';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import UnifiedShareModalElement from '../UnifiedShareModalElement';
import UnifiedShareModal from '../../../features/unified-share-modal/UnifiedShareModal';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { normalizeItemResponse, normalizeUserResponse } from '../utils';

jest.mock('../../../api');
jest.mock('../utils');

const SHARED_LINK = {
    accessLevel: 'company',
    allowedAccessLevels: {
        peopleInThisItem: false,
        peopleInYourCompany: true,
        peopleWithTheLink: false,
    },
    canChangeAccessLevel: true,
    canChangeDownload: true,
    canChangePassword: true,
    canChangeVanityName: true,
    canInvite: true,
    directLink: '',
    expirationTimestamp: '',
    isDirectLinkAvailable: true,
    isDownloadAllowed: true,
    isDownloadAvailable: true,
    isDownloadEnabled: true,
    isDownloadSettingAvailable: true,
    isEditAllowed: true,
    isNewSharedLink: false,
    isPasswordAvailable: true,
    isPasswordEnabled: true,
    isPreviewAllowed: true,
    permissionLevel: 'peopleInYourCompany',
    url: '',
    vanityName: true,
};
const ITEM = {
    id: '',
    description: '',
    extension: '',
    grantedPermissions: {
        itemShare: true,
    },
    name: '',
    permissions: {},
    typedID: '',
};

const ITEM_API_RESPONSE = {
    item: ITEM,
    shared_link: SHARED_LINK,
    shared_link_features: {},
};

const NORMALIZED_ITEM_DATA = {
    item: ITEM,
    sharedLink: SHARED_LINK,
};

const USER_API_RESPONSE = {
    enterprise: '',
    hostname: '',
    id: 'abcde',
};

const NORMALIZED_USER_DATA = {
    id: 'abcde',
    userEnterpriseData: {
        enterpriseName: '',
        serverURL: '',
    },
};

const SHARED_LINK_DATA_AFTER_NORMALIZATION = {
    ...SHARED_LINK,
    enterpriseName: '',
    serverURL: '',
};

describe('elements/unified-share-modal-element/UnifiedShareModalElement', () => {
    const getWrapper = props =>
        mount(<UnifiedShareModalElement apiHost={DEFAULT_HOSTNAME_API} itemID="" language="" token="" {...props} />);

    beforeEach(() => {
        normalizeItemResponse.mockReturnValue(NORMALIZED_ITEM_DATA);
        normalizeUserResponse.mockReturnValue(NORMALIZED_USER_DATA);
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('with successful API calls', () => {
        test('should call getFileAPI().getFile() if itemType is "file"', async () => {
            const getFile = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });
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
            expect(normalizeItemResponse).toHaveBeenCalledWith(ITEM_API_RESPONSE);
            expect(usm.length).toBe(1);
            expect(usm.prop('item')).toEqual(ITEM);
            expect(usm.prop('sharedLink')).toEqual(SHARED_LINK);
        });

        test('should call getFolderAPI().getFolderFields() if itemType is "folder"', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

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
            expect(normalizeItemResponse).toHaveBeenCalledWith(ITEM_API_RESPONSE);
            expect(usm.length).toBe(1);
            expect(usm.prop('item')).toEqual(ITEM);
            expect(usm.prop('sharedLink')).toEqual(SHARED_LINK);
        });

        test('should call getUsersAPI().getUser() if item and sharedLink are defined, but currentUserID is not', async () => {
            jest.useFakeTimers();

            const getFile = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

            const getUser = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(USER_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

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
            expect(normalizeUserResponse).toHaveBeenCalledWith(USER_API_RESPONSE);
            expect(usm.length).toBe(1);
            expect(usm.prop('item')).toEqual(ITEM);
            expect(usm.prop('sharedLink')).toEqual(SHARED_LINK_DATA_AFTER_NORMALIZATION);
        });
    });

    describe('with unsuccessful item API calls', () => {
        test('should show the ErrorMask and skip the call to getUser() if the call to getFile() fails', async () => {
            const getFile = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(ITEM_API_RESPONSE).catch(() => {
                    failureFn();
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
            expect(normalizeItemResponse).not.toHaveBeenCalled();
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(wrapper.find(UnifiedShareModal).length).toBe(0);
        });

        test('should show the ErrorMask and skip the call to getUser() if the call to getFolderFields() fails', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(ITEM_API_RESPONSE).catch(() => {
                    failureFn();
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
            expect(normalizeItemResponse).not.toHaveBeenCalled();
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(wrapper.find(UnifiedShareModal).length).toBe(0);
        });
    });

    describe('with successful item API calls, but an unsuccessful users API call', () => {
        let getFile;
        let getFolderFields;
        let getUser;
        beforeAll(() => {
            getFile = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

            getFolderFields = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

            getUser = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(USER_API_RESPONSE).catch(() => {
                    failureFn();
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
            expect(normalizeItemResponse).toHaveBeenCalledWith(ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(normalizeUserResponse).not.toHaveBeenCalled();
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(wrapper.find(UnifiedShareModal).length).toBe(0);
        });

        test('should show the ErrorMask if the call to getFolderFields() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(normalizeItemResponse).toHaveBeenCalledWith(ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(normalizeUserResponse).not.toHaveBeenCalled();
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(wrapper.find(UnifiedShareModal).length).toBe(0);
        });
    });
});
