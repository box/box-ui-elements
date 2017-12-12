/**
 * @flow
 * @file Overall uploads progress bar
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../messages';
import ProgressBar from './ProgressBar';
import { VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_ERROR } from '../../constants';
import type { UploadItem, View } from '../../flowTypes';

import './OverallUploadsProgressBar.scss';

type Props = {
    isVisible: boolean,
    items: UploadItem[],
    onClick: Function,
    onKeyDown: Function,
    view: View
};

/**
 * Get upload status
 * 
 * @param {View} view
 * @return {FormattedMessage|string} 
 */
const getUploadStatus = (view) => {
    switch (view) {
        case VIEW_UPLOAD_IN_PROGRESS:
            return <FormattedMessage {...messages.uploadsManagerUploadInProgress} />;
        case VIEW_UPLOAD_SUCCESS:
            return <FormattedMessage {...messages.uploadsManagerUploadComplete} />;
        case VIEW_ERROR:
            return <FormattedMessage {...messages.uploadsManagerUploadFailed} />;
        default:
            return '';
    }
};

const OverallUploadsProgressBar = ({ items, view, onClick, onKeyDown, isVisible }: Props) => {
    const totalSize = items.reduce((updatedSize, item) => updatedSize + item.size, 0);
    const totalUploaded = items.reduce((updatedSize, item) => updatedSize + item.size * item.progress / 100.0, 0);
    const uploadProgress = totalUploaded / totalSize * 100;

    return (
        <div
            className='overall-progress-bar'
            onClick={onClick}
            onKeyDown={onKeyDown}
            role='button'
            tabIndex={isVisible ? '0' : '-1'}
        >
            <span className='upload-status'>
                {getUploadStatus(view)}
            </span>
            <ProgressBar percent={uploadProgress} />
            <span className='uploads-manager-toggle' />
        </div>
    );
};

export default OverallUploadsProgressBar;
