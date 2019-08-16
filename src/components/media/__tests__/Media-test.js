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
                <Media.Figure>
                    <img src="" alt="some img" />
                </Media.Figure>

                <Media.Body>
                    <Media.Menu />
                    {title}
                    {content}
                </Media.Body>
            </Media>
        );
        const wrapper = mount(compoundComponent);

        expect(wrapper.render()).toMatchSnapshot();
    });

    test('"as" prop changes Media root element', () => {
        const wrapper = shallow(<Media />);
        const wrapperAs = shallow(<Media as="li" />);
        expect(wrapper.is('div')).toBe(true);
        expect(wrapperAs.is('li')).toBe(true);
    });
});
