import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

import { renderElement, unmountElement } from '../react-root-utils';

// Mock react-dom and react-dom/client modules
jest.mock('react-dom', () => ({
    render: jest.fn(),
    unmountComponentAtNode: jest.fn(),
}));

jest.mock('react-dom/client', () => ({
    createRoot: jest.fn(),
}));

describe('utils/react-root-utils', () => {
    const TestComponent = () => <div>Test</div>;
    let container;
    let mockRoot;
    let createRootSpy;
    let renderSpy;
    let unmountComponentAtNodeSpy;
    beforeEach(() => {
        // Reset modules and clear mocks
        jest.clearAllMocks();

        // Set up DOM
        container = document.createElement('div');
        document.body.appendChild(container);

        // Create fresh mock root
        mockRoot = {
            render: jest.fn(),
            unmount: jest.fn(),
        };

        // Set up mocks with proper spies
        createRootSpy = jest.spyOn(ReactDOMClient, 'createRoot').mockImplementation(() => mockRoot);
        renderSpy = jest.spyOn(ReactDOM, 'render');
        unmountComponentAtNodeSpy = jest.spyOn(ReactDOM, 'unmountComponentAtNode');
    });

    afterEach(() => {
        // Clean up DOM
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        // Reset container
        container = null;
    });

    describe('renderElement', () => {
        test('should use createRoot when available', () => {
            const element = <TestComponent />;
            renderElement(element, container);

            expect(createRootSpy).toHaveBeenCalledWith(container);
            expect(mockRoot.render).toHaveBeenCalledWith(element);
        });

        test('should fall back to legacy render when createRoot is not available', () => {
            // Mock createRoot to throw error to simulate React 17
            jest.spyOn(ReactDOMClient, 'createRoot').mockImplementationOnce(() => {
                throw new Error('createRoot is not available');
            });

            const element = <TestComponent />;
            renderElement(element, container);

            expect(renderSpy).toHaveBeenCalledWith(element, container);
        });

        test('should reuse existing root for container', () => {
            const element1 = <TestComponent key={1} />;
            const element2 = <TestComponent key={2} />;

            renderElement(element1, container);
            renderElement(element2, container);

            expect(createRootSpy).toHaveBeenCalledTimes(1);
            expect(mockRoot.render).toHaveBeenCalledTimes(2);
            expect(mockRoot.render).toHaveBeenLastCalledWith(element2);
        });
    });

    describe('unmountElement', () => {
        test('should use root.unmount when root exists', () => {
            renderElement(<TestComponent />, container);
            unmountElement(container);

            expect(mockRoot.unmount).toHaveBeenCalled();
        });

        test('should not create root when unmounting without existing root', () => {
            unmountElement(container);

            expect(createRootSpy).not.toHaveBeenCalled();
            expect(mockRoot.unmount).not.toHaveBeenCalled();
        });

        test('should fall back to unmountComponentAtNode when createRoot not available', () => {
            // Mock createRoot to throw error to simulate React 17
            jest.spyOn(ReactDOMClient, 'createRoot').mockImplementationOnce(() => {
                throw new Error('createRoot is not available');
            });

            unmountElement(container);

            expect(unmountComponentAtNodeSpy).toHaveBeenCalledWith(container);
        });
    });
});
