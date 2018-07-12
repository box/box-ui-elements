/**
 * @flow
 * @file Sidebar file properties component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { injectIntl } from 'react-intl';
import ItemProperties from 'box-react-ui/lib/features/item-details/ItemProperties';
import LoadingIndicatorWrapper from 'box-react-ui/lib/components/loading-indicator/LoadingIndicatorWrapper';
import getFileSize from 'box-react-ui/lib/utils/getFileSize';
import withErrorHandling from './withErrorHandling';

import { FIELD_METADATA_CLASSIFICATION, KEY_CLASSIFICATION_TYPE } from '../../constants';
import { INTERACTION_TARGET, DETAILS_TARGETS } from '../../interactionTargets';

type Props = {
    file: BoxItem,
    onDescriptionChange: Function,
    hasClassification: boolean,
    onClassificationClick: ?Function,
    hasRetentionPolicy: boolean,
    retentionPolicy?: Object,
    onRetentionPolicyExtendClick?: Function,
    intl: any,
    isLoading: boolean
};

/**
 * Gets the openModal prop for ItemProperties
 *
 * @param {Object} file the box file
 * @param {Function} onClassificationClick the optional callback
 * @returns {Function|undefined} the callback function if it is passed in, and the user has permissions
 */
export const getClassificationModal = (file: BoxItem, onClassificationClick: ?Function) => {
    // Changing classification requires edit metadata permission, which is included in can_upload
    if (onClassificationClick && getProp(file, 'permissions.can_upload', false)) {
        return onClassificationClick;
    }

    return undefined;
};

const SidebarFileProperties = ({
    file,
    onDescriptionChange,
    hasClassification,
    onClassificationClick,
    hasRetentionPolicy,
    retentionPolicy,
    onRetentionPolicyExtendClick,
    isLoading,
    intl
}: Props) => {
    const value = getProp(file, `${FIELD_METADATA_CLASSIFICATION}.${KEY_CLASSIFICATION_TYPE}`);

    return (
        <LoadingIndicatorWrapper isLoading={isLoading}>
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
                            openModal: getClassificationModal(file, onClassificationClick),
                            value,
                            [INTERACTION_TARGET]: value
                                ? DETAILS_TARGETS.CLASSIFICATION_EDIT
                                : DETAILS_TARGETS.CLASSIFICATION_ADD
                        }
                        : {}
                }
                retentionPolicyProps={
                    hasRetentionPolicy
                        ? {
                            ...retentionPolicy,
                            openModal: onRetentionPolicyExtendClick
                        }
                        : {}
                }
            />
        </LoadingIndicatorWrapper>
    );
};

export { SidebarFileProperties as SidebarFilePropertiesComponent };
export default injectIntl(withErrorHandling(SidebarFileProperties));
