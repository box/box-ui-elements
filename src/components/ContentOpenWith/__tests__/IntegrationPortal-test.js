import React from 'react';
import { shallow } from 'enzyme';
import IntegrationPortal from '../IntegrationPortal';

const INTEGRATION_CONTAINER_ID = 'integration-container';

describe('components/ContentOpenWith/IntegrationPortal', () => {
    const getWrapper = props => shallow(<IntegrationPortal {...props} />);

    it('should use an existing container if possible', () => {
        const container = document.createElement('div');
        container.id = INTEGRATION_CONTAINER_ID;
        document.body.appendChild(container);

        const wrapper = getWrapper({
            integrationWindow: {
                // use normal document in our integrationWindow
                document,
            },
        });

        const instance = wrapper.instance();
        expect(instance.containerElement).toEqual(container);
    });

    it('should create the container if needed, and assign an id ', () => {
        const wrapper = getWrapper({
            integrationWindow: {
                // use normal document in our integrationWindow
                document,
            },
        });

        wrapper.instance();
        const containerElement = document.querySelector('div');
        expect(!!containerElement).toBeTruthy();
        expect(containerElement.id).toEqual(INTEGRATION_CONTAINER_ID);
    });

    describe('componentDidMount()', () => {
        it('should copy styles and append the container to the integration window', () => {
            const wrapper = getWrapper({
                integrationWindow: {
                    // use normal document in our integrationWindow
                    document,
                },
            });
            const instance = wrapper.instance();
            instance.containerElement = document.createElement('div');
            instance.copyStyles = jest.fn();

            instance.componentDidMount();

            expect(instance.copyStyles).toBeCalled();
            expect(!!document.querySelector('div')).toBeTruthy();
        });
    });

    describe('copyStyles()', () => {
        let integrationWindow;

        beforeEach(() => {
            const mockDoc = document.implementation.createDocument(
                'http://www.w3.org/1999/xhtml',
                'html',
            );
            const body = mockDoc.createElement('body');
            const head = mockDoc.createElement('head');
            mockDoc.documentElement.appendChild(head);
            mockDoc.documentElement.appendChild(body);

            integrationWindow = {
                document: mockDoc,
            };
        });
        // Since we only have access to one window, we will copy styles into a newly created document.
        it('should copy any valid style sheets over to the integrationWindow', () => {
            const style1 = document.createElement('link');
            style1.href = 'foo.com';
            const style2 = document.createElement('link');
            style2.href = 'bar.com';
            const style3 = document.createElement('link');

            const wrapper = getWrapper({ integrationWindow });
            const instance = wrapper.instance();
            instance.document = {
                styleSheets: [style1, style2, style3],
            };

            instance.copyStyles();
            const stylesheets = integrationWindow.document.querySelectorAll(
                'link',
            );
            expect(stylesheets.length).toEqual(2);
        });
        it('perform a margin/padding reset on the integration window', () => {
            const wrapper = getWrapper({ integrationWindow });
            const instance = wrapper.instance();
            instance.document = {
                styleSheets: [],
            };

            instance.copyStyles();

            expect(integrationWindow.document.body.style.margin).toEqual('0px');
            expect(integrationWindow.document.body.style.padding).toEqual(
                '0px',
            );
        });
    });

    it('should portal passed in children to the container element', () => {
        const containerElement = document.createElement('div');
        containerElement.id = INTEGRATION_CONTAINER_ID;

        const wrapper = getWrapper({
            integrationWindow: window,
            children: document.createElement('div'),
        });
        expect(wrapper).toMatchSnapshot();
    });
});
