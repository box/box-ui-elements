import * as React from 'react';
import { render, screen, fireEvent, act } from '../../../test-utils/testing-library';

import DroppableContent, { DroppableContentProps } from '../DroppableContent';

describe('elements/content-uploader/DroppableContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const defaultProps: DroppableContentProps = {
        addDataTransferItemsToUploadQueue: jest.fn(),
        addFiles: jest.fn(),
        allowedTypes: ['Files', 'image/png'],
        canDrop: true,
        isFolderUploadEnabled: true,
        isOver: false,
        isTouch: false,
        items: [],
        onClick: jest.fn(),
        view: 'grid',
        className: '',
        'data-resin-target': 'uploaderdropzone',
    };

    const renderComponent = (props: Partial<DroppableContentProps>) => {
        const mergedProps = {
            ...defaultProps,
            ...props,
        };
        return render(<DroppableContent {...mergedProps} />);
    };

    test('addDataTransferItemsToUploadQueue function is called after valid file is dropped', async () => {
        const mockAddDataTransferItemsToUploadQueue = jest.fn();
        const testProps = {
            ...defaultProps,
            addDataTransferItemsToUploadQueue: mockAddDataTransferItemsToUploadQueue,
            allowedTypes: ['Files'],
            canDrop: true,
            isFolderUploadEnabled: true,
        };

        renderComponent(testProps);

        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const file = new File(['123'], 'example.png', { type: 'image/png' });

        const mockDataTransfer = {
            files: [file],
            items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
            types: ['Files'],
            effectAllowed: 'all',
            dropEffect: 'copy',
            setData: jest.fn(),
            getData: jest.fn(),
            clearData: jest.fn(),
        } as unknown as DataTransfer;
        // Mock DataTransfer created

        const mockEvent = {
            dataTransfer: mockDataTransfer,
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };

        // Simulate complete drag and drop sequence
        await act(async () => {
            // First trigger dragenter
            fireEvent.dragEnter(droppableElement, mockEvent);
            await new Promise(resolve => setTimeout(resolve, 50));

            // Then dragover to maintain drag state
            fireEvent.dragOver(droppableElement, mockEvent);
            await new Promise(resolve => setTimeout(resolve, 50));

            // Finally drop
            fireEvent.drop(droppableElement, mockEvent);
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalled();
        const actualCall = mockAddDataTransferItemsToUploadQueue.mock.calls[0][0];
        expect(actualCall.files).toEqual(mockDataTransfer.files);
        expect(actualCall.items).toEqual(mockDataTransfer.items);
        expect(actualCall.types).toEqual(mockDataTransfer.types);
    });

    test('addDataTransferItemsToUploadQueue function is not called after invalid file is dropped', async () => {
        const mockAddDataTransferItemsToUploadQueue = jest.fn();
        renderComponent({
            ...defaultProps,
            addDataTransferItemsToUploadQueue: mockAddDataTransferItemsToUploadQueue,
            allowedTypes: ['jpg'],
            canDrop: true,
        });

        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const mockDataTransfer = {
            files: [new File(['123'], 'example.png', { type: 'image/png' })],
            items: [
                {
                    kind: 'file',
                    type: 'image/png',
                    getAsFile: () => new File(['123'], 'example.png', { type: 'image/png' }),
                },
            ],
            types: ['Files', 'image/png'],
            effectAllowed: 'all',
            dropEffect: 'copy',
            setData: jest.fn(),
            getData: jest.fn(),
            clearData: jest.fn(),
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        } as unknown as DataTransfer;

        await act(async () => {
            fireEvent.dragEnter(droppableElement, {
                dataTransfer: mockDataTransfer,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            });
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        await act(async () => {
            fireEvent.dragOver(droppableElement, {
                dataTransfer: mockDataTransfer,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            });
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        await act(async () => {
            fireEvent.drop(droppableElement, {
                dataTransfer: mockDataTransfer,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            });
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalledTimes(0);
    });

    test('addDataTransferItemsToUploadQueue function is called after valid file is dropped and types are DOMStringList', async () => {
        const mockAddDataTransferItemsToUploadQueue = jest.fn();
        const testProps = {
            ...defaultProps,
            addDataTransferItemsToUploadQueue: mockAddDataTransferItemsToUploadQueue,
            allowedTypes: ['Files'],
            canDrop: true,
        };
        renderComponent(testProps);

        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const file = new File(['123'], 'example.png', { type: 'image/png' });
        const mockDOMStringList = {
            contains: jest.fn(strToSearch => strToSearch === 'Files'),
            item: jest.fn(index => (index === 0 ? 'Files' : null)),
            length: 1,
            *[Symbol.iterator]() {
                yield 'Files';
            },
        } as unknown as DOMStringList;

        const mockDataTransfer = {
            files: [file],
            items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
            types: mockDOMStringList,
            effectAllowed: 'all',
            dropEffect: 'copy',
            setData: jest.fn(),
            getData: jest.fn(),
            clearData: jest.fn(),
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        } as unknown as DataTransfer;

        // Simulate complete drag and drop sequence
        await act(async () => {
            // First trigger dragenter
            fireEvent.dragEnter(droppableElement, {
                dataTransfer: mockDataTransfer,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(droppableElement).toHaveAttribute('data-isover', 'true');
            expect(droppableElement).toHaveAttribute('data-candrop', 'true');

            // Then dragover
            fireEvent.dragOver(droppableElement, {
                dataTransfer: mockDataTransfer,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(droppableElement).toHaveAttribute('data-isover', 'true');
            expect(droppableElement).toHaveAttribute('data-candrop', 'true');

            // Finally drop
            fireEvent.drop(droppableElement, {
                dataTransfer: mockDataTransfer,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(droppableElement).toHaveAttribute('data-isover', 'false');
            expect(droppableElement).toHaveAttribute('data-candrop', 'false');
        });

        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalled();
        const actualCall = mockAddDataTransferItemsToUploadQueue.mock.calls[0][0];
        expect(actualCall.files).toEqual(mockDataTransfer.files);
        expect(actualCall.items).toEqual(mockDataTransfer.items);
        expect(actualCall.types).toBe(mockDataTransfer.types);
    });

    test('addDataTransferItemsToUploadQueue function is not called after invalid file is dropped and types are DOMStringList', async () => {
        const mockAddDataTransferItemsToUploadQueue = jest.fn();
        renderComponent({
            ...defaultProps,
            addDataTransferItemsToUploadQueue: mockAddDataTransferItemsToUploadQueue,
            allowedTypes: ['jpg'],
            canDrop: true,
        });
        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const mockDOMStringList = {
            contains: jest.fn(strToSearch => strToSearch === 'png'),
            item: jest.fn(index => (index === 0 ? 'png' : null)),
            length: 1,
            *[Symbol.iterator]() {
                yield 'png';
            },
        } as unknown as DOMStringList;

        const mockDataTransfer = {
            files: [new File(['123'], 'example.png')],
            types: mockDOMStringList,
            effectAllowed: 'none',
            dropEffect: 'none',
            setData: jest.fn(),
            getData: jest.fn(),
            clearData: jest.fn(),
        } as unknown as DataTransfer;

        // Test complete drag and drop sequence
        await act(async () => {
            fireEvent.dragEnter(droppableElement, { dataTransfer: mockDataTransfer });
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(droppableElement).toHaveAttribute('data-isover', 'true');
            expect(droppableElement).toHaveAttribute('data-candrop', 'false');

            fireEvent.dragOver(droppableElement, { dataTransfer: mockDataTransfer });
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(droppableElement).toHaveAttribute('data-isover', 'true');
            expect(droppableElement).toHaveAttribute('data-candrop', 'false');

            fireEvent.drop(droppableElement, { dataTransfer: mockDataTransfer });
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(droppableElement).toHaveAttribute('data-isover', 'false');
            expect(droppableElement).toHaveAttribute('data-candrop', 'false');
        });
        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalledTimes(0);
    });
});
