import * as React from 'react';
import { versionAwareRender } from '../dom-render';

// Create mock functions with implementations
const mockRender = jest.fn();
const mockUnmountComponentAtNode = jest.fn();
const mockRootRender = jest.fn();
const mockRootUnmount = jest.fn();
const mockCreateRoot = jest.fn(() => ({
    render: mockRootRender,
    unmount: mockRootUnmount,
}));

// Mock modules before importing the module under test
jest.mock('react-dom', () => ({
    __esModule: true,
    render: mockRender,
    unmountComponentAtNode: mockUnmountComponentAtNode,
}));

jest.mock('react-dom/client', () => ({
    __esModule: true,
    createRoot: mockCreateRoot,
}));

describe('dom-render', () => {
    const TestComponent = () => <div>Test Component</div>;
    const container = document.createElement('div');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRender.mockImplementation(() => undefined);
        mockUnmountComponentAtNode.mockImplementation(() => true);
        mockRootRender.mockImplementation(() => undefined);
        mockRootUnmount.mockImplementation(() => undefined);
        mockCreateRoot.mockImplementation(() => ({
            render: mockRootRender,
            unmount: mockRootUnmount,
        }));
    });

    describe('versionAwareRender', () => {
        test('should use createRoot when available (React 18+)', () => {
            mockCreateRoot.mockImplementation(() => ({
                render: mockRootRender,
                unmount: mockRootUnmount,
            }));

            const cleanup = versionAwareRender(<TestComponent />, container);

            expect(mockCreateRoot).toHaveBeenCalledWith(container);
            expect(mockRender).not.toHaveBeenCalled();
            expect(mockRootRender).toHaveBeenCalledWith(<TestComponent />);
            expect(mockRootUnmount).not.toHaveBeenCalled();

            cleanup();
            expect(mockRootUnmount).toHaveBeenCalled();
        });

        test('should fallback to render when createRoot is not available (React 17)', () => {
            // Simulate React 17 environment
            mockCreateRoot.mockImplementationOnce(() => {
                throw new Error('createRoot is not available');
            });

            const cleanup = versionAwareRender(<TestComponent />, container);

            expect(mockRender).toHaveBeenCalledWith(<TestComponent />, container);
            expect(mockCreateRoot).toHaveBeenCalledWith(container);
            expect(mockUnmountComponentAtNode).not.toHaveBeenCalled();

            cleanup();
            expect(mockUnmountComponentAtNode).toHaveBeenCalledWith(container);
        });

        test('should throw error when container is null', () => {
            expect(() => versionAwareRender(<TestComponent />, null)).toThrow('Container element is required');
        });

        test('should properly clean up React 18+ components', () => {
            const cleanup = versionAwareRender(<TestComponent />, container);
            cleanup();

            expect(mockRootUnmount).toHaveBeenCalled();
            expect(mockUnmountComponentAtNode).not.toHaveBeenCalled();
        });

        test('should properly clean up React 17 components', () => {
            mockCreateRoot.mockImplementationOnce(() => {
                throw new Error('createRoot is not available');
            });

            const cleanup = versionAwareRender(<TestComponent />, container);
            cleanup();

            expect(mockUnmountComponentAtNode).toHaveBeenCalledWith(expect.any(Element));
            expect(mockRootUnmount).not.toHaveBeenCalled();
        });
    });
});
