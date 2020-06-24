import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import API from '../../../api';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import ContentSharing from '../ContentSharing';
import UnifiedShareModal from '../../../features/unified-share-modal/UnifiedShareModal';
import { DEFAULT_HOSTNAME_API, TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { convertItemResponse, convertUserResponse } from '../../../features/unified-share-modal/utils/convertData';
import {
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_USER_DATA,
    MOCK_SHARED_LINK,
    MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    MOCK_USER_API_RESPONSE,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

describe('elements/unified-share-modal-element/ContentSharing', () => {
    const getWrapper = props =>
        mount(<ContentSharing apiHost={DEFAULT_HOSTNAME_API} itemID="" language="" token="" {...props} />);

    beforeEach(() => {
        convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA);
        convertUserResponse.mockReturnValue(MOCK_CONVERTED_USER_DATA);
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('with successful API calls', () => {
        test('should call getFileAPI().getFile() if itemType is "file"', async () => {
            const getFile = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
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
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.length).toBe(1);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
        });

        test('should call getFolderAPI().getFolderFields() if itemType is "folder"', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
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
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.length).toBe(1);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
        });

        test('should call getUsersAPI().getUser() if item and sharedLink are defined, but currentUserID is not', async () => {
            jest.useFakeTimers();

            const getFile = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

            const getUser = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(MOCK_USER_API_RESPONSE).then(response => {
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
            expect(convertUserResponse).toHaveBeenCalledWith(MOCK_USER_API_RESPONSE);
            expect(usm.length).toBe(1);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION);
        });
    });

    describe('with unsuccessful item API calls', () => {
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
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(wrapper.find(UnifiedShareModal).length).toBe(0);
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
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

            getFolderFields = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });

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
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).not.toHaveBeenCalled();
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(wrapper.find(UnifiedShareModal).length).toBe(0);
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
                expect(wrapper.find(ErrorMask).length).toBe(1);
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
                expect(wrapper.find(ErrorMask).length).toBe(1);
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
            expect(wrapper.find(ErrorMask).length).toBe(1);
            expect(
                wrapper
                    .find(ErrorMask)
                    .find(FormattedMessage)
                    .at(1)
                    .prop('id'),
            ).toBe(`be.contentSharing.loadingError`);
        });
    });
});
