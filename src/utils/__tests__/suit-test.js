import * as React from 'react';
import { render } from 'enzyme';
import suit from '../suit';

describe('util/suit', () => {
    test('creates component', () => {
        const Example = suit('Example');
        const wrapper = render(<Example />);
        expect(wrapper.attr('class')).toEqual(expect.stringMatching(/^bdl-.*$/));
    });

    test('`scope` option changes classname prefix', () => {
        const scope = 'box';
        const Example = suit('Example', { scope });
        const wrapper = render(<Example />);

        expect(wrapper.attr('class')).toEqual(expect.stringMatching(/^box-.*$/));
    });

    test('`tag` option changes default element', () => {
        const tag = 'h2';
        const Heading2 = suit('Heading-2', { tag });
        const wrapper = render(<Heading2 />);

        expect(wrapper.is('h2')).toEqual(true);
    });

    test('component accepts `as` prop to change base element', () => {
        const defaultTag = 'h1';
        const Heading = suit('Heading', { tag: defaultTag });
        const wrapper = render(<Heading as="h2" />);

        expect(wrapper.is('h2')).toEqual(true);
    });

    test('component accepts `className` prop to add more classes', () => {
        const Example = suit('Example');
        const wrapper = render(<Example className="other-class" />);

        expect(wrapper.attr('class')).toEqual(expect.stringMatching(/bdl-Example/));
        expect(wrapper.attr('class')).toEqual(expect.stringMatching(/other-class/));
    });

    test('all options can be used at the same time', () => {
        const Card = suit('Example', { tag: 'span', scope: 'box' });
        const wrapper = render(<Card as="section" className="another-class" />);

        expect(wrapper).toMatchInlineSnapshot(`
            <section
              class="box-Example another-class"
            />
        `);
    });
});
