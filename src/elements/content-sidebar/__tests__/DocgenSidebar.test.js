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

    // TO DO should render empty state

    // TO DO should render loading state

    // TO DO error state
});
