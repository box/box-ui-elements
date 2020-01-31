import React from 'react';
import { shallow } from 'enzyme';
import IntegrationPortal, * as integrationPortal from '../IntegrationPortal';

describe('elements/content-open-with/IntegrationPortal', () => {
    const getWrapper = props => shallow(<IntegrationPortal {...props} />);

    describe('copyStyles()', () => {
        let integrationWindow;

        beforeEach(() => {
            const mockDoc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html');
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

            const mockDocumentElement = {
                styleSheets: [style1, style2, style3],
            };

            integrationPortal.copyStyles(mockDocumentElement, integrationWindow);
            const stylesheets = integrationWindow.document.querySelectorAll('link');
            expect(stylesheets.length).toEqual(2);
        });
        it('perform a margin/padding reset on the integration window', () => {
            const mockDocumentElement = {
                styleSheets: [],
            };

            integrationPortal.copyStyles(mockDocumentElement, integrationWindow);

            expect(integrationWindow.document.body.style.margin).toEqual('0px');
            expect(integrationWindow.document.body.style.padding).toEqual('0px');
        });
    });

    describe('IntegrationPortal()', () => {
        beforeEach(() => {
            integrationPortal.copyStyles = jest.fn();
        });

        it('should append the portal container div to the integration window', () => {
            getWrapper({
                integrationWindow: window,
                children: document.createElement('div'),
            });

            expect(document.querySelector('div')).toBeTruthy();
        });

        it('should portal passed in children to the container element', () => {
            const wrapper = getWrapper({
                integrationWindow: window,
                children: document.createElement('div'),
            });
            expect(wrapper).toMatchSnapshot();
        });
    });
});
