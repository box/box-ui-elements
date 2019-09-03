import React from 'react';

import GridViewSlider from '../GridViewSlider';

describe('components/grid-view/GridViewSlider', () => {
    test('should render()', () => {
        const wrapper = shallow(<GridViewSlider columnCount={4} maxColumnCount={7} onChange={() => {}} />);
        expect(wrapper).toMatchSnapshot();
    });
});
