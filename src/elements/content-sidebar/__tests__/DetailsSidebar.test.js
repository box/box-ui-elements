import { shallow } from 'enzyme';
import * as React from 'react';
import messages from '../../common/messages';
import { getBadItemError } from '../../../utils/error';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../../utils/fields';
import { DetailsSidebarComponent as DetailsSidebar } from '../DetailsSidebar';

jest.mock('../SidebarFileProperties', () => 'SidebarFileProperties');
jest.mock('../SidebarClassification', () => 'SidebarClassification');

const file = {
    id: 'foo',
    description: 'bar',
};

describe('elements/content-sidebar/DetailsSidebar', () => {
    let api;
    let getFile;
    let setFileDescription;
    const onError = jest.fn();
    const getWrapper = (props, options) =>
        shallow(
            <DetailsSidebar
                api={api}
                fileId={file.id}
                logger={{ onReadyMetric: jest.fn() }}
                onError={onError}
                {...props}
            />,
            options,
        );

    beforeEach(() => {
        getFile = jest.fn().mockResolvedValue(file);
        setFileDescription = jest.fn();
        api = {
            getFileAPI: jest.fn().mockImplementation(() => ({
                getFile,
                setFileDescription,
            })),
        };
    });

    describe('constructor()', () => {
        let onReadyMetric;
        beforeEach(() => {
            const wrapper = getWrapper();
            ({ onReadyMetric } = wrapper.instance().props.logger);
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
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true,
                    onClassificationClick: () => {},
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
