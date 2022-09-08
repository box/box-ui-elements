import React from 'react';
import { render } from '@testing-library/react';

import HeaderWithCount from '../HeaderWithCount';

describe('features/content-insights/HeaderWithCount', () => {
    const getWrapper = (props = {}) => {
        return render(<HeaderWithCount title="Title type" totalCount={3} {...props} />);
    };

    describe('render', () => {
        test('should render correctly', () => {
            const wrapper = getWrapper();

            expect(wrapper.getByText('Title type')).toBeVisible();
            expect(wrapper.getByText('3')).toBeVisible();
        });

        test.each([undefined, null])('should only render the title if %s count is provided', totalCount => {
            const wrapper = getWrapper({ totalCount });

            expect(wrapper.getByText('Title type')).toBeVisible();
            expect(wrapper.container.querySelector('.HeaderWithCount-titleCount')).toBeNull();
        });
    });
});
