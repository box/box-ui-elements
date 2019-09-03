// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Classification from '../classification';
import messages from './messages';
import type { item as ItemType } from './flowTypes';

type Props = {
    isEmailLinkSectionExpanded: boolean,
    item: ItemType,
    showCollaboratorList: boolean,
};

function getTitle(isEmailLinkSectionExpanded, showCollaboratorList, item) {
    const { name } = item;
    let title;

    if (isEmailLinkSectionExpanded) {
        title = (
            <FormattedMessage
                {...messages.emailModalTitle}
                values={{
                    itemName: name,
                }}
            />
        );
    } else if (showCollaboratorList) {
        title = (
            <FormattedMessage
                {...messages.collaboratorListTitle}
                values={{
                    itemName: name,
                }}
            />
        );
    } else {
        title = (
            <FormattedMessage
                {...messages.modalTitle}
                values={{
                    itemName: name,
                }}
            />
        );
    }

    return title;
}

const UnifiedShareModalTitle = ({ isEmailLinkSectionExpanded, showCollaboratorList, item }: Props) => {
    const title = getTitle(isEmailLinkSectionExpanded, showCollaboratorList, item);
    const { bannerPolicy, classification } = item;

    return (
        <span className="bdl-UnifiedShareModalTitle">
            {title}
            <Classification
                definition={bannerPolicy ? bannerPolicy.body : undefined}
                messageStyle="tooltip"
                name={classification}
                className="bdl-UnifiedShareModalTitle-classification"
            />
        </span>
    );
};

export default UnifiedShareModalTitle;
