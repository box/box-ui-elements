import React from 'react';

import GridViewSlot from '../GridViewSlot';

describe('components/grid-view/GridViewSlot', () => {
    test('should render()', () => {
        const wrapper = shallow(
            <GridViewSlot
                key="key"
                slotIndex={0}
                slotRenderer={index => <div> {index} </div>}
                item={null}
                onItemSelect={() => {}}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
