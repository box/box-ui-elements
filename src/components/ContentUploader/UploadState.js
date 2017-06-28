/**
 * @flow
 * @file Upload state component
 */

import classNames from 'classnames';
import React from 'react';
import IconErrorEmptyState from '../icons/states/IconErrorEmptyState';
import IconUploadStartState from '../icons/states/IconUploadStartState';
import IconUploadSuccessState from '../icons/states/IconUploadSuccessState';
import UploadStateContent from './UploadStateContent';
import { VIEW_ERROR, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS } from '../../constants';
import type { View } from '../../flowTypes';
import './UploadState.scss';

type Props = {
    canDrop: boolean,
    getLocalizedMessage: Function,
    hasItems: boolean,
    isOver: boolean,
    isTouch: boolean,
    view: View,
    onSelect: Function
};

const UploadState = ({ canDrop, getLocalizedMessage, hasItems, isOver, isTouch, view, onSelect }: Props) => {
    let icon;
    let content;
    /* eslint-disable jsx-a11y/label-has-for */
    switch (view) {
        case VIEW_ERROR:
            icon = <IconErrorEmptyState />;
            content = <UploadStateContent message={getLocalizedMessage('buik.upload.state.error')} />;
            break;
        case VIEW_UPLOAD_EMPTY:
            icon = <IconUploadStartState />;
            /* eslint-disable no-nested-ternary */
            content = canDrop && hasItems
                ? <UploadStateContent message={getLocalizedMessage('buik.upload.state.inprogress')} />
                : isTouch
                  ? <UploadStateContent
                      inputLabel={getLocalizedMessage('buik.upload.state.empty.input.nodragdrop')}
                      useButton
                      onChange={onSelect}
                    />
                  : <UploadStateContent
                      inputLabel={getLocalizedMessage('buik.upload.state.empty.input')}
                      message={getLocalizedMessage('buik.upload.state.empty')}
                      onChange={onSelect}
                    />;
            /* eslint-enable no-nested-ternary */
            break;
        case VIEW_UPLOAD_IN_PROGRESS:
            icon = <IconUploadStartState />;
            content = <UploadStateContent message={getLocalizedMessage('buik.upload.state.inprogress')} />;
            break;
        case VIEW_UPLOAD_SUCCESS:
            icon = <IconUploadSuccessState />;
            content = (
                <UploadStateContent
                    inputLabel={getLocalizedMessage('buik.upload.state.success.input')}
                    message={getLocalizedMessage('buik.upload.state.success')}
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
