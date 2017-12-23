/**
 * @flow
 * @file Upload state component
 */

import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import ErrorEmptyState from 'box-react-ui/lib/icons/states/ErrorEmptyState';
import UploadStartState from 'box-react-ui/lib/icons/states/UploadStartState';
import UploadSuccessState from 'box-react-ui/lib/icons/states/UploadSuccessState';
import messages from '../messages';
import UploadStateContent from './UploadStateContent';
import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../constants';
import type { View } from '../../flowTypes';
import './UploadState.scss';

type Props = {
    canDrop: boolean,
    hasItems: boolean,
    isOver: boolean,
    isTouch: boolean,
    view: View,
    onSelect: Function
};

const UploadState = ({ canDrop, hasItems, isOver, isTouch, view, onSelect }: Props) => {
    let icon;
    let content;
    /* eslint-disable jsx-a11y/label-has-for */
    switch (view) {
        case VIEW_ERROR:
            icon = <ErrorEmptyState />;
            content = <UploadStateContent message={<FormattedMessage {...messages.uploadError} />} />;
            break;
        case VIEW_UPLOAD_EMPTY:
            icon = <UploadStartState />;
            /* eslint-disable no-nested-ternary */
            content =
                canDrop && hasItems ? (
                    <UploadStateContent message={<FormattedMessage {...messages.uploadInProgress} />} />
                ) : isTouch ? (
                    <UploadStateContent
                        inputLabel={<FormattedMessage {...messages.uploadNoDragDrop} />}
                        useButton
                        onChange={onSelect}
                    />
                ) : (
                    <UploadStateContent
                        inputLabel={<FormattedMessage {...messages.uploadEmptyInput} />}
                        message={<FormattedMessage {...messages.uploadEmpty} />}
                        onChange={onSelect}
                    />
                );
            /* eslint-enable no-nested-ternary */
            break;
        case VIEW_UPLOAD_IN_PROGRESS:
            icon = <UploadStartState />;
            content = <UploadStateContent message={<FormattedMessage {...messages.uploadInProgress} />} />;
            break;
        case VIEW_UPLOAD_SUCCESS:
            icon = <UploadSuccessState />;
            content = (
                <UploadStateContent
                    inputLabel={<FormattedMessage {...messages.uploadSuccessInput} />}
                    message={<FormattedMessage {...messages.uploadSuccess} />}
                    useButton={isTouch}
                    onChange={onSelect}
                />
            );
            break;
        default:
            break;
        /* eslint-enable jsx-a11y/label-has-for */
    }

    const className = classNames('bcu-upload-state', {
        'bcu-is-droppable': isOver && canDrop,
        'bcu-is-not-droppable': isOver && !canDrop,
        'bcu-has-items': hasItems
    });

    return (
        <div className={className}>
            <div>
                {icon}
                {content}
            </div>
            <div className='bcu-drag-drop-overlay' />
        </div>
    );
};

export default UploadState;
