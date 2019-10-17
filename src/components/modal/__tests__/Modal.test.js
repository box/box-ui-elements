/* eslint-disable react/button-has-type */

import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import Modal from '../Modal';

const sandbox = sinon.sandbox.create();

describe('components/modal/Modal', () => {
    let onRequestClose;
    let clock;
    let wrapper;

    beforeEach(() => {
        onRequestClose = sinon.spy();
        clock = sandbox.useFakeTimers();
    });

    describe('shallow tests', () => {
        beforeEach(() => {
            wrapper = shallow(
                <Modal isOpen onRequestClose={onRequestClose}>
                    children
                </Modal>,
            );
        });

        test('should render nothing when isOpen is false', () => {
            wrapper.setProps({ isOpen: false });
            expect(wrapper.contains('ModalDialog')).toBeFalsy();
        });

        test('should render a modal dialog with props in a Portal when isOpen is true', () => {
            wrapper.setProps({
                title: 'title',
            });
            const portal = wrapper.find('Portal');
            expect(portal.length).toBeTruthy();
            expect(portal.find('.modal-backdrop').length).toBeTruthy();
            expect(portal.find('style').length).toBeTruthy();

            const dialog = portal.find('ModalDialog');
            expect(dialog.length).toBeTruthy();

            expect(dialog.prop('onRequestClose')).toEqual(onRequestClose);
            expect(dialog.prop('title')).toEqual('title');
        });

        test('should render a modal dialog with props in a div when isOpen is true', () => {
            wrapper.setProps({
                shouldNotUsePortal: true,
                title: 'title',
            });
            const wrapperComponent = wrapper.find('div');
            expect(wrapperComponent.length).toBeTruthy();
            expect(wrapperComponent.find('.modal-backdrop').length).toBeTruthy();
            expect(wrapperComponent.find('style').length).toBeTruthy();

            const dialog = wrapperComponent.find('ModalDialog');
            expect(dialog.length).toBeTruthy();

            expect(dialog.prop('onRequestClose')).toEqual(onRequestClose);
            expect(dialog.prop('title')).toEqual('title');
        });

        test('should not call the modal.close when random key is pressed', () => {
            wrapper.simulate('keyDown', { key: 'A' });
            sinon.assert.notCalled(onRequestClose);
        });

        test('should call the modal.close and stop event propagation when escape is pressed', () => {
            const event = {
                key: 'Escape',
                stopPropagation: jest.fn(),
            };

            wrapper.simulate('keyDown', event);
            sinon.assert.calledOnce(onRequestClose);

            expect(event.stopPropagation).toBeCalled();
        });

        test('should call close when backdrop is clicked on', () => {
            wrapper.find('.modal-backdrop').simulate('click');
            sinon.assert.calledOnce(onRequestClose);
        });

        test('should pass styles in to children components when style prop is passed in', () => {
            const backdrop = { backgroundColor: 'red' };
            const dialog = { color: 'red' };
            wrapper.setProps({
                style: { backdrop, dialog },
                isOpen: true,
            });
            expect(wrapper.find('.modal-backdrop').prop('style')).toEqual(backdrop);
            expect(wrapper.find('ModalDialog').prop('style')).toEqual(dialog);
        });

        test('should render a LoadingIndicator and NOT a ModalDialog when modal is open and is loading', () => {
            wrapper.setProps({
                isOpen: true,
                isLoading: true,
            });

            const loadingIndicator = wrapper.find('LoadingIndicator');
            expect(loadingIndicator.length).toBe(1);
            expect(loadingIndicator.prop('size')).toEqual('large');
            expect(wrapper.find('ModalDialog').length).toBe(0);
        });
    });

    describe('shallow tests with custom backdrop handler', () => {
        const backdropHandler = sinon.spy();
        beforeEach(() => {
            wrapper = shallow(
                <Modal isOpen onBackdropClick={backdropHandler} onRequestClose={onRequestClose}>
                    children
                </Modal>,
            );
        });

        test('should call custom backdrop handler when backdrop is clicked on', () => {
            wrapper.find('.modal-backdrop').simulate('click');
            sinon.assert.calledOnce(backdropHandler);
            sinon.assert.notCalled(onRequestClose);
        });
    });

    describe('mount tests', () => {
        beforeEach(() => {
            wrapper = mount(
                <Modal onRequestClose={onRequestClose}>
                    <button id="first" />
                    <button id="last" />
                </Modal>,
            );
        });

        afterEach(() => {
            wrapper.unmount();
        });

        test('should focus first element when mounting', () => {
            wrapper = mount(
                <Modal isOpen onRequestClose={onRequestClose}>
                    <button id="first" />
                    <button id="last" />
                </Modal>,
            );
            clock.tick(1);
            expect(document.activeElement.id).toEqual('first');
        });

        test('should focus first element when opening', () => {
            wrapper.setProps({ isOpen: true });
            clock.tick(1);
            expect(document.activeElement.id).toEqual('first');
        });

        test('should focus first element when loading state is removed', () => {
            wrapper = mount(
                <Modal isLoading isOpen onRequestClose={onRequestClose}>
                    <button id="first" />
                    <button id="last" />
                </Modal>,
            );
            wrapper.setProps({ isLoading: false });
            clock.tick(1);
            expect(document.activeElement.id).toEqual('first');
        });

        test('should focus on close button on mount when no other focusable elements in modal', () => {
            wrapper = mount(
                <Modal isOpen onRequestClose={onRequestClose}>
                    <div />
                </Modal>,
            );
            clock.tick(1);
            expect(document.activeElement.className).toContain('modal-close-button');
        });

        test('should focus custom element when opening', () => {
            wrapper = mount(
                <Modal focusElementSelector=".custom-element" onRequestClose={onRequestClose}>
                    <button id="last" />
                    <button className="custom-element" />
                </Modal>,
            );
            wrapper.setProps({ isOpen: true });
            clock.tick(1);
            expect(document.activeElement.className).toContain('custom-element');
        });

        test('should focus custom element when loading state is removed', () => {
            wrapper = mount(
                <Modal focusElementSelector=".custom-element" isLoading isOpen onRequestClose={onRequestClose}>
                    <button id="last" />
                    <button className="custom-element" />
                </Modal>,
            );

            wrapper.setProps({ isLoading: false });
            clock.tick(1);
            expect(document.activeElement.className).toContain('custom-element');
        });

        test('should throw an error if custom element is not found', () => {
            wrapper = mount(
                <Modal focusElementSelector=".selector-with-no-matching-element" onRequestClose={onRequestClose}>
                    <button id="last" />
                    <button className="custom-element" />
                </Modal>,
            );

            expect(() => {
                wrapper.setProps({ isOpen: true });
                clock.tick(1);
            }).toThrow();
        });
    });
});
