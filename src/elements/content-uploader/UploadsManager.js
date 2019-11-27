/**
 * @flow
 * @file Uploads manager
 */

import React from 'react';
import classNames from 'classnames';
import ItemList from './ItemList';
import OverallUploadsProgressBar from './OverallUploadsProgressBar';
import { STATUS_ERROR } from '../../constants';
import type { UploadItem } from '../../common/types/upload';
import type { View } from '../../common/types/core';

import './UploadsManager.scss';

type Props = {
    isDragging: boolean,
    isExpanded: boolean,
    isResumableUploadsEnabled: boolean,
    isVisible: boolean,
    items: UploadItem[],
    onItemActionClick: Function,
    onRemoveActionClick: (item: UploadItem) => void,
    onUploadsManagerActionClick: Function,
    toggleUploadsManager: Function,
    view: View,
};

const UploadsManager = ({
    items,
    view,
    onItemActionClick,
    onRemoveActionClick,
    onUploadsManagerActionClick,
    toggleUploadsManager,
    isExpanded,
    isVisible,
    isResumableUploadsEnabled,
    isDragging,
}: Props) => {
    /**
     * Keydown handler for progress bar
     *
     * @param {SyntheticKeyboardEvent} event
     * @return {void}
     */
    const handleProgressBarKeyDown = (event: SyntheticKeyboardEvent<*>): void => {
        switch (event.key) {
            case 'Enter':
            case 'Space':
                toggleUploadsManager();
                break;
            default:
            // noop
        }
    };

    let numFailedUploads = 0;
    let totalSize = 0;
    let totalUploaded = 0;
    items.forEach(item => {
        if (item.status !== STATUS_ERROR && !item.isFolder) {
            totalSize += item.size;
            totalUploaded += (item.size * item.progress) / 100.0;
        } else if (item.status === STATUS_ERROR) {
            numFailedUploads += 1;
        }
    });

    const percent = (totalUploaded / totalSize) * 100;
    const isResumeVisible = isResumableUploadsEnabled && numFailedUploads > 0;
    const hasMultipleFailedUploads = numFailedUploads > 1;

    return (
        <div
            data-resin-component="uploadsmanager"
            data-resin-feature="uploads"
            className={classNames('be bcu-uploads-manager-container', {
                'bcu-is-expanded': isExpanded,
                'bcu-is-visible': isVisible,
            })}
        >
            <OverallUploadsProgressBar
                isDragging={isDragging}
                isExpanded={isExpanded}
                isResumeVisible={isResumeVisible}
                isVisible={isVisible}
                hasMultipleFailedUploads={hasMultipleFailedUploads}
                onClick={toggleUploadsManager}
                onKeyDown={handleProgressBarKeyDown}
                onUploadsManagerActionClick={onUploadsManagerActionClick}
                percent={percent}
                view={view}
            />
            <div className="bcu-uploads-manager-item-list">
                <ItemList
                    isResumableUploadsEnabled={isResumableUploadsEnabled}
                    items={items}
                    onClick={onItemActionClick}
                    onRemoveClick={onRemoveActionClick}
                    view={view}
                />
            </div>
        </div>
    );
};

export default UploadsManager;
