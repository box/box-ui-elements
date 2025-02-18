import React from 'react';
import { useIntl } from 'react-intl';

import { EmptyState, Text } from '@box/blueprint-web';
import { Files, FolderFloat, HatWand, OpenBook } from '@box/blueprint-web-assets/illustrations/Medium';

import { VIEW_ERROR, VIEW_FOLDER, VIEW_METADATA, VIEW_SEARCH, VIEW_SELECTED } from '../../../constants';

import messages from './messages';

import type { View } from '../../../common/types/core';

export interface EmptyViewProps {
    isLoading: boolean;
    view: View;
}

const EmptyView = ({ isLoading, view }: EmptyViewProps) => {
    const { formatMessage } = useIntl();

    let icon;
    let text = formatMessage(messages[`${view}State`]);

    if (isLoading && (view === VIEW_FOLDER || view === VIEW_METADATA)) {
        text = formatMessage(messages.loadingState);
    }

    switch (view) {
        case VIEW_ERROR:
            icon = HatWand;
            break;
        case VIEW_SELECTED:
            icon = Files;
            break;
        case VIEW_SEARCH:
            icon = OpenBook;
            break;
        default:
            icon = FolderFloat;
            break;
    }

    return <EmptyState body={<Text as="p">{text}</Text>} illustration={icon} />;
};

export default EmptyView;
