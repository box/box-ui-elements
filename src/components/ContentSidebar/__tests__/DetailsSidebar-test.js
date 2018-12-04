import { shallow } from 'enzyme';
import * as React from 'react';
import messages from '../../messages';
import { DetailsSidebarComponent as DetailsSidebar } from '../DetailsSidebar';
import { ERROR_CODE_FETCH_CLASSIFICATION, IS_ERROR_DISPLAYED } from '../../../constants';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarAccessStats', () => 'SidebarAccessStats');

const file = {
    id: 'foo',
};

describe('components/ContentSidebar/DetailsSidebar', () => {
    const onError = jest.fn();
    const getWrapper = (props, options) => shallow(<DetailsSidebar onError={onError} {...props} />, options);

    describe('render()', () => {
        test('should render DetailsSidebar with all components', () => {
            const wrapper = getWrapper(
                {
                    file,
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                },
                { disableLifecycleMethods: true },
            );
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with properties', () => {
            const wrapper = getWrapper(
                {
                    file,
                    hasProperties: true,
                },
                { disableLifecycleMethods: true },
            );
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with notices', () => {
            const wrapper = getWrapper(
                {
                    file,
                    hasNotices: true,
                },
                { disableLifecycleMethods: true },
            );
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with access stats', () => {
            const wrapper = getWrapper(
                {
                    file,
                    hasAccessStats: true,
                },
                { disableLifecycleMethods: true },
            );
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with versions', () => {
            const wrapper = getWrapper(
                {
                    file,
                    hasVersions: true,
                },
                { disableLifecycleMethods: true },
            );
            expect(wrapper).toMatchSnapshot();
        });

        test('should render empty SidebarContent', () => {
            const wrapper = getWrapper({
                file,
            });

            expect(wrapper.find('SidebarContent').children()).toHaveLength(0);
        });
    });

    describe('componentDidMount()', () => {
        test('should call fetchAccessStats when hasAccessStats is true', () => {
            const wrapper = getWrapper({ hasAccessStats: true }, { disableLifecycleMethods: true });
            const instance = wrapper.instance();
            instance.fetchAccessStats = jest.fn();
            instance.componentDidMount();
            expect(instance.fetchAccessStats).toHaveBeenCalled();
        });
        test('should call fetchClassification when hasClassification is true', () => {
            const wrapper = getWrapper({ hasClassification: true }, { disableLifecycleMethods: true });
            const instance = wrapper.instance();
            instance.fetchClassification = jest.fn();
            instance.componentDidMount();
            expect(instance.fetchClassification).toHaveBeenCalled();
        });
    });

    describe('fetchAccessStatsSuccessCallback()', () => {
        test('should update the file state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchAccessStatsSuccessCallback('stats');
            expect(instance.setState).toBeCalledWith({
                isLoadingAccessStats: false,
                accessStats: 'stats',
                accessStatsError: undefined,
            });
        });
    });

    describe('fetchAccessStatsErrorCallback()', () => {
        test('should set a maskError if there is an error in fetching the access stats', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchAccessStatsErrorCallback();
            expect(instance.setState).toBeCalledWith({
                isLoadingAccessStats: false,
                accessStats: undefined,
                accessStatsError: {
                    maskError: {
                        errorHeader: messages.fileAccessStatsErrorHeaderMessage,
                        errorSubHeader: messages.defaultErrorMaskSubHeaderMessage,
                    },
                },
            });
        });

        test('should set an error if user is forbidden from fetching the access stats', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const error = {
                status: 403,
            };
            instance.setState = jest.fn();
            instance.fetchAccessStatsErrorCallback(error);
            expect(instance.setState).toBeCalledWith({
                isLoadingAccessStats: false,
                accessStats: undefined,
                accessStatsError: {
                    error: messages.fileAccessStatsPermissionsError,
                },
            });
        });
    });

    describe('fetchAccessStats()', () => {
        test('should fetch the file access stats', () => {
            const getStats = jest.fn();
            const api = {
                getFileAccessStatsAPI: () => ({
                    getFileAccessStats: getStats,
                }),
            };
            const wrapper = getWrapper({ api, file });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchAccessStats();
            expect(instance.setState).toBeCalledWith({ isLoadingAccessStats: true });
            expect(getStats).toBeCalledWith(
                file.id,
                instance.fetchAccessStatsSuccessCallback,
                instance.fetchAccessStatsErrorCallback,
            );
        });
    });

    describe('fetchClassificationSuccessCallback', () => {
        test('should update the classification state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchClassificationSuccessCallback('classification');
            expect(instance.setState).toBeCalledWith({
                isLoadingClassification: false,
                classification: 'classification',
                classificationError: undefined,
            });
        });
    });

    describe('fetchClassificationErrorCallback', () => {
        test('should set an inlineError if there is an error in fetching the classification', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchClassificationErrorCallback();
            expect(instance.setState).toBeCalledWith({
                isLoadingClassification: false,
                classification: undefined,
                classificationError: {
                    inlineError: {
                        title: messages.fileClassificationErrorHeaderMessage,
                        content: messages.defaultErrorMaskSubHeaderMessage,
                    },
                },
            });
        });

        test('should invoke onError prop with error details', () => {
            const onError = jest.fn();
            const code = ERROR_CODE_FETCH_CLASSIFICATION;
            const error = {};
            const wrapper = getWrapper({ onError });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchClassificationErrorCallback(error, code);
            expect(onError).toBeCalledWith(error, code, {
                error,
                [IS_ERROR_DISPLAYED]: true,
            });
        });

        test('should not display inline error when a forbidden error', () => {
            const onError = jest.fn();
            const code = ERROR_CODE_FETCH_CLASSIFICATION;
            const error = {
                status: 403,
            };
            const wrapper = getWrapper({ onError });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchClassificationErrorCallback(error, code);
            expect(onError).toBeCalledWith(error, code, {
                error,
                [IS_ERROR_DISPLAYED]: false,
            });

            expect(instance.setState).toBeCalledWith({
                isLoadingClassification: false,
                classification: undefined,
                classificationError: undefined,
            });
        });
    });

    describe('fetchClassification', () => {
        test('should fetch the classification info', () => {
            const getClassification = jest.fn();
            const api = {
                getMetadataAPI: () => ({
                    getClassification,
                }),
            };
            const wrapper = getWrapper({ api, file });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchClassification();
            expect(instance.setState).toBeCalledWith({ isLoadingClassification: true });
            expect(getClassification).toBeCalledWith(
                file,
                instance.fetchClassificationSuccessCallback,
                instance.fetchClassificationErrorCallback,
                {
                    refreshCache: true,
                },
            );
        });
    });

    describe('descriptionChangeErrorCallback()', () => {
        test('should set an inlineError if there is an error in updating the file description', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.descriptionChangeErrorCallback('file');
            expect(instance.setState).toBeCalledWith({
                file: 'file',
                fileError: {
                    inlineError: {
                        title: messages.fileDescriptionInlineErrorTitleMessage,
                        content: messages.defaultInlineErrorContentMessage,
                    },
                },
            });
        });
    });

    describe('descriptionChangeSuccessCallback()', () => {
        test('should update the file state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.descriptionChangeSuccessCallback('file');
            expect(instance.setState).toBeCalledWith({
                file: 'file',
                fileError: undefined,
            });
        });
    });

    describe('onClassificationClick()', () => {
        test('should call onClassificationClick with the classification fetch function', () => {
            const onClassificationClick = jest.fn();
            const wrapper = getWrapper({ onClassificationClick });
            const instance = wrapper.instance();
            instance.fetchClassification = jest.fn();
            instance.onClassificationClick();
            expect(onClassificationClick).toBeCalledWith(instance.fetchClassification);
        });
    });
});
