import React from 'react';
import { render } from 'enzyme';

import Param from '../Param';

// tests the Param component by itself... Normally this should appear
// inside of a FormattedCompMessage, as it wouldn't be too useful
// outside of it.
describe('components/i18n/Param', () => {
    test('should correctly render its string argument', () => {
        const wrapper = render(
            <span>
                <Param description="foo" value="asdf" />
            </span>,
        );

        expect(wrapper.text()).toEqual('asdf');
    });

    test('should correctly render its string argument with variables', () => {
        const name = 'asdf';
        const wrapper = render(
            <span>
                <Param description="foo" value={name} />
            </span>,
        );

        expect(wrapper.text()).toEqual('asdf');
    });

    test('should correctly render its numeric argument', () => {
        const wrapper = render(
            <span>
                <Param description="foo" value={3} />
            </span>,
        );

        expect(wrapper.text()).toEqual('3');
    });

    test('should correctly render an undefined argument', () => {
        const wrapper = render(
            <span>
                <Param description="foo" value={undefined} />
            </span>,
        );

        expect(wrapper.text()).toEqual('');
    });

    test('should correctly render a null argument', () => {
        const wrapper = render(
            <span>
                <Param description="foo" value={null} />
            </span>,
        );

        expect(wrapper.text()).toEqual('');
    });

    test('should correctly render a jsx argument', () => {
        const tmp = <b>foo!</b>;
        const wrapper = render(
            <span>
                <Param description="foo" value={tmp} />
            </span>,
        );

        expect(wrapper.html()).toEqual('<b>foo!</b>');
    });

    test('should correctly render a functional argument', () => {
        const f = function f() {
            return 'asdf';
        };
        const wrapper = render(
            <span>
                <Param description="foo" value={f} />
            </span>,
        );

        expect(wrapper.text()).toEqual('asdf');
    });
});
