/**
 * @flow
 * @file Uploads manager
 */

import React from 'react';
import classNames from 'classnames';
import ItemList from './ItemList';
import OverallUploadsProgressBar from './OverallUploadsProgressBar';
import './UploadsManager.scss';

import { STATUS_ERROR } from '../../constants';

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

    const totalSize = items.reduce(
        (updatedSize, item) => (item.status === STATUS_ERROR || item.isFolder ? updatedSize : updatedSize + item.size),
        0
    );
    const totalUploaded = items.reduce(
        (updatedSize, item) =>
            item.status === STATUS_ERROR || item.isFolder
                ? updatedSize
                : updatedSize + item.size * item.progress / 100.0,
        0
    );
    const percent = totalUploaded / totalSize * 100;

    return (
        <div
            className={classNames('be bcu-uploads-manager-container', {
                'bcu-is-expanded': isExpanded,
                'bcu-is-visible': isVisible
            })}
        >
            <OverallUploadsProgressBar
                isVisible={isVisible}
                percent={percent}
                onClick={toggleUploadsManager}
                onKeyDown={handleProgressBarKeyDown}
                view={view}
                isEmpty={items.length === 0}
            />
            <div className='bcu-uploads-manager-item-list'>
                <ItemList items={items} view={view} onClick={onItemActionClick} />
            </div>
        </div>
    );
};

export default UploadsManager;
