/**
 * @flow
 * @file Empty state component
 * @author Box
 */

import React from 'react';
import IconErrorEmptyState from '../icons/states/IconErrorEmptyState';
import IconFolderEmptyState from '../icons/states/IconFolderEmptyState';
import IconSelectedItemsEmptyState from '../icons/states/IconSelectedItemsEmptyState';
import IconSearchEmptyState from '../icons/states/IconSearchEmptyState';
import { VIEW_ERROR, VIEW_FOLDER, VIEW_SEARCH, VIEW_SELECTED } from '../../constants';
import type { View } from '../../flowTypes';
import './EmptyState.scss';

type Props = {
    view: View,
    isLoading: boolean,
    getLocalizedMessage: Function
};

const EmptyState = ({ view, isLoading, getLocalizedMessage }: Props) => {
    let type;
    const message =
        isLoading && view === VIEW_FOLDER
            ? getLocalizedMessage('buik.empty.state.folder.loading')
            : getLocalizedMessage(`buik.empty.state.${view}`);

    switch (view) {
        case VIEW_ERROR:
            type = <IconErrorEmptyState />;
            break;
        case VIEW_SELECTED:
            type = <IconSelectedItemsEmptyState />;
            break;
        case VIEW_SEARCH:
            type = <IconSearchEmptyState />;
            break;
        default:
            type = <IconFolderEmptyState />;
            break;
    }
    return (
        <div className='buik-empty'>
            {type}
            <div>
                {message}
            </div>
        </div>
    );
};

export default EmptyState;
