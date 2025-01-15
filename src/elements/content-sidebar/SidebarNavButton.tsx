import * as React from 'react';
import { History } from 'history';
import noop from 'lodash/noop';
import { useMatch } from '../common/nav-router/utils';
import NavButton from '../common/nav-button';
import Tooltip, { TooltipPosition } from '../../components/tooltip/Tooltip';
import './SidebarNavButton.scss';

interface Props {
    'data-resin-target'?: string;
    'data-testid'?: string;
    children: React.ReactNode;
    elementId?: string;
    history: History;
    isDisabled?: boolean;
    isOpen?: boolean;
    onClick?: (sidebarView: string) => void;
    sidebarView: string;
    tooltip: React.ReactNode;
}

const SidebarNavButton = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const {
        'data-resin-target': dataResinTarget,
        'data-testid': dataTestId,
        children,
        elementId = '',
        history,
        isDisabled,
        isOpen,
        onClick = noop,
        sidebarView,
        tooltip,
    } = props;
    const sidebarPath = `/${sidebarView}`;

    const handleNavButtonClick = () => {
        onClick(sidebarView);
    };

    const { isExact, params } = useMatch({ history, location: history.location }, sidebarPath);
    const isMatch = !!isExact || !!Object.keys(params).length;
    const isActive = () => isMatch && !!isOpen;
    const isActiveValue = isActive();
    const id = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;

    return (
        <Tooltip position={TooltipPosition.MIDDLE_LEFT} text={tooltip} isTabbable={false}>
            <NavButton
                activeClassName="bcs-is-selected"
                aria-selected={isActiveValue}
                aria-controls={`${id}-content`}
                aria-label={tooltip}
                className="bcs-NavButton"
                data-resin-target={dataResinTarget}
                data-testid={dataTestId}
                getDOMRef={ref}
                id={id}
                isActive={isActive}
                isDisabled={isDisabled}
                onClick={handleNavButtonClick}
                replace={isExact}
                role="tab"
                tabIndex={0}
                to={{
                    pathname: sidebarPath,
                    state: { open: true },
                }}
                type="button"
            >
                {children}
            </NavButton>
        </Tooltip>
    );
});

export default SidebarNavButton;
