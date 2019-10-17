import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { mount } from 'enzyme';

import Portal from '../Portal';

describe('components/portal/Portal', () => {
    let attachTo;
    let wrapper = null;

    /**
     * Helper method to mount things to the correct DOM element
     * this makes it easier to clean up after ourselves after each test.
     */
    const mountToBody = (component, options) => {
        wrapper = mount(component, { attachTo, ...options });
    };

    beforeEach(() => {
        // Set up a place to mount
        attachTo = document.createElement('div');
        attachTo.setAttribute('data-mounting-point', '');
        document.body.appendChild(attachTo);
    });

    afterEach(() => {
        // Unmount and remove the mounting point after each test
        if (wrapper.exists()) {
            wrapper.unmount();
            wrapper = null;
        }
        document.body.removeChild(attachTo);
    });

    test('should render the portal as a child to body', () => {
        mountToBody(<Portal />);
        const portal = document.querySelector('[data-portal]');
        expect(portal.parentElement.tagName.toLowerCase()).toEqual('body');
    });

    test('should render the portal children as children node', () => {
        mountToBody(
            <Portal>
                <div id="foo">bar</div>
            </Portal>,
        );
        const portal = document.querySelector('[data-portal]');
        const child = portal.querySelector('#foo');
        expect(child).toBeTruthy();
        expect(attachTo.textContent).toEqual('');
    });

    test('should pass Portal props as props to the React Root div', () => {
        mountToBody(<Portal style={{ color: 'blue' }} />);
        const portal = document.querySelector('[data-portal]');
        const reactRoot = portal.querySelector('div');
        expect(reactRoot.style.color).toEqual('blue');
    });

    test('should propagate parent context to the children', () => {
        /**
         * Test class with context
         */
        class TestPortal extends Component {
            static childContextTypes = {
                name: PropTypes.string,
            };

            getChildContext() {
                return { name: 'fn-2187' };
            }

            render() {
                return <Portal {...this.props} />;
            }
        }
        const ChildComponent = (props, context) => {
            expect(context.name).toEqual('fn-2187');
            return <div id="sanity" />;
        };
        ChildComponent.contextTypes = { name: PropTypes.string };
        mountToBody(
            <TestPortal>
                <ChildComponent />
            </TestPortal>,
        );
        expect(document.querySelector('#sanity')).toBeTruthy();
    });

    test('should remove the portal from the DOM when unmounting', () => {
        mountToBody(<Portal />);
        expect(document.querySelector('[data-portal]')).toBeTruthy();
        wrapper.unmount();
        expect(document.querySelector('[data-portal]')).toBeFalsy();
    });

    test('should update portaled DOM when updating React props', () => {
        mountToBody(<Portal>wee</Portal>);
        wrapper.setProps({ children: 'boo' });
        const portal = document.querySelector('[data-portal]');
        expect(portal.textContent).toEqual('boo');
    });

    test('should used a passed in document if provided', () => {
        const newDoc = document.implementation.createHTMLDocument('doc');
        mountToBody(<Portal container={newDoc.body}>text</Portal>);
        const portal = newDoc.querySelector('[data-portal]');
        expect(portal.ownerDocument.title).toEqual('doc');
    });
});
