// @flow
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Tooltip as BPTooltip } from '@box/blueprint-web';
import IconHide from '../../icons/general/IconHide';
import IconShow from '../../icons/general/IconShow';
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
        'bdl-SidebarToggleButton--modernized': isPreviewModernizationEnabled,
    });
    const tooltipPosition = direction === DIRECTION_LEFT ? 'middle-right' : 'middle-left';
    const renderButton = () => {
        if (direction === DIRECTION_LEFT) {
            return isOpen ? <IconShow height={16} width={16} /> : <IconHide height={16} width={16} />;
        }
        return isOpen ? <IconHide height={16} width={16} /> : <IconShow height={16} width={16} />;
    };

    // Adding this to stop the mousedown event from being propogated up to box-annnotatoins as
    // that will cause the active annotation to no longer be active which means that it will not be displayed.
    // This  causes video annotations not to work properly.
    const mouseDownHandler = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    if (isPreviewModernizationEnabled) {
        const tooltipPositionModernized = direction === DIRECTION_LEFT ? DIRECTION_RIGHT : DIRECTION_LEFT;

        return (
            <BPTooltip content={intlText} side={tooltipPositionModernized} onMouseDown={mouseDownHandler}>
                {/* Workaround to attach BP tooltip to legacy button, remove span when buttons are migrated to BP */}
                <span onMouseDown={mouseDownHandler} role="presentation">
                    <PlainButton
                        aria-label={intlText}
                        className={classes}
                        onClick={onClick}
                        onMouseDown={mouseDownHandler}
                        type="button"
                        {...rest}
                    >
                        {renderButton()}
                    </PlainButton>
                </span>
            </BPTooltip>
        );
    }
    return (
        <Tooltip position={tooltipPosition} text={intlText} onMouseDown={mouseDownHandler}>
            <PlainButton
                aria-label={intlText}
                className={classes}
                onClick={onClick}
                onMouseDown={mouseDownHandler}
                type="button"
                {...rest}
            >
                {renderButton()}
            </PlainButton>
        </Tooltip>
    );
};

export default injectIntl(SidebarToggleButton);
