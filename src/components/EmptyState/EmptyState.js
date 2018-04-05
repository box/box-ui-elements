/**
 * @flow
 * @file Empty state component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorEmptyState from 'box-react-ui/lib/icons/states/ErrorEmptyState';
import FolderEmptyState from 'box-react-ui/lib/icons/states/FolderEmptyState';
import SelectedItemsEmptyState from 'box-react-ui/lib/icons/states/SelectedItemsEmptyState';
import SearchEmptyState from 'box-react-ui/lib/icons/states/SearchEmptyState';
import messages from '../messages';
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
        isLoading && view === VIEW_FOLDER ? (
            <FormattedMessage {...messages.loadingState} />
        ) : (
            <FormattedMessage {...messages[`${view}State`]} />
        );

    switch (view) {
        case VIEW_ERROR:
            type = <ErrorEmptyState />;
            break;
        case VIEW_SELECTED:
            type = <SelectedItemsEmptyState />;
            break;
        case VIEW_SEARCH:
            type = <SearchEmptyState />;
            break;
        default:
            type = <FolderEmptyState />;
            break;
    }
    return (
        <div className='be-empty'>
            {type}
            <div>{message}</div>
        </div>
    );
};

export default EmptyState;
