import * as React from 'react';
import { mount, MountRendererProps, ReactWrapper } from 'enzyme';

import Portal from '../Portal';

describe('components/portal/Portal', () => {
    let attachTo: HTMLElement | null;
    let wrapper: ReactWrapper | null = null;

    /**
     * Helper method to mount things to the correct DOM element
     * this makes it easier to clean up after ourselves after each test.
     */
    const mountToBody = (component: React.ReactElement, options?: MountRendererProps) => {
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
        if (wrapper && wrapper.exists()) {
            wrapper.unmount();
            wrapper = null;
        }
        document.body.removeChild(attachTo as HTMLElement);
    });

    test('should render the portal as a child to body', () => {
        mountToBody(<Portal />);
        const portalParentElement = document.querySelector('[data-portal]')?.parentElement;
        expect(portalParentElement && portalParentElement.tagName.toLowerCase()).toEqual('body');
    });

    test('should render the portal children as children node', () => {
        mountToBody(
            <Portal>
                <div id="foo">bar</div>
            </Portal>,
        );
        const portal = document.querySelector('[data-portal]');
        const child = portal ? portal.querySelector('#foo') : null;
        expect(child).toBeTruthy();
        expect(attachTo && attachTo.textContent).toEqual('');
    });

    test('should pass Portal props as props to the React Root div', () => {
        mountToBody(
            <Portal
                style={{
                    color: 'blue',
                }}
            />,
        );
        const portal = document.querySelector('[data-portal]');
        const reactRoot = portal ? portal.querySelector('div') : null;
        expect(reactRoot && reactRoot.style.color).toEqual('blue');
    });

    test('should propagate parent context to the children', () => {
        /**
         * Test class with context
         */
        const TestPortalContext = React.createContext({ name: 'fn-2187' });
        class TestPortal extends React.PureComponent {
            static contextType = TestPortalContext;

            render() {
                return <Portal {...this.props} />;
            }
        }
        TestPortal.contextType = TestPortalContext;
        const ChildComponent = (context: { name: string }) => {
            expect(context.name).toEqual('fn-2187');
            return <div id="sanity" />;
        };
        mountToBody(
            <TestPortal>
                <TestPortalContext.Consumer>{context => <ChildComponent {...context} />}</TestPortalContext.Consumer>
            </TestPortal>,
        );
        expect(document.querySelector('#sanity')).toBeTruthy();
    });

    test('should remove the portal from the DOM when unmounting', () => {
        mountToBody(<Portal />);
        expect(document.querySelector('[data-portal]')).toBeTruthy();
        if (wrapper) {
            wrapper.unmount();
        }
        expect(document.querySelector('[data-portal]')).toBeFalsy();
    });

    test('should update portaled DOM when updating React props', () => {
        mountToBody(<Portal>wee</Portal>);
        if (wrapper) {
            wrapper.setProps({ children: 'boo' });
        }
        const portal = document.querySelector('[data-portal]');
        expect(portal && portal.textContent).toEqual('boo');
    });

    test('should used a passed in document if provided', () => {
        const newDoc = document.implementation.createHTMLDocument('doc');
        mountToBody(<Portal container={newDoc.body}>text</Portal>);
        const portal = newDoc.querySelector('[data-portal]');
        expect(portal && portal.ownerDocument && portal.ownerDocument.title).toEqual('doc');
    });
});
