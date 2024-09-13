import * as React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';

import DroppableContent, { DroppableContentProps } from '../DroppableContent';

describe('elements/content-uploader/DroppableContent', () => {
    const mockAddDataTransferItemsToUploadQueue = jest.fn();

    const renderComponent = (props: Partial<DroppableContentProps>) =>
        render(
            <DroppableContent
                addDataTransferItemsToUploadQueue={mockAddDataTransferItemsToUploadQueue}
                items={[]}
                {...props}
            />,
        );

    test('addDataTransferItemsToUploadQueue function is called after valid file is dropped', () => {
        renderComponent({ allowedTypes: ['png'], canDrop: true });
        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const mockDataTransfer = {
            files: [new File(['123'], 'example.png')],
            types: ['png'],
        };

        fireEvent.dragEnter(droppableElement, { dataTransfer: mockDataTransfer });
        fireEvent.drop(droppableElement, { dataTransfer: mockDataTransfer });
        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalledTimes(1);
    });

    test('addDataTransferItemsToUploadQueue function is not called after invalid file is dropped', () => {
        renderComponent({ allowedTypes: ['jpg'], canDrop: true });
        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const mockDataTransfer = {
            files: [new File(['123'], 'example.png')],
            types: ['png'],
        };

        fireEvent.dragEnter(droppableElement, { dataTransfer: mockDataTransfer });
        fireEvent.drop(droppableElement, { dataTransfer: mockDataTransfer });
        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalledTimes(0);
    });

    test('addDataTransferItemsToUploadQueue function is called after valid file is dropped and types are DOMStringList', () => {
        renderComponent({ allowedTypes: ['png'], canDrop: true });
        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const mockDOMStringList = {
            contains: jest.fn(strToSearch => strToSearch === 'png'),
            item: jest.fn(index => (index === 0 ? 'png' : null)),
            length: 1,
        };

        const mockDataTransfer = {
            files: [new File(['123'], 'example.png')],
            types: mockDOMStringList,
        };

        fireEvent.dragEnter(droppableElement, { dataTransfer: mockDataTransfer });
        fireEvent.drop(droppableElement, { dataTransfer: mockDataTransfer });
        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalledTimes(1);
    });

    test('addDataTransferItemsToUploadQueue function is not called after invalid file is dropped and types are DOMStringList', () => {
        renderComponent({ allowedTypes: ['jpg'], canDrop: true });
        const droppableElement = screen.getByTestId('bcu-droppable-content');
        expect(droppableElement).toBeInTheDocument();

        const mockDOMStringList = {
            contains: jest.fn(strToSearch => strToSearch === 'png'),
            item: jest.fn(index => (index === 0 ? 'png' : null)),
            length: 1,
        };

        const mockDataTransfer = {
            files: [new File(['123'], 'example.png')],
            types: mockDOMStringList,
        };

        fireEvent.dragEnter(droppableElement, { dataTransfer: mockDataTransfer });
        fireEvent.drop(droppableElement, { dataTransfer: mockDataTransfer });
        expect(mockAddDataTransferItemsToUploadQueue).toHaveBeenCalledTimes(0);
    });
});
