/**
 * @flow
 * @file Empty state component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import IconErrorEmptyState from '../icons/states/IconErrorEmptyState';
import IconFolderEmptyState from '../icons/states/IconFolderEmptyState';
import IconSelectedItemsEmptyState from '../icons/states/IconSelectedItemsEmptyState';
import IconSearchEmptyState from '../icons/states/IconSearchEmptyState';
import { VIEW_ERROR, VIEW_FOLDER, VIEW_SEARCH, VIEW_SELECTED } from '../../constants';
import type { View } from '../../flowTypes';
import './EmptyState.scss';

type Props = {
    view: View,
    isLoading: boolean
};

const EmptyState = ({ view, isLoading }: Props) => {
    let type;
    const message =
        isLoading && view === VIEW_FOLDER
            ? <FormattedMessage {...messages.loadingState} />
            : <FormattedMessage {...messages[`${view}State`]} />;

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
