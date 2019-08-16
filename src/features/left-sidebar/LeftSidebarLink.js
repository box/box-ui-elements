/* @flow */
import * as React from 'react';
import classNames from 'classnames';

import LinkBase from '../../components/link/LinkBase';
import Tooltip from '../../components/tooltip';
import LeftSidebarLinkCallout from './LeftSidebarLinkCallout';
import RemoveButton from './RemoveButton';

import type { Callout } from './Callout';

import './styles/LeftSidebarLink.scss';

export type Props = {
    callout?: Callout,
    className?: string,
    customTheme?: Object,
    htmlAttributes?: Object,
    icon?: ?React.Element<any>,
    isScrolling?: boolean,
    message: string,
    newItemBadge?: React.Element<any> | null,
    onClickRemove?: Function,
    removeButtonHtmlAttributes?: Object,
    routerLink?: React.ComponentType<any>,
    routerProps?: Object,
    selected?: boolean,
    showTooltip?: boolean,
};

type State = {
    isTextOverflowed: boolean,
};

class LeftSidebarLink extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isTextOverflowed: false,
        };
    }

    componentDidMount() {
        if (!this.leftSidebarLinkText) {
            return;
        }

        const { offsetWidth, scrollWidth } = this.leftSidebarLinkText;

        if (offsetWidth < scrollWidth) {
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({
                isTextOverflowed: true,
            });
        }
    }

    leftSidebarLinkText: ?HTMLElement;

    render() {
        const {
            callout,
            className = '',
            customTheme = {},
            htmlAttributes = {},
            icon,
            isScrolling = false,
            message,
            newItemBadge,
            onClickRemove,
            removeButtonHtmlAttributes = {},
            routerLink: RouterLink,
            routerProps = {},
            selected = false,
            showTooltip = true,
        } = this.props;

        const { secondaryColor } = customTheme;
        const LinkComponent = RouterLink || LinkBase;
        const routerLinkProps = RouterLink ? routerProps : {};

        const linkComponent = (
            <LinkComponent
                className={className}
                {...htmlAttributes}
                {...routerLinkProps}
                style={
                    selected && customTheme
                        ? {
                              boxShadow: secondaryColor ? `inset 2px 0 0 ${secondaryColor}` : undefined,
                          }
                        : {}
                }
            >
                {icon}
                <span
                    ref={leftSidebarLinkText => {
                        this.leftSidebarLinkText = leftSidebarLinkText;
                    }}
                    className="left-sidebar-link-text"
                >
                    {message}
                </span>
                {newItemBadge}
            </LinkComponent>
        );

        let component = linkComponent;

        if (callout) {
            component = <LeftSidebarLinkCallout callout={callout}>{linkComponent}</LeftSidebarLinkCallout>;
        } else if (showTooltip) {
            component = (
                <Tooltip
                    className={classNames('nav-link-tooltip', {
                        'is-visible': this.state.isTextOverflowed && !isScrolling,
                    })}
                    isTabbable={false}
                    position="middle-right"
                    text={message}
                >
                    {linkComponent}
                </Tooltip>
            );
        }

        return onClickRemove ? (
            <div className="left-sidebar-removeable-link-container">
                {component}
                <RemoveButton onClickRemove={onClickRemove} removeButtonHtmlAttributes={removeButtonHtmlAttributes} />
            </div>
        ) : (
            component
        );
    }
}

export default LeftSidebarLink;
