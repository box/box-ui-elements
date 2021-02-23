import React from 'react';
import { mount, shallow } from 'enzyme';

import Media from '../Media';

jest.mock('../../../icons/general/IconEllipsis', () => () => <div data-test-id="icon-ellipsis" />);

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
                    <Media.Menu>
                        <div>foo</div>
                    </Media.Menu>
                    {title}
                    {content}
                </Media.Body>
            </Media>
        );
        const wrapper = mount(compoundComponent);

        expect(wrapper.render()).toMatchSnapshot();
    });

    test('"as" prop changes Media root element', () => {
        const wrapper = shallow(
            <Media>
                <Media.Figure>foo</Media.Figure>
                <Media.Body>bar</Media.Body>
            </Media>,
        );
        const wrapperAs = shallow(
            <Media as="li">
                <Media.Figure>foo</Media.Figure>
                <Media.Body>bar</Media.Body>
            </Media>,
        );
        expect(wrapper.is('div')).toBe(true);
        expect(wrapperAs.is('li')).toBe(true);
    });
});
