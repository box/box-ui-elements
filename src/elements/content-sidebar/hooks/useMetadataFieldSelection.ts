import { useCallback, useState, useEffect } from 'react';
import { type MetadataTemplateField, type MetadataTargetLocationEntry } from '@box/metadata-editor';
import clampPercentage from '../utils/clampPercentage';

import type { BoxAnnotationsBoundingBox, GetPreviewForMetadataReturnType } from '../types/BoxAISidebarTypes';

function convertTargetLocationToBoundingBox(
    id: string,
    targetLocationEntries?: MetadataTargetLocationEntry[],
): BoxAnnotationsBoundingBox[] | undefined {
    if (!targetLocationEntries || targetLocationEntries.length === 0) {
        return undefined;
    }

    // Adding extra space (-0.25 for left and top, +0.5 for width and height) to provide paddings for bounding boxes
    return targetLocationEntries.map((item: MetadataTargetLocationEntry, index: number) => ({
        id: `bbox-${id}-${index + 1}`,
        x: clampPercentage(item.boundingBox.left * 100 - 0.25),
        y: clampPercentage(item.boundingBox.top * 100 - 0.25),
        width: clampPercentage((item.boundingBox.right - item.boundingBox.left) * 100 + 0.5),
        height: clampPercentage((item.boundingBox.bottom - item.boundingBox.top) * 100 + 0.5),
        pageNumber: item.page + 1,
    }));
}

const METADATA_FIELD_SELECTOR = '[data-metadata-field]';
const BOUNDING_BOX_SELECTOR = '.ba-BoundingBoxHighlightRect';

function useMetadataFieldSelection(getPreview: () => GetPreviewForMetadataReturnType) {
    const [selectedMetadataFieldId, setSelectedMetadataFieldId] = useState<string | null>(null);

    const handleDeselectMetadataField = useCallback(() => {
        setSelectedMetadataFieldId(null);
        const preview = getPreview();
        if (!preview) {
            return;
        }

        preview.hideBoundingBoxHighlights?.();
    }, [getPreview]);

    useEffect(() => {
        if (!selectedMetadataFieldId) {
            return undefined;
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const clickedOnAllowedElement =
                target?.closest?.(METADATA_FIELD_SELECTOR) || target?.closest?.(BOUNDING_BOX_SELECTOR);

            if (!clickedOnAllowedElement) {
                handleDeselectMetadataField();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedMetadataFieldId, handleDeselectMetadataField]);

    const handleSelectMetadataField = useCallback(
        (field: MetadataTemplateField | null) => {
            const preview = getPreview();
            if (!preview || !preview.showBoundingBoxHighlights) {
                return;
            }

            if (!field || !field.id) {
                handleDeselectMetadataField();
                return;
            }

            const boundingBoxes = convertTargetLocationToBoundingBox(field.id, field.targetLocation);

            if (!boundingBoxes) {
                handleDeselectMetadataField();
                return;
            }

            setSelectedMetadataFieldId(field.id);
            preview.showBoundingBoxHighlights(boundingBoxes);
        },
        [getPreview, handleDeselectMetadataField],
    );

    return { selectedMetadataFieldId, handleSelectMetadataField };
}

export default useMetadataFieldSelection;
