import React from 'react';
import { shallow } from 'enzyme';
import { DocgenSidebarComponent as DocgenSidebar } from '../DocgenSidebar';

const docgenPreviewSidebarProps = {
    getDocgenTags: jest.fn().mockReturnValue(
        Promise.resolve({
            enabled: true,
            extension: 'docx',
            tags: [
                {
                    id: '1',
                    content: 'Docgen Test Tag',
                },
                {
                    id: '12',
                    content: 'Docgen Test Tag 2',
                },
            ],
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

        // search bar
        expect(
            wrapper
                .find('input')
                .at(0)
                .props().placeholder,
        ).toEqual('Search');

        await wrapper.update();

        // tags list
        const tag = wrapper.find('p').findWhere(node => node.text() === 'Docgen Test Tag');
        expect(tag).toHaveLength(2);

        expect(wrapper).toMatchSnapshot();
    });

    // TO DO should render empty state

    // TO DO should render loading state

    // TO DO error state
    test('componentDidMount() should call fetch tags', () => {
        getWrapper(defaultProps);

        expect(docgenPreviewSidebarProps.getDocgenTags).toHaveBeenCalled();
    });
});
