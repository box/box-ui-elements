
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const ItemList_1 = require('./ItemList');
const UploadState_1 = require('./UploadState');
const droppable_1 = require('../common/droppable');
require('./DroppableContent.scss');
/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator (props, dataTransfer) {
        let _a; let _b; let _c; let _d;
        // Validation logging in development only
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('\n=== dropValidator START ===');
            // eslint-disable-next-line no-console
            console.log('Props:', props);
            // eslint-disable-next-line no-console
            console.log('DataTransfer:', {
                types: Array.from(
                    (dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.types) || [],
                ),
                files: Array.from(
                    (dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.files) || [],
                ),
                items: Array.from(
                    (dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.items) || [],
                ),
                effectAllowed: dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.effectAllowed,
            });
        }
        // Always allow validation during drag sequence
        const {allowedTypes} = props;
        // Early validation check for dataTransfer
        if (!dataTransfer) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Early validation failed: no dataTransfer');
            }
            return false;
        }
        // Allow validation during drag sequence regardless of canDrop
        if (
            ((_a = props.event) === null || _a === void 0 ? void 0 : _a.type) === 'dragenter' ||
            ((_b = props.event) === null || _b === void 0 ? void 0 : _b.type) === 'dragover'
        ) {
            // Skip canDrop check during drag sequence
        } else if (props.canDrop === false) {
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Early validation failed: canDrop is false');
            }
            return false;
        }
        // Helper function to check if types contains 'Files'
        const hasFilesType = function (types) {
            if (!types) return false;
            if (Array.isArray(types)) {
                return types.includes('Files');
            }
            // Check if it's a DOMStringList
            if (typeof types === 'object' && 'contains' in types && typeof types.contains === 'function') {
                return types.contains('Files');
            }
            return false;
        };
        // Helper function to check specific file types
        const checkFileType = function (type) {
            if (!type) return false;
            // If we accept all files or Files is in allowedTypes, any file type is valid
            if (allowedTypes.includes('Files') || allowedTypes.includes('*/*')) {
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('Accepting all files');
                }
                return true;
            }
            // Check for specific type matches
            const isValid = allowedTypes.some((allowedType) => {
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
                (dataTransfer.items &&
                    Array.from(dataTransfer.items).some((item) => {
                        return item.kind === 'file';
                    }))
            );
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Files check:', {
                    hasFiles,
                    typesCheck: hasFilesType(dataTransfer.types),
                    filesCheck: !!(dataTransfer.files && dataTransfer.files.length > 0),
                    itemsCheck: !!(
                        dataTransfer.items &&
                        Array.from(dataTransfer.items).some((item) => {
                            return item.kind === 'file';
                        })
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
            // If we accept all files, we're done
            if (allowedTypes.includes('Files')) {
                if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('=== dropValidator END === (accepting all files)');
                }
                return true;
            }
            // Check files array first
            if (((_c = dataTransfer.files) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                const filesValid = Array.from(dataTransfer.files).some((file) => {
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
            if (((_d = dataTransfer.items) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                const itemsValid = Array.from(dataTransfer.items).some((item) => {
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
    onDrop (event, props) {
        event.preventDefault();
        event.stopPropagation();
        const {addDataTransferItemsToUploadQueue} = props;
        const {dataTransfer} = event;
        if (!dataTransfer || !addDataTransferItemsToUploadQueue) {
            return;
        }
        // The HOC has already validated the drop through dropValidator
        // and will only call onDrop if validation passed
        addDataTransferItemsToUploadQueue(dataTransfer);
    },
};
const DroppableContent = (0, droppable_1.default)(dropDefinition)(
    React.forwardRef((_a, ref) => {
        const {addFiles} = _a;
            const {canDrop} = _a;
            const {isFolderUploadEnabled} = _a;
            const {isOver} = _a;
            const {isTouch} = _a;
            const {items} = _a;
            const {onClick} = _a;
            const {view} = _a;
        const handleSelectFiles = function (_a) {
            const {files} = _a.target;
            if (files) {
                addFiles(Array.from(files));
            }
        };
        const hasItems = items.length > 0;
        return (
            <div ref={ref} className="bcu-droppable-content" data-testid="bcu-droppable-content">
                <ItemList_1.default items={items} onClick={onClick} />
                <UploadState_1.default
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
exports.default = DroppableContent;
