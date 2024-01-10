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

    test('componentDidMount() should call fetch tags', () => {
        getWrapper(defaultProps);

        expect(docgenPreviewSidebarProps.getDocgenTags).toHaveBeenCalled();
    });

    test('should render Docgen sidebar component correctly with search and tags list', async () => {
        const wrapper = getWrapper(defaultProps);

        const searchBar = wrapper.find('input').at(0);
        expect(searchBar.props().placeholder).toEqual('Search');

        await wrapper.update();

        const tagList = wrapper.find('p');
        expect(tagList).toHaveLength(4);

        expect(wrapper).toMatchSnapshot();
    });

    // TO DO should render empty state

    // TO DO should render loading state

    // TO DO error state
});
