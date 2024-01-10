import React from 'react';
import { shallow } from 'enzyme';
import { DocgenSidebarComponent as DocgenSidebar } from '../DocgenSidebar';

const docgenPreviewSidebarProps = {
    getDocgenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            payload: {
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
            },
        }),
    ),
};

const defaultProps = {
    docgenPreviewSidebarProps,
};
describe('elements/content-sidebar/Docgen/DocgenSidebar', () => {
    const getWrapper = (props = defaultProps, options = {}) =>
        shallow(<DocgenSidebar logger={{ onReadyMetric: jest.fn() }} {...props} />, options);

    test('should render Docgen sidebar component correctly with search and tags list', async () => {
        const wrapper = getWrapper(defaultProps);

        const searchBar = wrapper.find('input').at(0);
        expect(searchBar.props().placeholder).toEqual('Search');

        await wrapper.update();

        const tagList = wrapper.find('p').findWhere(node => node.text() === 'Docgen Test Tag');
        expect(tagList).toHaveLength(2);

        expect(wrapper).toMatchSnapshot();
    });

    test('componentDidMount() should call fetch tags', () => {
        getWrapper(defaultProps);

        expect(docgenPreviewSidebarProps.getDocgenTags).toHaveBeenCalled();
    });

    // TO DO should render empty state

    // TO DO should render loading state

    // TO DO error state
});
