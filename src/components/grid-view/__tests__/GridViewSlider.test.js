import * as React from 'react';

import { GridViewSliderBase as GridViewSlider } from '../GridViewSlider';

const intl = {
    formatMessage: message => message.defaultMessage,
};

const getWrapper = () =>
    shallow(
        <GridViewSlider
            columnCount={4}
            gridMaxColumns={7}
            gridMinColumns={2}
            intl={intl}
            maxColumnCount={4}
            onChange={() => {}}
        />,
    );

describe('components/grid-view/GridViewSlider', () => {
    test('should render()', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });
});
