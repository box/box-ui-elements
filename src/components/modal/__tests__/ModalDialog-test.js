import React from 'react';
import sinon from 'sinon';

import { ModalDialogBase } from '../ModalDialog';

const sandbox = sinon.sandbox.create();

describe('components/modal/ModalDialog', () => {
    let onRequestClose;
    let wrapper;
    let instance;
    const title = 'hello';

    beforeEach(() => {
        const intlShape = {
            formatMessage: message => message.id,
        };
        onRequestClose = sinon.spy();
        wrapper = shallow(
            <ModalDialogBase intl={intlShape} onRequestClose={onRequestClose} title={title}>
                children
            </ModalDialogBase>,
        );
        instance = wrapper.instance();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    test('should set aria props on modal dialog when rendered', () => {
        expect(wrapper.prop('role')).toEqual('dialog');
        expect(wrapper.prop('aria-labelledby')).toEqual(`${instance.modalID}-label`);
    });

    test('should show a title and children with a close button when rendered', () => {
        expect(wrapper.find(`h2.modal-title#${instance.modalID}-label`).text()).toEqual(title);
        expect(wrapper.find('.modal-content').text()).toEqual('children');
    });

    test('should set correct aria props on modal dialog when type is alert', () => {
        const message = 'message';
        wrapper.setProps({
            children: [message, <div className="actions" />], // eslint-disable-line react/jsx-key
            type: 'alert',
        });
        const content = wrapper.find('.modal-content');
        expect(wrapper.prop('role')).toEqual('alertdialog');
        expect(wrapper.prop('aria-describedby')).toEqual(`${instance.modalID}-desc`);
        expect(content.find(`p#${instance.modalID}-desc`).text()).toEqual(message);
        expect(wrapper.find('div.actions').length).toBe(1);
    });

    test('should call onRequestClose when close button is clicked on', () => {
        wrapper.find('.modal-close-button').simulate('click');
        sinon.assert.calledOnce(onRequestClose);
    });

    test('should add custom props to close button when passed', () => {
        wrapper.setProps({
            closeButtonProps: { 'data-custom-close-button': 'asdf' },
        });
        const closeButtonWrapper = wrapper.find('.modal-close-button');
        expect(closeButtonWrapper.prop('data-custom-close-button')).toEqual('asdf');
    });

    test('should not render close button when onRequestClose is falsey', () => {
        wrapper.setProps({ onRequestClose: undefined });
        expect(wrapper.find('.modal-close-button').length).toBeFalsy();
    });
});
