/**
 * @flow
 * @file Overall uploads progress bar
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import ProgressBar from './ProgressBar';
import { VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_ERROR, VIEW_UPLOAD_EMPTY } from '../../constants';

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
    isDragging: boolean,
    isVisible: boolean,
    percent: number,
    onClick: Function,
    onKeyDown: Function,
    view: View,
};

const OverallUploadsProgressBar = ({ percent, view, onClick, onKeyDown, isDragging, isVisible }: Props) => {
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
            onClick={onClick}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex={isVisible ? '0' : '-1'}
        >
            <span className="bcu-upload-status">{status}</span>
            <ProgressBar percent={updatedPercent} />
            <span className="bcu-uploads-manager-toggle" />
        </div>
    );
};

export default OverallUploadsProgressBar;
