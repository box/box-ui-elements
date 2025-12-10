// @flow
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { IconButton, Tooltip as BPTooltip } from '@box/blueprint-web';
import IconHide from '../../icons/general/IconHide';
import IconShow from '../../icons/general/IconShow';
import IconRightSidebarChevronOpen from '../../icons/general/IconRightSidebarChevronOpen';
import IconRightSidebarChevronClose from '../../icons/general/IconRightSidebarChevronClose';
import PlainButton from '../plain-button';
import Tooltip from '../tooltip';
import { useFeatureConfig } from '../../elements/common/feature-checking';
import messages from '../../elements/common/messages';

import './SidebarToggleButton.scss';

const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

type Props = {
    className?: string,
    direction?: string,
    intl: IntlShape,
    isOpen: boolean,
    onClick?: Function,
};

const SidebarToggleButton = ({
    className = '',
    direction = DIRECTION_RIGHT,
    intl,
    isOpen,
    onClick,
    ...rest
}: Props) => {
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');
    const isCollapsed = !isOpen ? 'collapsed' : '';
    const intlMessage = isOpen ? messages.sidebarHide : messages.sidebarShow;
    const intlText = intl.formatMessage(intlMessage);
    const classes = classNames(className, 'bdl-SidebarToggleButton', {
        'bdl-is-collapsed': isCollapsed,
    });
    const isDirectionLeft = direction === DIRECTION_LEFT;
    const tooltipPosition = isDirectionLeft ? 'middle-right' : 'middle-left';
    const renderIcon = () => {
        if (isDirectionLeft) {
            return isOpen ? <IconShow height={16} width={16} /> : <IconHide height={16} width={16} />;
        }
        return isOpen ? <IconHide height={16} width={16} /> : <IconShow height={16} width={16} />;
    };

    // Adding this to stop the mousedown event from being propagated up to box-annotations as
    // that will cause the active annotation to no longer be active which means that it will not be displayed.
    // This  causes video annotations not to work properly.
    const mouseDownHandler = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    if (isPreviewModernizationEnabled) {
        const tooltipPositionModernized = isDirectionLeft ? DIRECTION_RIGHT : DIRECTION_LEFT;
        return (
            <BPTooltip content={intlText} side={tooltipPositionModernized}>
                {isDirectionLeft ? (
                    <IconButton
                        aria-label={intlText}
                        data-testid="sidebar-toggle-button"
                        icon={isOpen ? IconRightSidebarChevronOpen : IconRightSidebarChevronClose}
                        onClick={onClick}
                        onMouseDown={mouseDownHandler}
                        size="large"
                        variant="high-contrast"
                        {...rest}
                    />
                ) : (
                    <IconButton
                        aria-label={intlText}
                        data-testid="sidebar-toggle-button"
                        icon={isOpen ? IconRightSidebarChevronClose : IconRightSidebarChevronOpen}
                        onClick={onClick}
                        onMouseDown={mouseDownHandler}
                        size="large"
                        variant="high-contrast"
                        {...rest}
                    />
                )}
            </BPTooltip>
        );
    }
    return (
        <Tooltip position={tooltipPosition} text={intlText}>
            <PlainButton
                aria-label={intlText}
                className={classes}
                data-testid="sidebar-toggle-button"
                onClick={onClick}
                onMouseDown={mouseDownHandler}
                type="button"
                {...rest}
            >
                {renderIcon()}
            </PlainButton>
        </Tooltip>
    );
};

export default injectIntl(SidebarToggleButton);
