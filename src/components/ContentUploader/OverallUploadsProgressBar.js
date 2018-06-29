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

type Props = {
    isVisible: boolean,
    percent: number,
    onClick: Function,
    onKeyDown: Function,
    view: View,
    numberOfItems: number
};

const OverallUploadsProgressBar = ({ percent, view, onClick, onKeyDown, isVisible, numberOfItems }: Props) => {
    /**
     * Get upload status
     *
     * @param {View} view
     * @return {FormattedMessage|string}
     */
    const getUploadStatus = () => {
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

    const getPercent = () => {
        if (view === VIEW_UPLOAD_SUCCESS || (view === VIEW_UPLOAD_EMPTY && numberOfItems === 0)) {
            return 100;
        } else if (view === VIEW_ERROR) {
            return 0;
        }

        return percent;
    };

    return (
        <div
            className='bcu-overall-progress-bar'
            onClick={onClick}
            onKeyDown={onKeyDown}
            role='button'
            tabIndex={isVisible ? '0' : '-1'}
        >
            <span className='bcu-upload-status'>{getUploadStatus()}</span>
            <ProgressBar percent={getPercent()} />
            <span className='bcu-uploads-manager-toggle' />
        </div>
    );
};

export default OverallUploadsProgressBar;
