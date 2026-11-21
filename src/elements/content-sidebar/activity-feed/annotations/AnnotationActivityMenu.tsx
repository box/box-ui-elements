import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import DropdownMenu from '../../../../components/dropdown-menu';
import Checkmark16 from '../../../../icon/fill/Checkmark16';
import IconEllipsis from '../../../../icons/general/IconEllipsis';
import Pencil16 from '../../../../icon/line/Pencil16';
import PlainButton from '../../../../components/plain-button';
import Trash16 from '../../../../icon/line/Trash16';
import X16 from '../../../../icon/fill/X16';
import { ButtonType } from '../../../../components/button';
import { Menu, MenuItem } from '../../../../components/menu';

import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../../../constants';
import { bdlGray50 } from '../../../../styles/variables';

import messages from './messages';

import type { FeedItemStatus } from '../../../../common/types/feed';

import './AnnotationActivityMenu.scss';

export interface AnnotationActivityMenuProps {
    canDelete?: boolean;
    canEdit?: boolean;
    canResolve?: boolean;
    className?: string;
    id: string;
    isDisabled?: boolean;
    onDelete: () => void;
    onEdit: () => void;
    onMenuClose: () => void;
    onMenuOpen: () => void;
    onStatusChange: (newStatus: FeedItemStatus) => void;
    status?: FeedItemStatus;
}

const AnnotationActivityMenu = ({
    canDelete,
    canEdit,
    canResolve,
    className,
    id,
    isDisabled,
    onDelete,
    onEdit,
    onMenuClose,
    onMenuOpen,
    onStatusChange,
    status,
}: AnnotationActivityMenuProps) => {
    const menuProps = {
        'data-resin-component': 'preview',
        'data-resin-feature': 'annotations',
    };
    const isResolved = status === COMMENT_STATUS_RESOLVED;

    return (
        <DropdownMenu constrainToScrollParent isRightAligned onMenuClose={onMenuClose} onMenuOpen={onMenuOpen}>
            <PlainButton
                className={classNames('bcs-AnnotationActivityMenu', className)}
                data-testid="annotation-activity-actions-menu"
                isDisabled={isDisabled}
                type={ButtonType.BUTTON}
            >
                <IconEllipsis color={bdlGray50} height={16} width={16} />
            </PlainButton>
            <Menu {...menuProps}>
                {canResolve && isResolved && (
                    <MenuItem
                        className="bcs-AnnotationActivityMenu-unresolveAnnotation"
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_UNRESOLVE}
                        data-testid="unresolve-annotation-activity"
                        onClick={() => onStatusChange(COMMENT_STATUS_OPEN)}
                    >
                        <X16 />
                        <FormattedMessage {...messages.annotationActivityUnresolveMenuItem} />
                    </MenuItem>
                )}
                {canResolve && !isResolved && (
                    <MenuItem
                        data-resin-itemid={id}
                        data-resin-target={ACTIVITY_TARGETS.ANNOTATION_OPTIONS_RESOLVE}
                        data-testid="resolve-annotation-activity"
                        onClick={() => onStatusChange(COMMENT_STATUS_RESOLVED)}
                    >
                        <Checkmark16 />
                        <FormattedMessage {...messages.annotationActivityResolveMenuItem} />
                    </MenuItem>
                )}
                {canEdit && (
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
                        onClick={onDelete}
                    >
                        <Trash16 />
                        <FormattedMessage {...messages.annotationActivityDeleteMenuItem} />
                    </MenuItem>
                )}
            </Menu>
        </DropdownMenu>
    );
};

export default AnnotationActivityMenu;
