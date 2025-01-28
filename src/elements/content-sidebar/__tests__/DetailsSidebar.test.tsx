import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import messages from '../../common/messages';
import { getBadItemError } from '../../../utils/error';
import { SIDEBAR_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH_ARCHIVE } from '../../../utils/fields';
import { isFeatureEnabled, FeatureConfig } from '../../common/feature-checking';
import { DetailsSidebarComponent as DetailsSidebar, DetailsSidebarProps } from '../DetailsSidebar';
import { BoxItem, FileAccessStats, ElementsXhrError } from '../../../common/types/core';
import { API } from '../../../common/types/api';
import { Logger } from '../../../common/types/logging';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarAccessStats', () => 'SidebarAccessStats');
jest.mock('../SidebarClassification', () => 'SidebarClassification');
jest.mock('../SidebarContentInsights', () => 'SidebarContentInsights');
jest.mock('../../common/feature-checking');

const file: BoxItem = {
    id: 'foo',
    description: 'bar',
    type: 'file',
    name: '',
};

describe('elements/content-sidebar/DetailsSidebar', () => {
    let api: API;
    let getFile: jest.Mock;
    let getStats: jest.Mock;
    let setFileDescription: jest.Mock;
    const onError = jest.fn();
    const getWrapper = (
        props?: Partial<DetailsSidebarProps>,
        options?: { disableLifecycleMethods?: boolean },
    ): ShallowWrapper =>
        shallow(
            <DetailsSidebar
                api={api}
                elementId="details-sidebar"
                features={{} as FeatureConfig}
                fileId={file.id}
                logger={{ onReadyMetric: jest.fn(), onPreviewMetric: jest.fn() } as Logger}
                onError={onError}
                {...props}
            />,
            options,
        );

    beforeEach(() => {
        getFile = jest.fn().mockResolvedValue(file);
        getStats = jest.fn();
        setFileDescription = jest.fn();
        api = {
            getFileAPI: jest.fn().mockImplementation(() => ({
                getFile,
                setFileDescription,
            })),
            getFileAccessStatsAPI: jest.fn().mockImplementation(() => ({
                getFileAccessStats: getStats,
            })),
        } as unknown as API;
    });

    describe('constructor()', () => {
        let onReadyMetric: jest.Mock;
        beforeEach(() => {
            const wrapper = getWrapper();
            const instance = wrapper.instance() as DetailsSidebar;
            onReadyMetric = instance.props.logger.onReadyMetric as jest.Mock;
        });

        test('should emit when js loaded', () => {
            expect(onReadyMetric).toHaveBeenCalledWith({
                endMarkName: expect.any(String),
            });
        });
    });

    describe('render()', () => {
        test('should render an empty container if there is no file information', () => {
            // TODO: replace this test with proper loading and error cases once files call split out
            const wrapper = getWrapper({}, { disableLifecycleMethods: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with all components', () => {
            const wrapper = getWrapper(
                {
                    classification: { definition: 'message', name: 'name' },
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                    onClassificationClick: jest.fn(),
                },
                { disableLifecycleMethods: true },
            );
            wrapper.setState({ file });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with properties', () => {
            const wrapper = getWrapper(
                {
                    hasProperties: true,
                },
                { disableLifecycleMethods: true },
            );
            wrapper.setState({ file });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with notices', () => {
            const wrapper = getWrapper(
                {
                    hasNotices: true,
                },
                { disableLifecycleMethods: true },
            );
            wrapper.setState({ file });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with access stats', () => {
            const wrapper = getWrapper(
                {
                    hasAccessStats: true,
                },
                { disableLifecycleMethods: true },
            );
            wrapper.setState({ file });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with content insights', () => {
            const wrapper = getWrapper(
                {
                    contentInsights: {
                        graphData: [],
                        isLoading: false,
                        previousPeriodCount: 0,
                        totalCount: 0,
                    },
                    fetchContentInsights: jest.fn(),
                    hasContentInsights: true,
                    onContentInsightsClick: jest.fn(),
                },
                { disableLifecycleMethods: true },
            );
            wrapper.setState({ file });

            expect(wrapper.find('SidebarContentInsights').props()).toMatchObject({
                contentInsights: {},
                onContentInsightsClick: expect.any(Function),
            });
        });

        test('should render DetailsSidebar with versions', () => {
            const wrapper = getWrapper(
                {
                    hasVersions: true,
                },
                { disableLifecycleMethods: true },
            );
            wrapper.setState({ file });

            expect(wrapper).toMatchSnapshot();
        });

        test('should render empty SidebarContent', () => {
            const wrapper = getWrapper({});

            expect(wrapper.find('SidebarContent').children()).toHaveLength(0);
        });
    });

    describe('componentDidMount()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;
        beforeEach(() => {
            wrapper = getWrapper({}, { disableLifecycleMethods: true });
            wrapper.setState({
                file,
            });
            instance = wrapper.instance() as DetailsSidebar;
            instance.fetchFile = jest.fn();
            instance.fetchAccessStats = jest.fn();
        });

        test('should fetch the file information', () => {
            instance.componentDidMount();
            expect(instance.fetchFile).toHaveBeenCalled();
            expect(instance.fetchAccessStats).not.toHaveBeenCalled();
        });

        test('should fetch the file info and access stats', () => {
            wrapper.setProps({
                hasAccessStats: true,
                hasClassification: true,
            });
            instance.componentDidMount();
            expect(instance.fetchFile).toHaveBeenCalled();
            expect(instance.fetchAccessStats).toHaveBeenCalled();
        });

        test('should fetch the content insights', () => {
            const fetchContentInsights = jest.fn();

            wrapper.setProps({
                fetchContentInsights,
                hasClassification: true,
                hasContentInsights: true,
            });
            instance.componentDidMount();
            expect(instance.fetchFile).toHaveBeenCalled();
            expect(instance.fetchAccessStats).not.toBeCalled();
            expect(fetchContentInsights).toBeCalled();
        });
    });

    describe('fetchAccessStatsSuccessCallback()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;
        beforeEach(() => {
            wrapper = getWrapper(
                {
                    hasAccessStats: true,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            instance = wrapper.instance() as DetailsSidebar;
            instance.setState = jest.fn();
        });

        test('should short circuit if access stats is disabled', () => {
            wrapper.setProps({
                hasAccessStats: false,
            });
            instance.fetchAccessStatsSuccessCallback('stats' as FileAccessStats);
            expect(instance.setState).not.toHaveBeenCalled();
        });

        test('should update the file state', () => {
            instance.fetchAccessStatsSuccessCallback('stats' as FileAccessStats);
            expect(instance.setState).toBeCalledWith({
                isLoadingAccessStats: false,
                accessStats: 'stats',
                accessStatsError: undefined,
            });
        });
    });

    describe('fetchAccessStatsErrorCallback()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;
        beforeEach(() => {
            wrapper = getWrapper(
                {
                    hasAccessStats: true,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            instance = wrapper.instance() as DetailsSidebar;
            instance.setState = jest.fn();
        });

        test('should short circuit if access stats is disabled', () => {
            wrapper.setProps({
                hasAccessStats: false,
            });
            instance.fetchAccessStatsSuccessCallback('stats' as FileAccessStats);
            expect(instance.setState).not.toHaveBeenCalled();
        });

        test('should set a maskError if there is an error in fetching the access stats', () => {
            instance.fetchAccessStatsErrorCallback({ status: 500 } as ElementsXhrError, 'error_code');
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
            const error = {
                status: 403,
            };
            instance.fetchAccessStatsErrorCallback(error, 'error_code');
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
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;
        beforeEach(() => {
            wrapper = getWrapper(
                {
                    hasAccessStats: true,
                },
                {
                    disableLifecycleMethods: true,
                },
            );
            instance = wrapper.instance() as DetailsSidebar;
        });

        test('should short circuit if it is already fetching', () => {
            wrapper.setState({
                isLoadingAccessStats: true,
            });
            instance.fetchAccessStats();
            expect(getStats).not.toHaveBeenCalled();
        });

        test('should fetch the file access stats', () => {
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

    describe('descriptionChangeErrorCallback()', () => {
        test('should set an inlineError if there is an error in updating the file description', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance() as DetailsSidebar;
            instance.setState = jest.fn();
            instance.descriptionChangeErrorCallback(file);
            expect(instance.setState).toBeCalledWith({
                file,
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
            const instance = wrapper.instance() as DetailsSidebar;
            instance.setState = jest.fn();
            instance.descriptionChangeSuccessCallback(file);
            expect(instance.setState).toBeCalledWith({
                file,
                fileError: undefined,
            });
        });
    });

    describe('onDescriptionChange()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;
        beforeEach(() => {
            wrapper = getWrapper();
            wrapper.setState({
                file,
            });
            instance = wrapper.instance() as DetailsSidebar;
            instance.fetchFile = jest.fn();
            instance.descriptionChangeErrorCallback = jest.fn();
        });

        test('should throw an error if there is no file', () => {
            wrapper.setState({
                file: undefined,
            });
            expect(() => {
                instance.onDescriptionChange('');
            }).toThrow(getBadItemError());
        });

        test('should short circuit if the description is the same as it was before', () => {
            instance.onDescriptionChange(file.description);
            expect(setFileDescription).not.toHaveBeenCalled();
        });

        test('should set the file description', () => {
            const newDescription = 'baz';
            instance.onDescriptionChange(newDescription);
            setFileDescription.mockResolvedValue(file);
            expect(setFileDescription).toHaveBeenCalledWith(
                file,
                newDescription,
                expect.any(Function),
                instance.descriptionChangeErrorCallback,
            );
        });
    });

    describe('fetchFile()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance() as DetailsSidebar;
        });

        test('should fetch the file info', () => {
            instance.fetchFile();
            expect(getFile).toHaveBeenCalledWith(
                file.id,
                instance.fetchFileSuccessCallback,
                instance.fetchFileErrorCallback,
                {
                    fields: SIDEBAR_FIELDS_TO_FETCH,
                },
            );
        });

        test('should fetch the file info with archive metadata field when feature is enabled', () => {
            (isFeatureEnabled as jest.Mock).mockReturnValueOnce(true);
            instance.fetchFile();
            expect(getFile).toHaveBeenCalledWith(
                file.id,
                instance.fetchFileSuccessCallback,
                instance.fetchFileErrorCallback,
                {
                    fields: SIDEBAR_FIELDS_TO_FETCH_ARCHIVE,
                },
            );
        });
    });

    describe('fetchFileSuccessCallback()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance() as DetailsSidebar;
        });

        test('should fetch the file info', () => {
            instance.setState = jest.fn();
            instance.fetchFileSuccessCallback(file);
            expect(instance.setState).toHaveBeenCalledWith({
                file,
            });
        });
    });

    describe('fetchFileErrorCallback()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;

        beforeEach(() => {
            wrapper = getWrapper();
            wrapper.setState({ file });
            instance = wrapper.instance() as DetailsSidebar;
            instance.setState = jest.fn();
        });

        test('should set the error ', () => {
            const error = {
                status: 500,
            };
            const code = 'error_code_foo';
            instance.setState = jest.fn();
            instance.fetchFileErrorCallback(error, code);
            expect(instance.setState).toHaveBeenCalledWith({
                file: undefined,
            });
            expect(onError).toBeCalledWith(error, code, {
                e: error,
            });
        });
    });

    describe('componentDidUpdate()', () => {
        let wrapper: ShallowWrapper;
        let instance: DetailsSidebar;

        beforeEach(() => {
            wrapper = getWrapper({
                hasAccessStats: false,
                hasContentInsights: false,
                hasClassification: false,
                refreshIdentity: false,
            });
            wrapper.setState({ file });
            instance = wrapper.instance() as DetailsSidebar;
            instance.fetchAccessStats = jest.fn();
        });

        test('should fetch the access stats data if the access stats visibility changed', () => {
            wrapper.setProps({
                hasAccessStats: true,
            });

            expect(instance.fetchAccessStats).toHaveBeenCalled();
        });

        test('should fetch the content insights data if the content insights visibility changed', () => {
            const fetchContentInsights = jest.fn();

            wrapper.setProps({
                fetchContentInsights,
                hasContentInsights: true,
            });

            expect(fetchContentInsights).toBeCalled();
        });
    });

    describe('refresh', () => {
        test('should refetch data when refresh is called', () => {
            const instance = getWrapper().instance() as DetailsSidebar;
            const fetchAccessStats = jest.fn();
            instance.fetchAccessStats = fetchAccessStats;

            instance.refresh();

            expect(fetchAccessStats).toHaveBeenCalled();
        });
    });
});
