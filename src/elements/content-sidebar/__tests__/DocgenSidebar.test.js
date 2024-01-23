import React from 'react';
import { mount } from 'enzyme';
import { DocGenSidebarComponent as DocGenSidebar } from '../DocGenSidebar/DocGenSidebar';

const intl = {
    formatMessage: message => message.defaultMessage,
};

const docGenSidebarProps = {
    getDocGenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            pagination: {},
            data: [
                {
                    tagContent: '{{ isActive }}',
                    tagType: 'text',
                    jsonPaths: ['isActive'],
                },
                {
                    tagContent: '{{ about }}',
                    tagType: 'text',
                    jsonPaths: ['about'],
                },
                {
                    tagContent: '{{ phone }}',
                    tagType: 'text',
                    jsonPaths: ['phone'],
                },
                {
                    tagContent: '{{ company }}',
                    tagType: 'text',
                    jsonPaths: ['company'],
                },
            ],
        }),
    ),
    intl,
};

const defaultProps = {
    ...docGenSidebarProps,
};
describe('elements/content-sidebar/DocGenSidebar', () => {
    const getWrapper = (props = defaultProps, options = {}) =>
        mount(<DocGenSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, options);

    test('componentDidMount() should call fetch tags', () => {
        getWrapper(defaultProps);

        expect(docGenSidebarProps.getDocGenTags).toHaveBeenCalled();
    });

    test('should render DocGen sidebar component correctly with tags list', async () => {
        const wrapper = await getWrapper(defaultProps);

        await wrapper.update();

        const tagList = wrapper.find('span.docgen-tag-path');
        expect(tagList).toHaveLength(4);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render empty state when there are no tags', async () => {
        const wrapper = await getWrapper({
            ...defaultProps,
            getDocGenTags: jest.fn().mockReturnValue(Promise.resolve({ data: [] })),
        });

        await wrapper.update();

        const emptyState = wrapper.find({ children: 'No Tags found' });
        expect(emptyState).toHaveLength(1);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render loading state', async () => {
        const wrapper = await getWrapper({
            ...defaultProps,
            getDocGenTags: jest.fn().mockReturnValue(Promise.resolve({ data: [] })),
        });

        const loadingState = wrapper.find({ children: 'Loading tags' });
        expect(loadingState).toHaveLength(1);

        expect(wrapper).toMatchSnapshot();
    });

    // TO DO error state
});
