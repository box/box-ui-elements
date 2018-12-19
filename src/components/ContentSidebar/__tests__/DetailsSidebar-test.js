import { shallow } from 'enzyme';
import * as React from 'react';
import messages from '../../messages';
import { DetailsSidebarComponent as DetailsSidebar } from '../DetailsSidebar';
import { ERROR_CODE_FETCH_CLASSIFICATION, IS_ERROR_DISPLAYED } from '../../../constants';
import { getBadItemError } from '../../../util/error';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../../util/fields';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarAccessStats', () => 'SidebarAccessStats');

const file = {
    id: 'foo',
    description: 'bar',
};

describe('components/ContentSidebar/DetailsSidebar', () => {
    let api;
    let getClassification;
    let getFile;
    let getStats;
    let setFileDescription;
    const onError = jest.fn();
    const getWrapper = (props, options) =>
        shallow(<DetailsSidebar fileId={file.id} api={api} onError={onError} {...props} />, options);

    beforeEach(() => {
        getFile = jest.fn().mockResolvedValue(file);
        getClassification = jest.fn();
        getStats = jest.fn();
        setFileDescription = jest.fn();
        api = {
            getFileAPI: jest.fn().mockImplementation(() => ({
                getFile,
                setFileDescription,
            })),
            getMetadataAPI: jest.fn().mockImplementation(() => ({
                getClassification,
            })),
            getFileAccessStatsAPI: jest.fn().mockImplementation(() => ({
                getFileAccessStats: getStats,
            })),
        };
    });

    describe('render()', () => {
        test('should render nothing if there is no file information', () => {
            // TODO: replace this test with proper loading and error cases once files call split out
            const wrapper = getWrapper({}, { disableLifecycleMethods: true });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render DetailsSidebar with all components', () => {
            const wrapper = getWrapper(
                {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
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
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = getWrapper({}, { disableLifecycleMethods: true });
            wrapper.setState({
                file,
            });
            instance = wrapper.instance();
            instance.fetchFile = jest.fn();
        });

        test('should fetch the file information', () => {
            instance.componentDidMount();
            expect(instance.fetchFile).toHaveBeenCalled();
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
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
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
        const code = ERROR_CODE_FETCH_CLASSIFICATION;

        test('should set an inlineError and call onError prop if there is an error in fetching the classification', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            const error = {
                status: 500,
            };
            instance.fetchClassificationErrorCallback(error, code);
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
            expect(onError).toBeCalledWith(error, code, {
                error,
                [IS_ERROR_DISPLAYED]: true,
            });
        });

        test('should invoke onError prop with error details', () => {
            const onError = jest.fn();
            const error = {};
            const wrapper = getWrapper({ onError });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.fetchClassificationErrorCallback(error, code);
            expect(onError).toBeCalledWith(error, code, {
                error,
                [IS_ERROR_DISPLAYED]: false,
            });
        });

        test('should not display inline error when a forbidden error', () => {
            const onError = jest.fn();
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

    describe('fetchClassification()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = getWrapper();
            instance = wrapper.instance();
        });

        test('should fetch the classification info', () => {
            instance.setState = jest.fn();
            instance.fetchClassification();
            expect(instance.setState).toBeCalledWith({ isLoadingClassification: true });
            expect(getClassification).toBeCalledWith(
                file.id,
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

    describe('onClassificationClick()', () => {
        let instance;
        let onClassificationClick;

        beforeEach(() => {
            onClassificationClick = jest.fn();
            const wrapper = getWrapper({ onClassificationClick });
            instance = wrapper.instance();
            instance.fetchClassification = jest.fn();
        });
        test('should call onClassificationClick with the classification fetch function', () => {
            instance.onClassificationClick();
            expect(onClassificationClick).toBeCalledWith(instance.fetchClassification);
        });
    });

    describe('onDescriptionChange()', () => {
        let wrapper;
        let instance;
        beforeEach(() => {
            wrapper = getWrapper();
            wrapper.setState({
                file,
            });
            instance = wrapper.instance();
            instance.fetchFile = jest.fn();
            instance.descriptionChangeErrorCallback = jest.fn();
        });

        test('should throw an error if there is no file', () => {
            wrapper.setState({
                file: undefined,
            });
            expect(() => {
                instance.onDescriptionChange();
            }).toThrow(getBadItemError());
        });

        test('should short circuit if the description is the same as it was before', () => {
            instance.onDescriptionChange(file.description);
            expect(setFileDescription).not.toHaveBeenCalled();
        });

        test('should set the file description', () => {
            const newDescription = 'baz';
            instance.onDescriptionChange(newDescription);
            setFileDescription.mockResolvedValue();
            expect(setFileDescription).toHaveBeenCalledWith(
                file,
                newDescription,
                expect.any(Function),
                instance.descriptionChangeErrorCallback,
            );
        });
    });

    describe('fetchFile()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
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
    });

    describe('fetchFileSuccessCallback()', () => {
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
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
        let wrapper;
        let instance;

        beforeEach(() => {
            wrapper = getWrapper({
                file,
            });
            instance = wrapper.instance();
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
});
