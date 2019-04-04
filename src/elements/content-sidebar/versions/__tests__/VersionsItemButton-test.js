import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsItemButton from '../VersionsItemButton';

describe('elements/content-sidebar/versions/VersionsItemButton', () => {
    const getMount = (props = {}) => mount(<VersionsItemButton {...props}>Test</VersionsItemButton>);
    const getShallow = (props = {}) => shallow(<VersionsItemButton {...props}>Test</VersionsItemButton>);

    describe('render', () => {
        test('should render in enabled state correctly', () => {
            const wrapper = getShallow({
                isDisabled: false,
                isSelected: false,
            });

            expect(wrapper.prop('aria-disabled')).toBe(false);
            expect(wrapper.prop('className')).not.toContain('bcs-is-disabled');
            expect(wrapper).toMatchSnapshot();
        });

        test('should render in disabled state correctly', () => {
            const wrapper = getShallow({
                isDisabled: true,
                isSelected: false,
            });

            expect(wrapper.prop('aria-disabled')).toBe(true);
            expect(wrapper.prop('className')).toContain('bcs-is-disabled');
            expect(wrapper).toMatchSnapshot();
        });

        test('should render in enabled state correctly', () => {
            const wrapper = getShallow({
                isDisabled: false,
                isSelected: true,
            });

            expect(wrapper.prop('className')).toContain('bcs-is-selected');
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('onKeyPress', () => {
        test('calls onClick event handler', () => {
            const clickHandler = jest.fn();
            const preventDefault = jest.fn();
            const button = getMount({ onClick: clickHandler });

            button.simulate('keyPress', {
                key: 'Enter',
            });

            button.simulate('keyPress', {
                key: ' ',
                preventDefault,
            });

            expect(clickHandler).toBeCalledTimes(2);
            expect(preventDefault).toBeCalledTimes(1);
        });

        test('does not call onClick event handler on invalid keypress', () => {
            const clickHandler = jest.fn();
            const button = getMount({ onClick: clickHandler });

            button.simulate('keyPress', {
                key: 'Ctrl',
            });

            expect(clickHandler).not.toBeCalled();
        });
    });
});
