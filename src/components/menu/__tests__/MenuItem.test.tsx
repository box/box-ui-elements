import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import MenuItem from '../MenuItem';

const sandbox = sinon.sandbox.create();

describe('components/menu/MenuItem', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should correctly render a list element with correct props', () => {
            const wrapper = shallow(<MenuItem>Test</MenuItem>);

            expect(wrapper.is('li')).toBe(true);
            expect(wrapper.hasClass('menu-item')).toBe(true);
            expect(wrapper.prop('role')).toEqual('menuitem');
            expect(wrapper.prop('tabIndex')).toEqual(-1);
        });

        test('should add class name when specified', () => {
            const wrapper = shallow(<MenuItem className="test">Test</MenuItem>);

            expect(wrapper.hasClass('test')).toBe(true);
        });

        test('should add correct class and aria attributes when item is selectable', () => {
            const wrapper = shallow(<MenuItem isSelectItem>Test</MenuItem>);

            expect(wrapper.hasClass('is-select-item')).toBe(true);
            expect(wrapper.prop('role')).toEqual('menuitemradio');
        });

        test('should add correct class and aria attributes when item is selected', () => {
            const wrapper = shallow(
                <MenuItem isSelected isSelectItem>
                    Test
                </MenuItem>,
            );

            expect(wrapper.hasClass('is-selected')).toBe(true);
            expect(wrapper.prop('aria-checked')).toBe(true);
        });

        test('should not render a RadarAnimation if showRadar is false', () => {
            const wrapper = shallow(<MenuItem showRadar={false}>Test</MenuItem>);
            expect(wrapper.find('RadarAnimation')).toMatchSnapshot();
        });

        test('should render a RadarAnimation if showRadar is true', () => {
            const wrapper = shallow(<MenuItem showRadar>Test</MenuItem>);
            expect(wrapper.find('RadarAnimation')).toMatchSnapshot();
        });
    });

    describe('onClickHandler()', () => {
        test('should click when menu item has isDisabled prop', () => {
            const wrapper = shallow(
                <MenuItem isDisabled onClick={sandbox.mock().never()}>
                    Test
                </MenuItem>,
            );

            wrapper.simulate('click', {
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should fire onClick when it exists', () => {
            const wrapper = shallow(<MenuItem onClick={sandbox.mock()}>Test</MenuItem>);

            wrapper.simulate('click', {
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });
});
