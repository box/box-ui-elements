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
import type { BoxItem } from '../../flowTypes';
import { KEY_CLASSIFICATION, KEY_CLASSIFICATION_TYPE } from '../../constants';
import { DETAILS_TARGETS } from '../../interactionTargets';

type Props = {
    file: BoxItem,
    onDescriptionChange: Function,
    hasClassification: Boolean,
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
    const value = getProp(file, `metadata.enterprise.${KEY_CLASSIFICATION}.${KEY_CLASSIFICATION_TYPE}`);

    return (
        <ItemProperties
            createdAt={file.created_at}
            description={file.description}
            modifiedAt={file.modified_at}
            owner={getProp(file, 'owned_by.name')}
            size={getFileSize(file.size, intl.locale)}
            uploader={getProp(file, 'created_by.name')}
            onDescriptionChange={getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined}
            descriptionTextareaProps={{ 'data-resin-target': DETAILS_TARGETS.DESCRIPTION }}
            classificationProps={
                hasClassification
                    ? {
                        openModal: onClassificationClick,
                        value,
                        'data-resin-target': value
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
