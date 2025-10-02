/* @flow */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import { accessLevelPropType } from './propTypes';
import messages from './messages';

type Props = {
    accessLevel?: accessLevelPropType,
    enterpriseName?: string,
    isDownloadAllowed?: boolean,
    isEditAllowed?: boolean,
    isPreviewAllowed?: boolean,
    itemType: string,
};

const AccessDescription = (props: Props) => {
    const { accessLevel, enterpriseName, isDownloadAllowed, isEditAllowed, isPreviewAllowed, itemType } = props;

    let description;

    switch (accessLevel) {
        case PEOPLE_WITH_LINK:
            if (itemType !== 'folder' && isEditAllowed) {
                description = messages.peopleWithLinkCanEditFile;
            } else if (isDownloadAllowed) {
                description =
                    itemType === 'folder'
                        ? messages.peopleWithLinkCanDownloadFolder
                        : messages.peopleWithLinkCanDownloadFile;
            } else {
                description =
                    itemType === 'folder' ? messages.peopleWithLinkCanViewFolder : messages.peopleWithLinkCanViewFile;
            }
            break;

        case PEOPLE_IN_COMPANY:
            if (itemType === 'folder') {
                if (isDownloadAllowed) {
                    description = enterpriseName
                        ? messages.peopleInSpecifiedCompanyCanDownloadFolder
                        : messages.peopleInCompanyCanDownloadFolder;
                } else {
                    description = enterpriseName
                        ? messages.peopleInSpecifiedCompanyCanViewFolder
                        : messages.peopleInCompanyCanViewFolder;
                }
            } else if (isEditAllowed) {
                description = enterpriseName
                    ? messages.peopleInSpecifiedCompanyCanEditFile
                    : messages.peopleInCompanyCanEditFile;
            } else if (isDownloadAllowed) {
                description = enterpriseName
                    ? messages.peopleInSpecifiedCompanyCanDownloadFile
                    : messages.peopleInCompanyCanDownloadFile;
            } else {
                description = enterpriseName
                    ? messages.peopleInSpecifiedCompanyCanViewFile
                    : messages.peopleInCompanyCanViewFile;
            }
            break;

        case PEOPLE_IN_ITEM:
            if (itemType !== 'folder' && isEditAllowed) {
                description = messages.peopleInItemCanEditFile;
            } else if (isPreviewAllowed && isDownloadAllowed) {
                description =
                    itemType === 'folder'
                        ? messages.peopleInItemCanPreviewAndDownloadFolder
                        : messages.peopleInItemCanPreviewAndDownloadFile;
            } else if (isPreviewAllowed) {
                description =
                    itemType === 'folder' ? messages.peopleInItemCanPreviewFolder : messages.peopleInItemCanPreviewFile;
            } else if (isDownloadAllowed) {
                description =
                    itemType === 'folder'
                        ? messages.peopleInItemCanDownloadFolder
                        : messages.peopleInItemCanDownloadFile;
            } else {
                description =
                    itemType === 'folder' ? messages.peopleInItemCanAccessFolder : messages.peopleInItemCanAccessFile;
            }
            break;

        default:
            return null;
    }

    return (
        <p>
            <FormattedMessage {...description} values={{ company: enterpriseName }} />
        </p>
    );
};

AccessDescription.displayName = 'AccessDescription';

export default AccessDescription;
