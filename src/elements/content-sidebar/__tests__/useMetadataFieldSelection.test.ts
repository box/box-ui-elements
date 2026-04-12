import { type MetadataTemplateField } from '@box/metadata-editor';
import { act, renderHook } from '../../../test-utils/testing-library';
import useMetadataFieldSelection from '../hooks/useMetadataFieldSelection';

const mockTargetLocation = [
    {
        itemId: 'item-1',
        page: 0,
        text: 'test text',
        boundingBox: { left: 0.1, top: 0.2, right: 0.5, bottom: 0.6 },
    },
];

const createMockField = (overrides: Partial<MetadataTemplateField> = {}): MetadataTemplateField => ({
    id: 'field-1',
    key: 'testField',
    type: 'string',
    displayName: 'Test Field',
    hidden: false,
    ...overrides,
});

describe('useMetadataFieldSelection', () => {
    const mockShowBoundingBoxHighlights = jest.fn();
    const mockHideBoundingBoxHighlights = jest.fn();

    const getPreview = jest.fn().mockReturnValue({
        showBoundingBoxHighlights: mockShowBoundingBoxHighlights,
        hideBoundingBoxHighlights: mockHideBoundingBoxHighlights,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with null selectedMetadataFieldId', () => {
        const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

        expect(result.current.selectedMetadataFieldId).toBeNull();
    });

    test('should set selectedMetadataFieldId when handleSelectMetadataField is called with valid field', () => {
        const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

        act(() => {
            result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
        });

        expect(result.current.selectedMetadataFieldId).toBe('field-1');
    });

    test('should call showBoundingBoxHighlights when field has targetLocation', () => {
        const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

        act(() => {
            result.current.handleSelectMetadataField(
                createMockField({
                    targetLocation: [
                        {
                            itemId: 'item-1',
                            page: 0,
                            text: 'test text',
                            boundingBox: { left: 0.1, top: 0.2, right: 0.5, bottom: 0.6 },
                        },
                    ],
                }),
            );
        });

        expect(mockShowBoundingBoxHighlights).toHaveBeenCalledWith([
            {
                id: 'bbox-field-1-1',
                x: 9.75,
                y: 19.75,
                width: 40.5,
                height: 40.5,
                pageNumber: 1,
            },
        ]);
    });

    test('should deselect and hide highlights when field has no targetLocation', () => {
        const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

        act(() => {
            result.current.handleSelectMetadataField(createMockField());
        });

        expect(result.current.selectedMetadataFieldId).toBeNull();
        expect(mockShowBoundingBoxHighlights).not.toHaveBeenCalled();
        expect(mockHideBoundingBoxHighlights).toHaveBeenCalled();
    });

    test('should deselect field and hide highlights when handleSelectMetadataField is called with null', () => {
        const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

        act(() => {
            result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
        });

        expect(result.current.selectedMetadataFieldId).toBe('field-1');

        act(() => {
            result.current.handleSelectMetadataField(null);
        });

        expect(result.current.selectedMetadataFieldId).toBeNull();
        expect(mockHideBoundingBoxHighlights).toHaveBeenCalled();
    });

    test('should deselect field when handleSelectMetadataField is called with field without id', () => {
        const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

        act(() => {
            result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
        });

        act(() => {
            result.current.handleSelectMetadataField(
                createMockField({ id: undefined, key: 'noIdField', displayName: 'No ID Field' }),
            );
        });

        expect(result.current.selectedMetadataFieldId).toBeNull();
        expect(mockHideBoundingBoxHighlights).toHaveBeenCalled();
    });

    test('should not select field or crash when getPreview returns null', () => {
        const getPreviewReturningNull = jest.fn().mockReturnValue(null);
        const { result } = renderHook(() => useMetadataFieldSelection(getPreviewReturningNull));

        act(() => {
            result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
        });

        expect(result.current.selectedMetadataFieldId).toBeNull();
        expect(mockShowBoundingBoxHighlights).not.toHaveBeenCalled();
    });

    describe('click outside behavior', () => {
        test('should deselect when clicking outside metadata field and bounding box elements', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
            });

            expect(result.current.selectedMetadataFieldId).toBe('field-1');

            act(() => {
                const event = new MouseEvent('mousedown', { bubbles: true });
                document.dispatchEvent(event);
            });

            expect(result.current.selectedMetadataFieldId).toBeNull();
            expect(mockHideBoundingBoxHighlights).toHaveBeenCalled();
        });

        test('should not deselect when clicking on a metadata field element', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
            });

            const metadataFieldElement = document.createElement('div');
            metadataFieldElement.setAttribute('data-metadata-field', 'true');
            document.body.appendChild(metadataFieldElement);

            act(() => {
                const event = new MouseEvent('mousedown', { bubbles: true });
                metadataFieldElement.dispatchEvent(event);
            });

            expect(result.current.selectedMetadataFieldId).toBe('field-1');

            document.body.removeChild(metadataFieldElement);
        });

        test('should not deselect when clicking on a bounding box highlight element', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
            });

            const boundingBoxElement = document.createElement('div');
            boundingBoxElement.classList.add('ba-BoundingBoxHighlightRect');
            document.body.appendChild(boundingBoxElement);

            act(() => {
                const event = new MouseEvent('mousedown', { bubbles: true });
                boundingBoxElement.dispatchEvent(event);
            });

            expect(result.current.selectedMetadataFieldId).toBe('field-1');

            document.body.removeChild(boundingBoxElement);
        });

        test('should not add listener when no field is selected', () => {
            const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

            renderHook(() => useMetadataFieldSelection(getPreview));

            expect(addEventListenerSpy).not.toHaveBeenCalledWith('mousedown', expect.any(Function));

            addEventListenerSpy.mockRestore();
        });

        test('should remove listener on cleanup', () => {
            const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
            const { result, unmount } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(createMockField({ targetLocation: mockTargetLocation }));
            });

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

            removeEventListenerSpy.mockRestore();
        });
    });

    describe('convertTargetLocationToBoundingBox', () => {
        test('should convert multiple target locations with correct page numbers', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(
                    createMockField({
                        targetLocation: [
                            {
                                itemId: 'item-1',
                                page: 0,
                                text: 'first',
                                boundingBox: { left: 0.1, top: 0.2, right: 0.5, bottom: 0.6 },
                            },
                            {
                                itemId: 'item-2',
                                page: 2,
                                text: 'second',
                                boundingBox: { left: 0.3, top: 0.4, right: 0.7, bottom: 0.8 },
                            },
                        ],
                    }),
                );
            });

            expect(mockShowBoundingBoxHighlights).toHaveBeenCalledWith([
                { id: 'bbox-field-1-1', x: 9.75, y: 19.75, width: 40.5, height: 40.5, pageNumber: 1 },
                { id: 'bbox-field-1-2', x: 29.75, y: 39.75, width: 40.5, height: 40.5, pageNumber: 3 },
            ]);
        });

        test('should deselect and hide highlights when targetLocation is empty array', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(createMockField({ targetLocation: [] }));
            });

            expect(result.current.selectedMetadataFieldId).toBeNull();
            expect(mockShowBoundingBoxHighlights).not.toHaveBeenCalled();
            expect(mockHideBoundingBoxHighlights).toHaveBeenCalled();
        });

        test('should filter out target location entries without boundingBox', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(
                    createMockField({
                        targetLocation: [
                            {
                                itemId: 'item-1',
                                page: 0,
                                text: 'first',
                                boundingBox: { left: 0.1, top: 0.2, right: 0.5, bottom: 0.6 },
                            },
                            {
                                itemId: 'item-2',
                                page: 1,
                                text: 'second',
                            },
                        ],
                    }),
                );
            });

            expect(mockShowBoundingBoxHighlights).toHaveBeenCalledWith([
                { id: 'bbox-field-1-1', x: 9.75, y: 19.75, width: 40.5, height: 40.5, pageNumber: 1 },
            ]);
        });

        test('should deselect when all target location entries lack boundingBox', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(
                    createMockField({
                        targetLocation: [
                            { itemId: 'item-1', page: 0, text: 'first' },
                            { itemId: 'item-2', page: 1, text: 'second' },
                        ],
                    }),
                );
            });

            expect(result.current.selectedMetadataFieldId).toBeNull();
            expect(mockShowBoundingBoxHighlights).not.toHaveBeenCalled();
            expect(mockHideBoundingBoxHighlights).toHaveBeenCalled();
        });

        test('should clamp bounding box values to valid percentage range', () => {
            const { result } = renderHook(() => useMetadataFieldSelection(getPreview));

            act(() => {
                result.current.handleSelectMetadataField(
                    createMockField({
                        targetLocation: [
                            {
                                itemId: 'item-1',
                                page: 0,
                                text: 'test',
                                boundingBox: { left: 0, top: 0, right: 1.5, bottom: 1.5 },
                            },
                        ],
                    }),
                );
            });

            expect(mockShowBoundingBoxHighlights).toHaveBeenCalledWith([
                {
                    id: 'bbox-field-1-1',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    pageNumber: 1,
                },
            ]);
        });
    });
});
