/**
 * @flow
 * @file Droppable area containing upload item list
 */

import React from 'react';
import classNames from 'classnames';
import makeDroppable from '../common/droppable';
import ItemList from './ItemList';
import UploadStateV2 from './UploadStateV2';
import messages from '../common/messages';
import IconRemove from '../../icons/general/IconRemove';
import { STATUS_PENDING } from '../../constants';

import './DroppableContent.scss';
import './DroppableContentV2.scss';

type Props = {
    addDataTransferItemsToUploadQueue: Function,
    addFiles: Function,
    canDrop: boolean,
    isDisabled: boolean,
    isFolderUploadEnabled: boolean,
    isOver: boolean,
    isTouch: boolean,
    items: UploadItem[],
    onClick: Function,
    view: View,
};

/**
 * Definition for drag and drop behavior.
 */
const dropDefinition = {
    /**
     * Validates whether a file can be dropped or not.
     */
    dropValidator: (
        { allowedTypes, isDisabled }: { allowedTypes: Array<string>, isDisabled: boolean },
        { types }: { types: Array<string> },
    ) => !isDisabled && Array.from(types).some(type => allowedTypes.indexOf(type) > -1),

    /**
     * Determines what happens after a file is dropped
     */
    onDrop: (event, { addDataTransferItemsToUploadQueue }: Props) => {
        const {
            dataTransfer: { items },
        } = event;

        addDataTransferItemsToUploadQueue(items);
    },
};

const DroppableContentV2 = makeDroppable(dropDefinition)(
    ({ canDrop, isOver, isTouch, isDisabled, view, items, addFiles, onClick, isFolderUploadEnabled }: Props) => {
        const handleSelectFiles = ({ target: { files } }: any) => addFiles(files);
        const hasItems = items.length > 0;
        const overrideSettings = {
            [STATUS_PENDING]: {
                icon: <IconRemove />,
                tooltip: messages.remove,
            },
        };

        const className = classNames('bcu-droppable-content-container', {
            'bcu-droppable-content-has-items': hasItems,
            'bcu-droppable-content-is-over': isOver,
            'bcu-droppable-content-is-disabled': isDisabled,
        });

        return (
            <>
                <div className={className}>
                    <div className="bcu-droppable-content">
                        <ItemList items={items} onClick={onClick} view={view} overrideSettings={overrideSettings} />
                        <UploadStateV2
                            canDrop={canDrop}
                            hasItems={hasItems}
                            isFolderUploadEnabled={isFolderUploadEnabled}
                            isOver={isOver}
                            isTouch={isTouch}
                            onSelect={handleSelectFiles}
                            view={view}
                        />
                    </div>
                    {isDisabled ? <div className="bcu-droppable-content-disabled-overlay" /> : null}
                </div>
            </>
        );
    },
);

export default DroppableContentV2;
