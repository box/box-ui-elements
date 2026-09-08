import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { createIntl } from 'react-intl';
import sinon, { SinonSpy } from 'sinon';

import { ModalDialogBase } from '../ModalDialog';

describe('components/modal/ModalDialog', () => {
    let onRequestBack: SinonSpy;
    let onRequestClose: SinonSpy;
    let wrapper: ShallowWrapper;
    let instance: InstanceType<typeof ModalDialogBase>;
    const title = 'hello';

    beforeEach(() => {
        const intlShape = createIntl({ locale: 'en', messages: {} });
        onRequestClose = sinon.spy();
        onRequestBack = sinon.spy();
        wrapper = shallow(
            <ModalDialogBase
                intl={intlShape}
                onRequestBack={onRequestBack}
                onRequestClose={onRequestClose}
                title={title}
            >
                children
            </ModalDialogBase>,
        );
        instance = wrapper.instance() as InstanceType<typeof ModalDialogBase>;
    });

    test('should set aria props on modal dialog when rendered', () => {
        expect(wrapper.prop('role')).toEqual('dialog');
        expect(wrapper.prop('aria-modal')).toEqual(true);
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

    test('render back button when onRequestBack is defined', () => {
        expect(wrapper.find('.modal-back-button').length).toBeTruthy();
    });

    test('should not render back button if onRequestBack is null', () => {
        wrapper.setProps({ onRequestBack: null });
        expect(wrapper.find('.modal-back-button').length).toBeFalsy();
    });

    test('should call onRequestBack when back button is clicked on', () => {
        wrapper.find('.modal-back-button').simulate('click');
        sinon.assert.calledOnce(onRequestBack);
    });
});
