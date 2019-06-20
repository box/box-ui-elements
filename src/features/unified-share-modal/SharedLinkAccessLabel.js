// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import type { ItemType } from '../../common/types/core';

import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';

import type { accessLevelType } from './flowTypes';

import SharedLinkAccessDescription from './SharedLinkAccessDescription';
import messages from './messages';

type Props = {
    accessLevel?: accessLevelType,
    enterpriseName?: string,
    hasDescription?: boolean,
    itemType: ItemType,
};

const SharedLinkAccessLabel = ({ accessLevel, enterpriseName, hasDescription, itemType }: Props) => {
    const messageKeyMap = {
        [ANYONE_WITH_LINK]: 'peopleWithTheLinkText',
        [ANYONE_IN_COMPANY]: enterpriseName === '' ? 'peopleInYourCompany' : 'peopleInEnterpriseName',
        [PEOPLE_IN_ITEM]: itemType === 'folder' ? 'peopleInThisFolder' : 'peopleInThisFile',
    };

    let messageName;
    if (accessLevel) {
        messageName = messageKeyMap[accessLevel];
    } else {
        return null;
    }

    return hasDescription ? (
        <span>
            <strong>
                <FormattedMessage {...messages[messageName]} values={{ enterpriseName }} />
            </strong>
            <SharedLinkAccessDescription
                accessLevel={accessLevel}
                enterpriseName={enterpriseName}
                itemType={itemType}
            />
        </span>
    ) : (
        <FormattedMessage {...messages[messageName]} values={{ enterpriseName }} />
    );
};

export default SharedLinkAccessLabel;
