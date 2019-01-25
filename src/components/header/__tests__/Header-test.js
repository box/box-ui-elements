import React from 'react';

import Header from '..';

describe('components/header/Header', () => {
    const MockChildren = () => <div />;

    test('should correctly render children in Header', () => {
        const wrapper = shallow(
            <Header>
                <MockChildren />
            </Header>,
        );

        expect(wrapper.type()).toEqual('header');
        expect(wrapper.hasClass('header')).toBe(true);
        expect(wrapper.hasClass('is-fixed')).toBe(false);
        expect(wrapper.find(MockChildren).length).toEqual(1);
    });

    test('should correctly set backgroundColor style in Header when color is passed down', () => {
        const wrapper = shallow(
            <Header color="#DDD">
                <MockChildren />
            </Header>,
        );

        expect(wrapper.prop('style')).toEqual({
            backgroundColor: '#DDD',
        });
    });

    test('should correctly render fixed Header when fixed is true', () => {
        const wrapper = shallow(
            <Header fixed>
                <MockChildren />
            </Header>,
        );

        expect(wrapper.hasClass('is-fixed')).toBe(true);
    });

    test('should correctly render classNames Header when passed down', () => {
        const wrapper = shallow(
            <Header className="some-class">
                <MockChildren />
            </Header>,
        );

        expect(wrapper.hasClass('some-class')).toBe(true);
    });

    test('should correctly render header custom attributes when specified', () => {
        const wrapper = shallow(
            <Header data-resin-component="header">
                <MockChildren />
            </Header>,
        );

        expect(wrapper.find('header').prop('data-resin-component')).toEqual('header');
    });
});
