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

        expect(wrapper).toMatchInlineSnapshot(`
            <div
              class="inline-alert inline-alert-visible inline-alert-error some-class"
            >
              <strong>
                this is the title
              </strong>
              <div>
                this is a message to put in the notice
              </div>
            </div>
        `);
    });
});
