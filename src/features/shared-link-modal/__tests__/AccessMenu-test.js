import React from 'react';
import sinon from 'sinon';

import AccessMenu from '../AccessMenu';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-modal/AccessMenu', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <AccessMenu
                accessLevel={PEOPLE_WITH_LINK}
                allowedAccessLevels={{
                    [PEOPLE_WITH_LINK]: true,
                    [PEOPLE_IN_COMPANY]: true,
                    [PEOPLE_IN_ITEM]: true,
                }}
                canRemoveLink
                changeAccessLevel={sandbox.stub()}
                enterpriseName="enterprise"
                itemType="folder"
                removeLink={sandbox.stub()}
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('openConfirmModal()', () => {
        test('should set state.isConfirmModalOpen to true', () => {
            const wrapper = getWrapper();

            wrapper.instance().openConfirmModal();

            expect(wrapper.state('isConfirmModalOpen')).toBe(true);
        });
    });

    describe('closeConfirmModal()', () => {
        test('should set state.isConfirmModalOpen to false', () => {
            const wrapper = getWrapper();
            wrapper.setState({ isConfirmModalOpen: true });

            wrapper.instance().closeConfirmModal();

            expect(wrapper.state('isConfirmModalOpen')).toBe(false);
        });
    });

    describe('renderMenu()', () => {
        test('should have correct click handlers on all menu options', () => {
            const wrapper = getWrapper({
                changeAccessLevel: sandbox.mock().thrice(),
            });

            const menuOptions = wrapper.find('SelectMenuItem');
            expect(menuOptions.length).toBe(4);

            // simulate click on all four options
            menuOptions.forEach(menuOption => {
                menuOption.simulate('click');
            });

            expect(wrapper.state('isConfirmModalOpen')).toBe(true);
        });

        test('should not render disabled menu options', () => {
            const wrapper = getWrapper({
                allowedAccessLevels: {
                    [PEOPLE_WITH_LINK]: true,
                    [PEOPLE_IN_COMPANY]: false,
                    [PEOPLE_IN_ITEM]: false,
                },
            });

            const menuOptions = wrapper.find('SelectMenuItem');
            expect(menuOptions.length).toBe(2);
        });

        test('should not render remove option when props.canRemoveLink is false', () => {
            const wrapper = getWrapper({
                allowedAccessLevels: {
                    [PEOPLE_WITH_LINK]: true,
                    [PEOPLE_IN_COMPANY]: false,
                    [PEOPLE_IN_ITEM]: false,
                },
                canRemoveLink: false,
            });

            const menuOptions = wrapper.find('SelectMenuItem');
            expect(menuOptions.length).toBe(1);
        });
    });

    describe('render()', () => {
        test('should render component correctly', () => {
            const wrapper = getWrapper({
                accessDropdownMenuProps: { constrainToWindow: true },
                accessMenuButtonProps: { 'data-resin-thing': 'access' },
                removeLinkButtonProps: { 'data-resin-thing': 'remove' },
            });

            expect(wrapper).toMatchSnapshot();
            expect(wrapper.find('RemoveLinkConfirmModal').prop('onRequestClose')).toEqual(
                wrapper.instance().closeConfirmModal,
            );
        });
    });
});
