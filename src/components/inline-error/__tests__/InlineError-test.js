import React from 'react';

import InlineError from '..';

describe('components/inline-error/InlineError', () => {
    test('should correctly render', () => {
        const children = 'this is a message to put in the notice';
        const title = 'this is the title';
        const className = 'some-class';

        const wrapper = mount(
            <InlineError title={title} className={className}>
                {children}
            </InlineError>,
        ).render();

        expect(wrapper).toMatchInlineSnapshot(`
            <div
              class="inline-alert inline-alert-visible inline-alert-error some-class"
            >
              <b>
                this is the title
              </b>
              <div>
                this is a message to put in the notice
              </div>
            </div>
        `);
    });
});
