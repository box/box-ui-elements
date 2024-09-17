// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import type { ItemType } from '../../common/types/core';

import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import { ITEM_TYPE_FOLDER, ITEM_TYPE_HUBS } from '../../common/constants';

import type { accessLevelType } from './flowTypes';
import messages from './messages';

type Props = {
    accessLevel?: accessLevelType,
    enterpriseName?: string,
    itemType: ItemType,
};

const SharedLinkAccessDescription = ({ accessLevel, enterpriseName, itemType }: Props) => {
    const getDescriptionForAnyoneInCompany = (type: ItemType) => {
        switch (type) {
            case ITEM_TYPE_FOLDER:
                return enterpriseName
                    ? messages.peopleInSpecifiedCompanyCanAccessFolder
                    : messages.peopleInCompanyCanAccessFolder;
            case ITEM_TYPE_HUBS:
                return enterpriseName
                    ? messages.peopleInSpecifiedCompanyCanAccessHub
                    : messages.peopleInCompanyCanAccessHub;
            default:
                return enterpriseName
                    ? messages.peopleInSpecifiedCompanyCanAccessFile
                    : messages.peopleInCompanyCanAccessFile;
        }
    };

    const getDescriptionForPeopleInItem = (type: ItemType) => {
        switch (type) {
            case ITEM_TYPE_FOLDER:
                return messages.peopleInItemCanAccessFolder;
            case ITEM_TYPE_HUBS:
                return messages.peopleInItemCanAccessHub;
            default:
                return messages.peopleInItemCanAccessFile;
        }
    };

    let description;

    switch (accessLevel) {
        case ANYONE_WITH_LINK:
            description = messages.peopleWithLinkDescription;
            break;
        case ANYONE_IN_COMPANY:
            description = getDescriptionForAnyoneInCompany(itemType);
            break;
        case PEOPLE_IN_ITEM:
            description = getDescriptionForPeopleInItem(itemType);
            break;
        default:
            return null;
    }

    return (
        <small className="usm-menu-description">
            <FormattedMessage {...description} values={{ company: enterpriseName }} />
        </small>
    );
};

export default SharedLinkAccessDescription;
