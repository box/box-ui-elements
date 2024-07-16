// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Classification, { getClassificationLabelColor } from '../classification';
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
    const { bannerPolicy, canUserSeeClassification, classification } = item;
    const classificationColor = getClassificationLabelColor(bannerPolicy);

    return (
        <>
            <span className="bdl-UnifiedShareModalTitle">{title}</span>
            {canUserSeeClassification && (
                <Classification
                    definition={bannerPolicy ? bannerPolicy.body : undefined}
                    messageStyle="tooltip"
                    name={classification}
                    color={classificationColor}
                    className="bdl-UnifiedShareModalTitle-classification"
                />
            )}
        </>
    );
};

export default UnifiedShareModalTitle;
