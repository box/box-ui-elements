/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { useMatch } from '../common/nav-router/utils';
import NavButton from '../common/nav-button';
import Tooltip from '../../components/tooltip/Tooltip';
import './SidebarNavButton.scss';

type Props = {
    'data-resin-target'?: string,
    'data-testid'?: string,
    children: React.Node,
    elementId?: string,
    isDisabled?: boolean,
    isOpen?: boolean,
    onClick?: (sidebarView: string) => void,
    sidebarView: string,
    tooltip: React.Node,
};

const SidebarNavButton = React.forwardRef<Props, React.Ref<any>>((props: Props, ref: React.Ref<any>) => {
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

    const { isExact: isExactMatch, params } = useMatch(props, sidebarPath);
    const isMatch = !!isExactMatch || !!params;
    const isActive = () => isMatch && !!isOpen;
    const isActiveValue = isActive();
    const id = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;

    return (
        <Tooltip position="middle-left" text={tooltip} isTabbable={false}>
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
                tabIndex={isActiveValue ? '0' : '-1'}
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
