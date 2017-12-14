/**
 * @flow
 * @file Uploads manager
 */

import React from 'react';
import classNames from 'classnames';
import ItemList from './ItemList';
import OverallUploadsProgressBar from './OverallUploadsProgressBar';
import './UploadsManager.scss';
import type { UploadItem, View } from '../../flowTypes';

type Props = {
    isExpanded: boolean,
    items: UploadItem[],
    onItemActionClick: Function,
    toggleUploadsManager: Function,
    view: View
};

const UploadsManager = ({ items, view, onItemActionClick, toggleUploadsManager, isExpanded }: Props) => {
    const isVisible = items.length > 0;

    /**
     * Keydown handler for progress bar
     * 
     * @param {SyntheticKeyboardEvent} event
     * @return {void}
     */
    const handleProgressBarKeyDown = (event: SyntheticKeyboardEvent): void => {
        switch (event.key) {
            case 'Enter':
            case 'Space':
                toggleUploadsManager();
                break;
            default:
            // noop
        }
    };

    const totalSize = items.reduce((updatedSize, item) => updatedSize + item.size, 0);
    const totalUploaded = items.reduce((updatedSize, item) => updatedSize + item.size * item.progress / 100.0, 0);
    const percent = totalUploaded / totalSize * 100;

    return (
        <div
            className={classNames('buik uploads-manager-container', {
                'is-expanded': isExpanded,
                'is-visible': isVisible
            })}
        >
            <OverallUploadsProgressBar
                isVisible={isVisible}
                percent={percent}
                onClick={toggleUploadsManager}
                onKeyDown={handleProgressBarKeyDown}
                view={view}
            />
            <div className='uploads-manager-item-list'>
                <ItemList items={items} view={view} onClick={onItemActionClick} />
            </div>
        </div>
    );
};

export default UploadsManager;
