// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import messages from './messages';

type Props = {
    accessLevel: string,
    enterpriseName?: string,
    itemType: string,
};

const AccessLabel = ({ accessLevel, enterpriseName, itemType }: Props) => {
    switch (accessLevel) {
        case PEOPLE_WITH_LINK:
            return <FormattedMessage {...messages.peopleWithTheLink} />;
        case PEOPLE_IN_COMPANY:
            return enterpriseName ? (
                <FormattedMessage {...messages.peopleInEnterprise} values={{ enterpriseName }} />
            ) : (
                <FormattedMessage {...messages.peopleInYourCompany} />
            );
        case PEOPLE_IN_ITEM:
            return itemType === 'folder' ? (
                <FormattedMessage {...messages.peopleInThisFolder} />
            ) : (
                <FormattedMessage {...messages.peopleInThisFile} />
            );
        default:
            return null;
    }
};

export default AccessLabel;
