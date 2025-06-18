/**
 * @flow
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import { Route } from 'react-router-dom';
import noop from 'lodash/noop';
import classNames from 'classnames';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip/Tooltip';
import { isLeftClick } from '../../utils/dom';
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

    return (
        <Route path={sidebarPath}>
            {({ match, history }) => {
                const isMatch = !!match;
                const isActiveValue = isMatch && !!isOpen;
                const isExactMatch = isMatch && match.isExact;
                const id = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;

                const handleNavButtonClick = event => {
                    onClick(sidebarView);

                    if (!event.defaultPrevented && isLeftClick(event)) {
                        const method = isExactMatch ? history.replace : history.push;
                        method({
                            pathname: sidebarPath,
                            state: { open: true },
                        });
                    }
                };

                return (
                    <Tooltip position="middle-left" text={tooltip} isTabbable={false}>
                        <PlainButton
                            getDOMRef={ref}
                            className={classNames('bcs-NavButton', {
                                'bcs-is-selected': isActiveValue,
                                'bdl-is-disabled': isDisabled,
                            })}
                            aria-selected={isActiveValue}
                            aria-controls={`${id}-content`}
                            aria-label={tooltip}
                            data-resin-target={dataResinTarget}
                            data-testid={dataTestId}
                            id={id}
                            isDisabled={isDisabled}
                            onClick={handleNavButtonClick}
                            role="tab"
                            tabIndex={isActiveValue ? '0' : '-1'}
                            type="button"
                        >
                            {children}
                        </PlainButton>
                    </Tooltip>
                );
            }}
        </Route>
    );
});

export default SidebarNavButton;
