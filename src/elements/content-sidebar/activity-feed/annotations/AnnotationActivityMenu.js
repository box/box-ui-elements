// @flow
import * as React from 'react';
import flow from 'lodash/flow';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import DeleteConfirmation from '../common/delete-confirmation';
import Media from '../../../../components/media';
import messages from './messages';
import Pencil16 from '../../../../icon/line/Pencil16';
import Trash16 from '../../../../icon/fill/Trash16';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { MenuItem } from '../../../../components/menu';
import { withFeatureConsumer, isFeatureEnabled } from '../../../common/feature-checking';
import type { FeatureConfig } from '../../../common/feature-checking';

type AnnotationActivityMenuProps = {
    canDelete?: boolean,
    canEdit?: boolean,
    features: FeatureConfig,
    id: string,
    onDeleteConfirm: () => void,
    onEdit: () => void,
};

const AnnotationActivityMenu = ({
    canDelete,
    canEdit,
    features,
    id,
    onDeleteConfirm,
    onEdit,
}: AnnotationActivityMenuProps) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

    const handleDeleteCancel = (): void => {
        setIsConfirmingDelete(false);
    };

    const handleDeleteClick = () => {
        setIsConfirmingDelete(true);
    };

    const handleDeleteConfirm = () => {
        setIsConfirmingDelete(false);
        onDeleteConfirm();
    };

    const tetherProps = {
        attachment: 'top right',
        className: 'bcs-AnnotationActivity-deleteConfirmationModal',
        constraints: [{ to: 'scrollParent', attachment: 'together' }],
        targetAttachment: 'bottom right',
    };

    const shouldShowModifyAnnotations = isFeatureEnabled(features, 'activityFeed.modifyAnnotations.enabled');

    return (
        <TetherComponent {...tetherProps}>
            <Media.Menu
                isDisabled={isConfirmingDelete}
                data-testid="annotation-activity-actions-menu"
                menuProps={{
                    'data-resin-component': 'preview',
                    'data-resin-feature': 'annotations',
                }}
            >
                {canEdit && shouldShowModifyAnnotations && (
                    <MenuItem
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_EDIT}
                        data-testid="edit-annotation-activity"
                        onClick={onEdit}
                    >
                        <Pencil16 />
                        <FormattedMessage {...messages.annotationActivityEditMenuItem} />
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_DELETE}
                        data-testid="delete-annotation-activity"
                        onClick={handleDeleteClick}
                    >
                        <Trash16 />
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

export { AnnotationActivityMenu as AnnotationActivityMenuBase };
export default flow([withFeatureConsumer])(AnnotationActivityMenu);
