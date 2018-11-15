import { shallow } from 'enzyme';
import * as React from 'react';
import messages from '../../messages';
import { DetailsSidebarComponent as DetailsSidebar } from '../DetailsSidebar';
import { FIELD_METADATA_CLASSIFICATION } from '../../../constants';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarAccessStats', () => 'SidebarAccessStats');

const file = {
    id: 'foo',
};

describe('components/ContentSidebar/DetailsSidebar', () => {
    const getWrapper = (props, options) => shallow(<DetailsSidebar {...props} />, options);

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
    });

    describe('fetchAccessStatsSuccessCallback()', () => {
        test('should update the file state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchAccessStatsSuccessCallback('stats');
            expect(instance.setState).toBeCalledWith({
                isLoading: false,
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
                isLoading: false,
                accessStats: undefined,
                accessStatsError: {
                    maskError: {
                        errorHeader: messages.fileAccessStatsErrorHeaderMessage,
                        errorSubHeader: messages.defaultErrorMaskSubHeaderMessage,
                    },
                },
            });
        });

        test('should set error if forbidden', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchAccessStatsErrorCallback({
                status: 403,
            });
            expect(instance.setState).toBeCalledWith({
                isLoading: false,
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
                    get: getStats,
                }),
            };
            const wrapper = getWrapper({ api, file });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchAccessStats();
            expect(instance.setState).toBeCalledWith({ isLoading: true });
            expect(getStats).toBeCalledWith({
                id: file.id,
                successCallback: instance.fetchAccessStatsSuccessCallback,
                errorCallback: instance.fetchAccessStatsErrorCallback,
            });
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

    describe('onClassificationChange()', () => {
        test('should refetch the file', () => {
            const getFile = jest.fn();
            const api = {
                getFileAPI: () => ({
                    getFile,
                }),
            };
            const wrapper = getWrapper({ api, file });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.onClassificationChange();
            expect(instance.setState).toBeCalledWith({ isLoading: true });
            expect(getFile).toBeCalledWith(
                file.id,
                instance.classifiationChangeSuccessCallback,
                instance.classifiationChangeErrorCallback,
                {
                    forceFetch: true,
                    updateCache: true,
                    fields: [FIELD_METADATA_CLASSIFICATION],
                },
            );
        });
    });

    describe('onClassificationClick()', () => {
        test('should call onClassificationClick with the refresh function', () => {
            const onClassificationClick = jest.fn();
            const wrapper = getWrapper({ onClassificationClick });
            const instance = wrapper.instance();
            instance.onClassificationChange = jest.fn();
            instance.onClassificationClick();
            expect(onClassificationClick).toBeCalledWith(instance.onClassificationChange);
        });
    });
});
