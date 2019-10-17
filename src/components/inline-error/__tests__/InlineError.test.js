import React from 'react';
import { render } from 'enzyme';

import InlineError from '..';

describe('components/inline-error/InlineError', () => {
    test('should correctly render', () => {
        const children = 'this is a message to put in the notice';
        const title = 'this is the title';
        const className = 'some-class';

        const wrapper = render(
            <InlineError title={title} className={className}>
                {children}
            </InlineError>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
