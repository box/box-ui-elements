import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Files, FolderFloat, HatWand, OpenBook } from '@box/blueprint-web-assets/illustrations/Medium';

import messages from '../messages';
import { VIEW_ERROR, VIEW_FOLDER, VIEW_METADATA, VIEW_SEARCH, VIEW_SELECTED } from '../../../constants';
import type { View } from '../../../common/types/core';

import './EmptyState.scss';

export interface EmptyStateProps {
    isLoading: boolean;
    view: View;
}

const EmptyState = ({ view, isLoading }: EmptyStateProps) => {
    let type;
    const message =
        isLoading && (view === VIEW_FOLDER || view === VIEW_METADATA) ? (
            <FormattedMessage {...messages.loadingState} />
        ) : (
            <FormattedMessage {...messages[`${view}State`]} />
        );

    switch (view) {
        case VIEW_ERROR:
            type = <HatWand />;
            break;
        case VIEW_SELECTED:
            type = <Files />;
            break;
        case VIEW_SEARCH:
            type = <OpenBook />;
            break;
        default:
            type = <FolderFloat />;
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
