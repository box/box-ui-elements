import * as React from 'react';

import GridViewSlider from '../GridViewSlider';

const getWrapper = () =>
    shallow(
        <GridViewSlider columnCount={4} gridMaxColumns={7} gridMinColumns={2} maxColumnCount={4} onChange={() => {}} />,
    );

describe('components/grid-view/GridViewSlider', () => {
    test('should render()', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});
