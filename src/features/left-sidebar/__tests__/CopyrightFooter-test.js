// @flow
import * as React from 'react';

import CopyrightFooter from '../CopyrightFooter';

const date = new Date(1520379287932);

describe('feature/left-sidebar/CopyrightFooter', () => {
    test('should correctly render with the current year', () => {
        const wrapper = shallow(<CopyrightFooter date={date} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should handle arbitrary properties added to link with proper format', () => {
        const cProps = {
            href: '/test',
            'data-resin-target': 'testtarget',
        };
        const wrapper = shallow(<CopyrightFooter date={date} linkProps={cProps} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should include default link when no href is provided', () => {
        const cProps = {
            'data-resin-target': 'testtarget',
        };

        const wrapper = shallow(<CopyrightFooter date={date} linkProps={cProps} />);

        expect(wrapper).toMatchSnapshot();
    });
});
