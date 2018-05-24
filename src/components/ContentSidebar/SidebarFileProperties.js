/**
 * @flow
 * @file Sidebar file properties component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { injectIntl } from 'react-intl';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import getFileSize from 'box-react-ui/lib/utils/getFileSize';
import withErrorHandling from './withErrorHandling';

import { FIELD_METADATA_CLASSIFICATION, KEY_CLASSIFICATION_TYPE } from '../../constants';
import { INTERACTION_TARGET, DETAILS_TARGETS } from '../../interactionTargets';

type Props = {
    file: BoxItem,
    onDescriptionChange: Function,
    hasClassification: boolean,
    onClassificationClick: ?Function,
    intl: any
};

const SidebarFileProperties = ({
    file,
    onDescriptionChange,
    hasClassification,
    onClassificationClick,
    intl
}: Props) => {
    const value = getProp(file, `${FIELD_METADATA_CLASSIFICATION}.${KEY_CLASSIFICATION_TYPE}`);

    return (
        <ItemProperties
            createdAt={file.created_at}
            description={file.description}
            modifiedAt={file.modified_at}
            owner={getProp(file, 'owned_by.name')}
            size={getFileSize(file.size, intl.locale)}
            uploader={getProp(file, 'created_by.name')}
            onDescriptionChange={getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined}
            descriptionTextareaProps={{ [INTERACTION_TARGET]: DETAILS_TARGETS.DESCRIPTION }}
            classificationProps={
                hasClassification
                    ? {
                        openModal: onClassificationClick,
                        value,
                        [INTERACTION_TARGET]: value
                            ? DETAILS_TARGETS.CLASSIFICATION_EDIT
                            : DETAILS_TARGETS.CLASSIFICATION_ADD
                    }
                    : {}
            }
        />
    );
};

export { SidebarFileProperties as SidebarFilePropertiesComponent };
export default injectIntl(withErrorHandling(SidebarFileProperties));
