import React from 'react';

import Media from '../Media';

jest.mock('../../../icons/general/IconEllipsis', () => () => <icon-ellipsis />);

describe('components/Media', () => {
    test('compound component', () => {
        const title = (
            <div>
                <b>Yo Yo Ma</b> commented on this file
            </div>
        );
        const content = <div>Please review the notes</div>;

        const compoundComponent = (
            <Media>
                <Media.Img>
                    <img src="" alt="some img" />
                </Media.Img>

                <Media.Body>
                    <Media.Menu>Hi</Media.Menu>
                    {title}
                    {content}
                </Media.Body>
            </Media>
        );
        const wrapper = mount(compoundComponent);

        expect(wrapper.render()).toMatchSnapshot();
    });

    test('"as" prop changes Media root element', () => {
        const compoundComponent = <Media as="li" />;
        const wrapper = mount(compoundComponent);

        expect(wrapper.render()).toMatchInlineSnapshot(`
<li
  class="bdl-Media"
/>
`);
    });
});
