import * as React from 'react';
import { Route } from 'react-router-dom';
import noop from 'lodash/noop';
import NavButton from '../common/nav-button';
import Tooltip, { TooltipPosition } from '../../components/tooltip/Tooltip';
import './SidebarNavButton.scss';

interface Props {
    'data-resin-target'?: string;
    'data-testid'?: string;
    children: React.ReactNode;
    elementId?: string;
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

    return (
        <Route path={sidebarPath}>
            {({ match }) => {
                const isMatch = !!match;
                const isActive = () => isMatch && !!isOpen;
                const isActiveValue = isActive();
                const isExactMatch = isMatch && match.isExact;
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
                            replace={isExactMatch}
                            role="tab"
                            tabIndex={isActiveValue ? 0 : -1}
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
            }}
        </Route>
    );
});

export default SidebarNavButton;
