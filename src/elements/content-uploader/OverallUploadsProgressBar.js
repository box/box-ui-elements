/**
 * @flow
 * @file Overall uploads progress bar
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import ProgressBar from './ProgressBar';
import UploadsManagerItemAction from './UploadsManagerAction';
import { VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_ERROR, VIEW_UPLOAD_EMPTY } from '../../constants';
import type { View } from '../../common/types/core';

import './OverallUploadsProgressBar.scss';

/**
 * Get upload status
 *
 * @param {View} view
 * @return {FormattedMessage|string}
 */
const getUploadStatus = (view: string) => {
    switch (view) {
        case VIEW_UPLOAD_IN_PROGRESS:
            return <FormattedMessage {...messages.uploadsManagerUploadInProgress} />;
        case VIEW_UPLOAD_SUCCESS:
            return <FormattedMessage {...messages.uploadsManagerUploadComplete} />;
        case VIEW_UPLOAD_EMPTY:
            return <FormattedMessage {...messages.uploadsManagerUploadPrompt} />;
        case VIEW_ERROR:
            return <FormattedMessage {...messages.uploadsManagerUploadFailed} />;
        default:
            return '';
    }
};

/**
 * Get overall upload progress percentage
 *
 * @param {string} view
 * @param {number} percent
 */
const getPercent = (view: string, percent: number): number => {
    switch (view) {
        case VIEW_UPLOAD_SUCCESS:
            return 100;
        case VIEW_UPLOAD_EMPTY:
        case VIEW_ERROR:
            return 0;
        default:
            return percent;
    }
};

type Props = {
    hasMultipleFailedUploads: boolean,
    isDragging: boolean,
    isExpanded: boolean,
    isResumeVisible: boolean,
    isVisible: boolean,
    onClick: Function,
    onKeyDown: Function,
    onUploadsManagerActionClick: Function,
    percent: number,
    view: View,
};

const OverallUploadsProgressBar = ({
    percent,
    view,
    onClick,
    onKeyDown,
    onUploadsManagerActionClick,
    isDragging,
    isResumeVisible,
    isVisible,
    isExpanded,
    hasMultipleFailedUploads,
}: Props) => {
    // Show the upload prompt and set progress to 0 when the uploads manager
    // is invisible or is having files dragged to it
    const shouldShowPrompt = isDragging || !isVisible;
    const status = shouldShowPrompt ? (
        <FormattedMessage {...messages.uploadsManagerUploadPrompt} />
    ) : (
        getUploadStatus(view)
    );
    const updatedPercent = shouldShowPrompt ? 0 : getPercent(view, percent);

    return (
        <div
            className="bcu-overall-progress-bar"
            data-resin-target={isExpanded ? 'uploadcollapse' : 'uploadexpand'}
            onClick={onClick}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex={isVisible ? '0' : '-1'}
        >
            <span className="bcu-upload-status">{status}</span>
            <ProgressBar percent={updatedPercent} />
            {isResumeVisible && (
                <UploadsManagerItemAction
                    hasMultipleFailedUploads={hasMultipleFailedUploads}
                    onClick={onUploadsManagerActionClick}
                />
            )}
            <span className="bcu-uploads-manager-toggle" />
        </div>
    );
};

export default OverallUploadsProgressBar;
