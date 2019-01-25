import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Overlay from '../Overlay';

const sandbox = sinon.sandbox.create();
let clock;

describe('components/flyout/Overlay', () => {
    beforeEach(() => {
        clock = sandbox.useFakeTimers();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        clock.restore();
    });

    describe('render()', () => {
        test('should render a div with correct props when called', () => {
            const id = 'overlay';
            const wrapper = mount(
                <Overlay className="hey" id={id}>
                    <p>Hi</p>
                </Overlay>,
            );

            expect(wrapper.childAt(0).is('FocusTrap')).toBe(true);
            expect(wrapper.find('div.overlay').length).toBe(1);

            expect(wrapper.childAt(0).prop('className')).toEqual('hey');
            expect(wrapper.childAt(0).prop('id')).toEqual('overlay');
            expect(wrapper.childAt(0).prop('tabIndex')).toEqual(0);
        });
    });

    describe('closeOverlay()', () => {
        test('should call onClose() from props when called', () => {
            const id = 'overlay-0';
            const wrapper = mount(
                <Overlay className="hey" id={id} onClose={sandbox.mock()}>
                    <p>123</p>
                </Overlay>,
            );

            const instance = wrapper.instance();
            sandbox.stub(instance, 'focusFirstItem');

            instance.closeOverlay();
            clock.tick(0);
        });

        test('should call onClose() from props when called', () => {
            const id = 'overlay-0';
            const wrapper = mount(
                <Overlay className="hey" id={id} onClose={sandbox.mock()}>
                    <p>123</p>
                </Overlay>,
            );

            const instance = wrapper.instance();
            sandbox.stub(instance, 'focusFirstItem');

            instance.closeOverlay();
            clock.tick(0);
        });
    });

    describe('handleKeyDown()', () => {
        const id = 'overlay-0';
        let wrapper;

        beforeEach(() => {
            wrapper = mount(
                <Overlay className="hey" id={id}>
                    <p>123</p>
                </Overlay>,
            );
        });

        test('should call closeOverlay() when event.key is escape', () => {
            const event = {
                key: 'Escape',
                stopPropagation: sandbox.mock(),
                preventDefault: sandbox.mock(),
            };
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('closeOverlay');
            instance.handleOverlayKeyDown(event);
        });

        test('should not prevent default or stop propagation when event.key is not Escape', () => {
            const instance = wrapper.instance();
            const event = {
                key: 'LOL',
                target: { id: 'randomstuff' },
                stopPropagation: sandbox.mock().never(),
                preventDefault: sandbox.mock().never(),
            };
            instance.handleOverlayKeyDown(event);
        });
    });
});
