/**
 * @flow
 * @file Sidebar file properties component
 * @author Box
 */

import React from 'react';
import getProp from 'lodash/get';
import { injectIntl } from 'react-intl';
import ItemProperties from '../../features/item-details/ItemProperties';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import getFileSize from '../../utils/getFileSize';
import { INTERACTION_TARGET, DETAILS_TARGETS } from '../common/interactionTargets';
import withErrorHandling from './withErrorHandling';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../constants';

type Props = {
    classification?: ClassificationInfo,
    file: BoxItem,
    hasClassification: boolean,
    hasRetentionPolicy: boolean,
    isLoading: boolean,
    onClassificationClick: ?Function,
    onDescriptionChange: Function,
    onRetentionPolicyExtendClick?: Function,
    retentionPolicy?: Object,
} & InjectIntlProvidedProps;

/**
 * Gets the openModal prop for ItemProperties
 *
 * @param {Object} file the box file
 * @param {Function} onClassificationClick the optional callback
 * @returns {Function|undefined} the callback function if it is passed in, and the user has permissions
 */
export const getClassificationModal = (file: BoxItem, onClassificationClick: ?Function) => {
    // Changing classification requires edit metadata permission, which is included in can_upload
    if (onClassificationClick && getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false)) {
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
    classification,
    onRetentionPolicyExtendClick,
    isLoading,
    intl,
}: Props) => {
    const classificationType = getProp(classification, 'type');

    return (
        <LoadingIndicatorWrapper isLoading={isLoading}>
            <ItemProperties
                classificationProps={
                    hasClassification
                        ? {
                              openModal: getClassificationModal(file, onClassificationClick),
                              tooltip: getProp(classification, 'description'),
                              value: classificationType,
                              [INTERACTION_TARGET]: classificationType
                                  ? DETAILS_TARGETS.CLASSIFICATION_EDIT
                                  : DETAILS_TARGETS.CLASSIFICATION_ADD,
                          }
                        : {}
                }
                createdAt={file.content_created_at}
                description={file.description}
                descriptionTextareaProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.DESCRIPTION,
                }}
                modifiedAt={file.content_modified_at}
                onDescriptionChange={getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined}
                owner={getProp(file, 'owned_by.name')}
                retentionPolicyProps={
                    hasRetentionPolicy
                        ? {
                              ...retentionPolicy,
                              openModal: onRetentionPolicyExtendClick,
                          }
                        : {}
                }
                size={getFileSize(file.size, intl.locale)}
                uploader={getProp(file, 'created_by.name')}
            />
        </LoadingIndicatorWrapper>
    );
};

export { SidebarFileProperties as SidebarFilePropertiesComponent };
export default injectIntl(withErrorHandling(SidebarFileProperties));
