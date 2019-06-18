import * as React from 'react';
import { shallow } from 'enzyme/build';
import VersionsItemButton from '../VersionsItemButton';
import { scrollIntoView } from '../../../../utils/dom';

jest.mock('../../../../utils/dom', () => ({
    ...jest.requireActual('../../../../utils/dom'),
    scrollIntoView: jest.fn(),
}));

describe('elements/content-sidebar/versions/VersionsItemButton', () => {
    const getMount = (props = {}) => mount(<VersionsItemButton {...props}>Test</VersionsItemButton>);
    const getShallow = (props = {}) => shallow(<VersionsItemButton {...props}>Test</VersionsItemButton>);

    describe('componentDidUpdate', () => {
        test('should call setScroll if the selected state changed', () => {
            const wrapper = getShallow({ isSelected: false });
            const instance = wrapper.instance();
            instance.setScroll = jest.fn();

            wrapper.setProps({ isSelected: false });
            expect(instance.setScroll).not.toHaveBeenCalled();

            wrapper.setProps({ isSelected: true });
            expect(instance.setScroll).toHaveBeenCalled();
        });
    });

    describe('setScroll', () => {
        test('should scroll into view if the button is selected', () => {
            const wrapper = getMount({ isSelected: false });

            wrapper.instance().setScroll();
            expect(scrollIntoView).toHaveBeenCalledTimes(0);

            wrapper.setProps({ isSelected: true });
            wrapper.instance().setScroll();
            expect(scrollIntoView).toHaveBeenCalledTimes(2); // Called once by componentDidUpdate, once manually
        });
    });

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
});
