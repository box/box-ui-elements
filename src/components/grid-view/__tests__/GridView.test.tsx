import * as React from 'react';
import { shallow } from 'enzyme';

import GridView from '../GridView';

describe('components/grid-view/GridView', () => {
    test('should render()', () => {
        const collection = { items: [{ type: 'folder', id: '001', name: 'Example Folder' }] } as const;
        const wrapper = shallow(
            <GridView
                columnCount={5}
                currentCollection={collection}
                height={600}
                slotRenderer={(index: number) => <div> {index} </div>}
                width={400}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
