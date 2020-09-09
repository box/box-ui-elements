// @flow
import * as React from 'react';
import TetherComponent from 'react-tether';
import { FormattedMessage } from 'react-intl';
import DeleteConfirmation from '../common/delete-confirmation';
import IconTrash from '../../../../icons/general/IconTrash';
import Media from '../../../../components/media';
import messages from './messages';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray } from '../../../../styles/variables';
import { MenuItem } from '../../../../components/menu';

type AnnotationActivityMenuProps = {
    canDelete?: boolean,
    id: string,
    onDeleteConfirm: () => void,
};

const AnnotationActivityMenu = ({ canDelete, id, onDeleteConfirm }: AnnotationActivityMenuProps) => {
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

    return (
        <TetherComponent {...tetherProps}>
            {canDelete && (
                <Media.Menu
                    isDisabled={isConfirmingDelete}
                    data-testid="annotation-activity-actions-menu"
                    menuProps={{
                        'data-resin-component': 'preview',
                        'data-resin-feature': 'annotations',
                    }}
                >
                    <MenuItem
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_DELETE}
                        data-testid="delete-annotation-activity"
                        onClick={handleDeleteClick}
                    >
                        <IconTrash color={bdlGray} />
                        <FormattedMessage {...messages.annotationActivityDeleteMenuItem} />
                    </MenuItem>
                </Media.Menu>
            )}
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
