/**
 * @flow
 * @file Empty state component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorEmptyState from '../../../icons/states/ErrorEmptyState';
import FolderEmptyState from '../../../icons/states/FolderEmptyState';
import SelectedItemsEmptyState from '../../../icons/states/SelectedItemsEmptyState';
import SearchEmptyState from '../../../icons/states/SearchEmptyState';
import messages from '../messages';
import { VIEW_ERROR, VIEW_FOLDER, VIEW_METADATA, VIEW_SEARCH, VIEW_SELECTED } from '../../../constants';
import type { View } from '../../../common/types/core';

import './EmptyState.scss';

type Props = {
    isLoading: boolean,
    view: View,
};

const EmptyState = ({ view, isLoading }: Props) => {
    let type;
    const message =
        isLoading && (view === VIEW_FOLDER || view === VIEW_METADATA) ? (
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
        <div className="be-empty">
            {type}
            <div>{message}</div>
        </div>
    );
};

export default EmptyState;
