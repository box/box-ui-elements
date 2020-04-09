// @flow

import React, { useState } from 'react';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import DeleteConfirmation from '../common/delete-confirmation';
import IconPencil from '../../../../icons/general/IconPencil';
import IconTrash from '../../../../icons/general/IconTrash';
import Media from '../../../../components/media';
import messages from './messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray } from '../../../../styles/variables';
import { MenuItem } from '../../../../components/menu';

type Props = {
    canDelete?: boolean,
    canEdit?: boolean,
    handleDeleteConfirm: () => void,
    handleEditClick: () => void,
};

const AnnotationActivityMenu = ({ canDelete, canEdit, handleDeleteConfirm, handleEditClick }: Props) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDeleteCancel = (): void => {
        setIsConfirmingDelete(false);
    };

    const handleDeleteClick = () => {
        setIsConfirmingDelete(true);
    };

    return (
        <TetherComponent
            attachment="top right"
            className="bcs-AnnotationActivity-deleteConfirmationModal"
            constraints={[{ to: 'scrollParent', attachment: 'together' }]}
            targetAttachment="bottom right"
        >
            <Media.Menu
                isDisabled={isConfirmingDelete}
                data-testid="annotation-activity-actions-menu"
                menuProps={{
                    'data-resin-component': ACTIVITY_TARGETS.ANNOTATION_OPTIONS,
                }}
            >
                {canEdit && (
                    <MenuItem
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_EDIT}
                        data-testid="edit-annotation-activity"
                        onClick={handleEditClick}
                    >
                        <IconPencil color={bdlGray} />
                        <FormattedMessage {...messages.annotationActivityEditMenuItem} />
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_DELETE}
                        data-testid="delete-annotation-activity"
                        onClick={handleDeleteClick}
                    >
                        <IconTrash color={bdlGray} />
                        <FormattedMessage {...messages.annotationActivityDeleteMenuItem} />
                    </MenuItem>
                )}
            </Media.Menu>
            {isConfirmingDelete && (
                <DeleteConfirmation
                    data-resin-component={ACTIVITY_TARGETS.ANNOTATION_OPTIONS}
                    isOpen={isConfirmingDelete}
                    message={messages.annotationActivityDeletePrompt}
                    onDeleteCancel={handleDeleteCancel}
                    onDeleteConfirm={handleDeleteConfirm}
                />
            )}
        </TetherComponent>
    );
};

export default AnnotationActivityMenu;
