import * as React from 'react';

import ItemList from './ItemList';
import UploadState from './UploadState';

import makeDroppable from '../common/droppable';
import type { UploadFile, UploadFileWithAPIOptions, UploadItem } from '../../common/types/upload';
import type { View } from '../../common/types/core';

import './DroppableContent.scss';

export interface DroppableContentProps extends React.HTMLAttributes<HTMLDivElement> {
    addDataTransferItemsToUploadQueue: (droppedItems: DataTransfer) => void;
    addFiles: (files?: Array<UploadFileWithAPIOptions | UploadFile>) => void;
    allowedTypes: Array<string>;
    canDrop?: boolean;
    isFolderUploadEnabled?: boolean;
    isOver?: boolean;
    isTouch?: boolean;
    items?: UploadItem[];
    onClick?: (item: UploadItem) => void;
    view?: View;
    'data-resin-target'?: string;
}

/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator: (
        props: { allowedTypes: Array<string>; canDrop?: boolean; event?: DragEvent },
        dataTransfer: DataTransfer,
    ): boolean => {
        // Validation logging in development only
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('\n=== dropValidator START ===');
            // eslint-disable-next-line no-console
            console.log('Props:', props);
            // eslint-disable-next-line no-console
            console.log('DataTransfer:', {
                types: Array.from(dataTransfer?.types || []),
                files: Array.from(dataTransfer?.files || []),
                items: Array.from(dataTransfer?.items || []),
                effectAllowed: dataTransfer?.effectAllowed,
            });
        }

        // Always allow validation during drag sequence
        const { allowedTypes } = props;

        // Early validation check for dataTransfer
        if (!dataTransfer) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.debug('Early validation failed: no dataTransfer');
            }
            return false;
        }

        // Allow validation during drag sequence
        const isDragEvent = props.event?.type === 'dragenter' || props.event?.type === 'dragover';
        if (!isDragEvent && props.canDrop === false) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.debug('Early validation failed: canDrop is false');
            }
            return false;
        }

        // Helper function to check if types contains 'Files'
        const hasFilesType = (types: readonly string[] | DOMStringList): boolean => {
            if (!types) return false;

            if (Array.isArray(types)) {
                return types.includes('Files');
            }

            // Check if it's a DOMStringList
            if (typeof types === 'object' && 'contains' in types && typeof types.contains === 'function') {
                try {
                    return types.contains('Files');
                } catch (e) {
                    // Handle potential errors with DOMStringList
                    if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.debug('DOMStringList error:', e);
                    }
                    // Try iterating over types if contains fails
                    try {
                        return Array.from(types).includes('Files');
                    } catch (e2) {
                        // If both methods fail, log and return false
                        if (process.env.NODE_ENV === 'development') {
                            // eslint-disable-next-line no-console
                            console.debug('DOMStringList iteration error:', e2);
                        }
                        return false;
                    }
                }
            }

            return false;
        };

        // Helper function to check specific file types
        const checkFileType = (type: string): boolean => {
            if (!type) return false;

            // If we accept all files, Files is in allowedTypes, or allowedTypes is empty, any file type is valid
            if (allowedTypes.includes('Files') || allowedTypes.includes('*/*') || allowedTypes.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('Accepting all files');
                }
                return true;
            }

            // Check for specific type matches
            const isValid = allowedTypes.some(allowedType => {
                // Exact match
                if (type === allowedType) return true;
                // MIME type match (e.g., 'image/*' matches 'image/png')
                if (allowedType.endsWith('/*')) {
                    const prefix = allowedType.slice(0, -2);
                    return type.startsWith(prefix);
                }
                return false;
            });

            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Type validation:', { type, allowedTypes, isValid });
            }
            return isValid;
        };

        try {
            // First check if we have files at all
            const hasFiles = !!(
                hasFilesType(dataTransfer.types) ||
                (dataTransfer.files && dataTransfer.files.length > 0) ||
                (dataTransfer.items && Array.from(dataTransfer.items).some(item => item.kind === 'file'))
            );

            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Files check:', {
                    hasFiles,
                    typesCheck: hasFilesType(dataTransfer.types),
                    filesCheck: !!(dataTransfer.files && dataTransfer.files.length > 0),
                    itemsCheck: !!(
                        dataTransfer.items && Array.from(dataTransfer.items).some(item => item.kind === 'file')
                    ),
                });
            }

            if (!hasFiles) {
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('=== dropValidator END === (no files)');
                }
                return false;
            }

            // If we accept all files, Files is in allowedTypes, or allowedTypes is empty, we're done
            if (allowedTypes.includes('Files') || allowedTypes.includes('*/*') || allowedTypes.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('=== dropValidator END === (accepting all files)');
                }
                return true;
            }

            // Check files array first
            if (dataTransfer.files?.length > 0) {
                const filesValid = Array.from(dataTransfer.files).some(file => {
                    const result = checkFileType(file.type || 'application/octet-stream');
                    if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.log('Checking file:', {
                            name: file.name,
                            type: file.type || 'application/octet-stream',
                            isValid: result,
                        });
                    }
                    return result;
                });
                if (filesValid) {
                    if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.log('=== dropValidator END === (valid files)');
                    }
                    return true;
                }
            }

            // Then check items array
            if (dataTransfer.items?.length > 0) {
                const itemsValid = Array.from(dataTransfer.items).some(item => {
                    if (item.kind !== 'file') return false;
                    const result = checkFileType(item.type || 'application/octet-stream');
                    if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.log('Checking item:', {
                            kind: item.kind,
                            type: item.type || 'application/octet-stream',
                            isValid: result,
                        });
                    }
                    return result;
                });
                if (itemsValid) {
                    if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.log('=== dropValidator END === (valid items)');
                    }
                    return true;
                }
            }

            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('=== dropValidator END === (no valid files)');
            }
            return false;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('=== dropValidator ERROR ===', e);
            return false;
        }
    },

    /**
     * Determines what happens after a file is dropped
     */
    onDrop: (event: DragEvent, props: DroppableContentProps) => {
        event.preventDefault();
        event.stopPropagation();

        const { addDataTransferItemsToUploadQueue } = props;
        const { dataTransfer } = event;

        if (!dataTransfer || !addDataTransferItemsToUploadQueue) {
            return;
        }

        // The HOC has already validated the drop through dropValidator
        // and will only call onDrop if validation passed
        addDataTransferItemsToUploadQueue(dataTransfer);
    },
} as const;

const DroppableContent = makeDroppable(dropDefinition)(
    React.forwardRef<HTMLDivElement, DroppableContentProps>((props, ref) => {
        const {
            addFiles,
            canDrop = false,
            isFolderUploadEnabled = false,
            isOver = false,
            isTouch = false,
            items: rawItems,
            onClick = () => {},
            view = 'grid',
        } = props;

        // Ensure items is always an array
        const items = Array.isArray(rawItems) ? rawItems : [];

        const handleSelectFiles = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
            if (files) {
                addFiles(Array.from(files));
            }
        };
        const hasItems = items.length > 0;
        const safeItems = Array.isArray(items) ? items : [];

        return (
            <div ref={ref} className="bcu-droppable-content" data-testid="bcu-droppable-content">
                <ItemList items={safeItems} onClick={onClick} />
                <UploadState
                    canDrop={canDrop}
                    hasItems={hasItems}
                    isFolderUploadEnabled={isFolderUploadEnabled}
                    isOver={isOver}
                    isTouch={isTouch}
                    onSelect={handleSelectFiles}
                    view={view}
                />
            </div>
        );
    }),
);

export default DroppableContent;
