import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import { IconButton, Tooltip as BPTooltip, useBreakpoint, Breakpoint } from '@box/blueprint-web';
import {
    ChevronDown,
    ChevronUp,
    RightSidebarChevronClose,
    RightSidebarChevronOpen,
} from '@box/blueprint-web-assets/icons/Medium';

import IconHide from '../../icons/general/IconHide';
import IconShow from '../../icons/general/IconShow';
import { ButtonType } from '../button';
import PlainButton from '../plain-button';
import Tooltip, { TooltipPosition } from '../tooltip';
import { useFeatureConfig } from '../../elements/common/feature-checking';
import messages from '../../elements/common/messages';

import './SidebarToggleButton.scss';

const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

export interface SidebarToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    /** Custom class for the toggle button */
    className?: string;
    /** Side of the layout the toggle faces (`left` or `right`) */
    direction?: string;
    /** Intl object provided by injectIntl */
    intl: IntlShape;
    /** Whether the associated sidebar is currently open */
    isOpen: boolean;
    /** Click handler for the toggle button */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SidebarToggleButton = ({
    className = '',
    direction = DIRECTION_RIGHT,
    intl,
    isOpen,
    onClick,
    ...rest
}: SidebarToggleButtonProps) => {
    const breakpoint = useBreakpoint();
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');

    const isCollapsed = !isOpen ? 'collapsed' : '';
    const intlMessage = isOpen ? messages.sidebarHide : messages.sidebarShow;
    const intlText = intl.formatMessage(intlMessage);
    const classes = classNames(className, {
        'bdl-is-collapsed': isCollapsed,
        'bdl-SidebarToggleButton': !isPreviewModernizationEnabled,
        'bdl-SidebarToggleButton--modernized': isPreviewModernizationEnabled,
    });

    const isDirectionLeft = direction === DIRECTION_LEFT;
    const tooltipPosition = isDirectionLeft ? TooltipPosition.MIDDLE_RIGHT : TooltipPosition.MIDDLE_LEFT;

    // Adding this to stop the mousedown event from being propagated up to box-annotations as
    // that will cause the active annotation to no longer be active which means that it will not be displayed.
    // This  causes video annotations not to work properly.
    const mouseDownHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    if (isPreviewModernizationEnabled) {
        const isBelowMediumView = breakpoint <= Breakpoint.Medium;
        const tooltipPositionModernized = isDirectionLeft ? DIRECTION_RIGHT : DIRECTION_LEFT;

        const renderModernizedIcon = () => {
            if (isBelowMediumView) {
                return isOpen ? ChevronDown : ChevronUp;
            }

            if (isDirectionLeft) {
                return isOpen ? RightSidebarChevronOpen : RightSidebarChevronClose;
            }

            return isOpen ? RightSidebarChevronClose : RightSidebarChevronOpen;
        };

        return (
            <BPTooltip content={intlText} side={tooltipPositionModernized}>
                <IconButton
                    aria-label={intlText}
                    className={classes}
                    icon={renderModernizedIcon()}
                    onClick={onClick}
                    onMouseDown={mouseDownHandler}
                    size={isBelowMediumView ? 'small' : 'large'}
                    {...rest}
                />
            </BPTooltip>
        );
    }

    const renderIcon = () => {
        if (isDirectionLeft) {
            return isOpen ? <IconShow height={16} width={16} /> : <IconHide height={16} width={16} />;
        }
        return isOpen ? <IconHide height={16} width={16} /> : <IconShow height={16} width={16} />;
    };

    return (
        <Tooltip position={tooltipPosition} text={intlText}>
            <PlainButton
                aria-label={intlText}
                className={classes}
                onClick={onClick}
                onMouseDown={mouseDownHandler}
                type={ButtonType.BUTTON}
                {...rest}
            >
                {renderIcon()}
            </PlainButton>
        </Tooltip>
    );
};

export default injectIntl(SidebarToggleButton);
