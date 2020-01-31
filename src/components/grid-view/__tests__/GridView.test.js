import React from 'react';

import GridView from '../GridView';

describe('components/grid-view/GridView', () => {
    test('should render()', () => {
        const collection = { items: [{ type: 'folder', id: '001', name: 'Example Folder' }] };
        const wrapper = shallow(
            <GridView
                columnCount={5}
                currentCollection={collection}
                height={600}
                onItemClick={() => {}}
                onItemSelect={() => {}}
                slotRenderer={index => <div> {index} </div>}
                width={400}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
