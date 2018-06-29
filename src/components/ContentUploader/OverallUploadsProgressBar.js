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
        case VIEW_UPLOAD_EMPTY:
            return <FormattedMessage {...messages.uploadsManagerUploadComplete} />;
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
 * @param {boolean} isEmpty - true if there are no items in the upload queue
 * @param {number} percent
 */
const getPercent = (view: string, isEmpty: boolean, percent: number): number => {
    if (view === VIEW_UPLOAD_SUCCESS || (view === VIEW_UPLOAD_EMPTY && isEmpty)) {
        return 100;
    } else if (view === VIEW_ERROR) {
        return 0;
    }

    return percent;
};

type Props = {
    isVisible: boolean,
    percent: number,
    onClick: Function,
    onKeyDown: Function,
    view: View,
    isEmpty: boolean
};

const OverallUploadsProgressBar = ({ percent, view, onClick, onKeyDown, isVisible, isEmpty }: Props) => (
    <div
        className='bcu-overall-progress-bar'
        onClick={onClick}
        onKeyDown={onKeyDown}
        role='button'
        tabIndex={isVisible ? '0' : '-1'}
    >
        <span className='bcu-upload-status'>{getUploadStatus(view)}</span>
        <ProgressBar percent={getPercent(view, isEmpty, percent)} />
        <span className='bcu-uploads-manager-toggle' />
    </div>
);

export default OverallUploadsProgressBar;
