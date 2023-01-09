import React from 'react';

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

    test('should use aria-label prop', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('input').prop('aria-label')).toBe('Column size');
        expect(
            wrapper
                .find('PlainButton')
                .at(0)
                .prop('aria-label'),
        ).toBe('Decrease column size');
        expect(
            wrapper
                .find('PlainButton')
                .at(1)
                .prop('aria-label'),
        ).toBe('Increase column size');
    });
});
