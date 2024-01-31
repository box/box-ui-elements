import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MessageDescriptor } from 'react-intl';
import { DocGenSidebarComponent as DocGenSidebar } from '../DocGenSidebar/DocGenSidebar';
import LoadingIndicator from '../../../components/loading-indicator';
import Error from '../DocGenSidebar/Error';

const intl = {
    formatMessage: (message: MessageDescriptor) => message.defaultMessage,
};

const docGenSidebarProps = {
    getDocGenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            pagination: {},
            data: [
                {
                    tag_content: '{{ isActive }}',
                    tag_type: 'text',
                    json_paths: ['isActive'],
                },
                {
                    tag_content: '{{ about }}',
                    tag_type: 'text',
                    json_paths: ['about'],
                },
                {
                    tag_content: '{{ phone }}',
                    tag_type: 'text',
                    json_paths: ['phone'],
                },
                {
                    tag_content: '{{ company }}',
                    tag_type: 'text',
                    json_paths: ['company'],
                },
            ],
        }),
    ),
    intl,
};

const noTagsMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
const errorTagsMock = jest.fn().mockRejectedValue([]);

const defaultProps = {
    ...docGenSidebarProps,
};

describe('elements/content-sidebar/DocGenSidebar', () => {
    const getWrapper = (props = defaultProps, options = {}) =>
        mount(<DocGenSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, options);

    test('componentDidMount() should call fetch tags', async () => {
        await act(async () => {
            await getWrapper(defaultProps);
        });
        expect(docGenSidebarProps.getDocGenTags).toHaveBeenCalled();
    });

    test('should render DocGen sidebar component correctly with tags list', async () => {
        let wrapper;
        await act(async () => {
            wrapper = getWrapper(defaultProps);
        });
        wrapper!.update();
        const tagList = wrapper!.find('span.docgen-tag-path');
        expect(tagList).toHaveLength(4);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty state when there are no tags', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: noTagsMock,
            });
        });

        wrapper!.update();
        const emptyState = wrapper!.find({ children: 'This document has no tags' });
        expect(emptyState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should render loading state', async () => {
        const wrapper = await getWrapper({
            ...defaultProps,
            getDocGenTags: noTagsMock,
        });
        const loadingState = wrapper!.find(LoadingIndicator);
        expect(loadingState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
    });

    test('should re-trigger getDocGenTags on click on refresh button', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: errorTagsMock,
            });
        });
        wrapper!.update();

        const refreshBtn = wrapper!.find('button');
        refreshBtn.simulate('click');
        wrapper!.update();
        expect(errorTagsMock).toBeCalledTimes(2);
    });

    test('should render error state', async () => {
        let wrapper;
        await act(async () => {
            wrapper = await getWrapper({
                ...defaultProps,
                getDocGenTags: errorTagsMock,
            });
        });
        wrapper!.update();

        const loadingState = wrapper!.find(Error);
        expect(loadingState).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
        const refreshBtn = wrapper!.find('button');
        expect(refreshBtn).toHaveLength(1);
    });
});
