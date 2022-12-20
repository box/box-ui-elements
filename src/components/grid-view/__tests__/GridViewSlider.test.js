import React from 'react';

import GridViewSlider from '../GridViewSlider';

const intl = {
    formatMessage: jest.fn(),
};

describe('components/grid-view/GridViewSlider', () => {
    test('should render()', () => {
        const wrapper = mount(
            <GridViewSlider
                columnCount={4}
                maxColumnCountcolumnCount={4}
                gridMaxColumns={7}
                gridMinColumns={2}
                intl={intl}
                maxColumnCount={7}
                onChange={() => {}}
            />,
        );
        expect(wrapper).toMatchSnapshot();
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
