import React from 'react';
import sinon from 'sinon';

import PermissionMenu from '../PermissionMenu';
import { CAN_VIEW } from '../constants';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-modal/PermissionMenu', () => {
    const getWrapper = (props = {}) =>
        shallow(<PermissionMenu changePermissionLevel={sandbox.stub()} permissionLevel={CAN_VIEW} {...props} />);

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should return null when changePermissionLevel is falsey', () => {
        const wrapper = getWrapper({ changePermissionLevel: undefined });

        expect(wrapper.type()).toBeNull();
    });

    test('should return null when permissionLevel is falsey', () => {
        const wrapper = getWrapper({ permissionLevel: undefined });

        expect(wrapper.type()).toBeNull();
    });

    test('should render a DropdownMenu with a PlainButton and Menu', () => {
        const wrapper = getWrapper();

        expect(wrapper.find('DropdownMenu').length).toBe(1);
        expect(wrapper.find('PlainButton').length).toBe(1);
        expect(wrapper.find('Menu').length).toBe(1);
    });

    test('should disable button when submitting', () => {
        const wrapper = getWrapper({ submitting: true });

        expect(wrapper.find('PlainButton').prop('disabled')).toBe(true);
    });

    test('should render both options correctly', () => {
        const wrapper = getWrapper({
            changePermissionLevel: sandbox.mock().twice(),
        });

        const options = wrapper.find('SelectMenuItem');
        expect(options.length).toBe(2);

        options.forEach((option, i) => {
            if (i === 0) {
                expect(option.prop('isSelected')).toBe(true);
            }
            option.simulate('click');
        });
    });
});
