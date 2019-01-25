import React from 'react';
import sinon from 'sinon';

import RemoveLinkConfirmModal from '../RemoveLinkConfirmModal';

const sandbox = sinon.sandbox.create();

describe('features/shared-link-modal/RemoveLinkConfirmModal', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <RemoveLinkConfirmModal isOpen onRequestClose={sandbox.stub()} removeLink={sandbox.stub()} {...props} />,
        );

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should render a confirmation Modal', () => {
        const wrapper = getWrapper({
            onRequestClose: sandbox.mock(),
            removeLink: sandbox.mock(),
        });

        const modal = wrapper.find('Modal');
        expect(modal.length).toBe(1);
        expect(modal.prop('isOpen')).toBe(true);
        expect(modal.prop('onRequestClose')).toBeTruthy();

        const closeBtn = wrapper.find('Button');
        expect(closeBtn.length).toBe(1);
        closeBtn.simulate('click');

        const okayBtn = wrapper.find('PrimaryButton');
        expect(okayBtn.length).toBe(1);
        okayBtn.simulate('click');
    });

    test('should disable modal closing and set loading state when props.submitting is true', () => {
        const wrapper = getWrapper({
            submitting: true,
        });

        const modal = wrapper.find('Modal');
        expect(modal.prop('onRequestClose')).toBeFalsy();

        expect(wrapper.find('Button').prop('isDisabled')).toBe(true);

        const okayBtn = wrapper.find('PrimaryButton');
        expect(okayBtn.prop('isDisabled')).toBe(true);
        expect(okayBtn.prop('isLoading')).toBe(true);
    });
});
