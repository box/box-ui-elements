import React from 'react';
import sinon from 'sinon';

import SharedLinkModal from '../SharedLinkModal';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from '../constants';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-modal/SharedLinkModal', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <SharedLinkModal
                accessLevel={PEOPLE_WITH_LINK}
                allowedAccessLevels={{
                    [PEOPLE_WITH_LINK]: true,
                    [PEOPLE_IN_COMPANY]: true,
                    [PEOPLE_IN_ITEM]: true,
                }}
                canRemoveLink
                changeAccessLevel={sandbox.stub()}
                enterpriseName="enterprise"
                itemName="filename.gif"
                itemType="folder"
                onCopySuccess={sandbox.stub()}
                onRequestClose={sandbox.stub()}
                removeLink={sandbox.stub()}
                sharedLink="http://box.com"
                {...props}
            />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('renderSharedLink()', () => {
        test('should render a SharedLink correctly', () => {
            const wrapper = getWrapper();

            expect(wrapper.find('SharedLink')).toMatchSnapshot();
        });
    });

    describe('renderEmailSharedLink()', () => {
        test('should not render EmailSharedLink when missing correct props', () => {
            const wrapper = getWrapper();

            expect(wrapper.find('EmailSharedLink').length).toBe(0);
        });

        test('should render EmailSharedLink when correct props are provided', () => {
            const wrapper = getWrapper({
                getContacts: sandbox.stub(),
                contacts: [],
                sendEmail: sandbox.stub(),
            });

            expect(wrapper.find('EmailSharedLink').length).toBe(1);
        });

        test('should set state.isEmailSharedLinkExpanded to true when onExpand is called', () => {
            const wrapper = getWrapper({
                getContacts: sandbox.stub(),
                contacts: [],
                sendEmail: sandbox.stub(),
            });

            wrapper.find('EmailSharedLink').prop('onExpand')();

            expect(wrapper.state('isEmailSharedLinkExpanded')).toBe(true);
        });
    });

    describe('render()', () => {
        test('should render a Modal', () => {
            const wrapper = getWrapper({
                onRequestClose: sandbox.mock(),
            });

            const modal = wrapper.find('Modal');
            expect(modal.length).toBe(1);
            expect(modal.prop('focusElementSelector')).toEqual('.shared-link-container input');

            const closeBtn = wrapper.find('Button');
            expect(closeBtn.length).toBe(1);
            closeBtn.simulate('click');
        });

        test('should disable closing when submission is in progress', () => {
            const wrapper = getWrapper({ submitting: true });

            const modal = wrapper.find('Modal');
            expect(modal.prop('onRequestClose')).toBeFalsy();

            const closeBtn = wrapper.find('Button');
            expect(closeBtn.prop('isDisabled')).toBe(true);
        });
    });
});
