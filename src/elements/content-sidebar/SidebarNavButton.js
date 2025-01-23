/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import CustomRoute from '../common/routing/customRoute';
import NavButton from '../common/nav-button';
import Tooltip from '../../components/tooltip/Tooltip';
import './SidebarNavButton.scss';

/**
 * @typedef {Object} Props
 * @property {string} [data-resin-target]
 * @property {string} [data-testid]
 * @property {React.ReactNode} children
 * @property {string} [elementId]
 * @property {boolean} [isDisabled]
 * @property {boolean} [isOpen]
 * @property {(sidebarView: string) => void} [onClick]
 * @property {string} sidebarView
 * @property {React.ReactNode} tooltip
 */

/** @type {React.ForwardRefRenderFunction<HTMLElement, Props>} */
const SidebarNavButton = React.forwardRef((props, ref) => {
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
        <CustomRoute path={sidebarPath}>
            {({ match }) => {
                const isMatch = !!match;
                const isActive = () => isMatch && !!isOpen;
                const isActiveValue = isActive();
                const isExactMatch = isMatch && match.isExact;
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
            }}
        </CustomRoute>
    );
});

export default SidebarNavButton;
