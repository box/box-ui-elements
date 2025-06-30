// @flow
import * as React from 'react';
import classNames from 'classnames';
import { Flyout, Overlay, OverlayHeader } from '../../components/flyout';
import ScrollWrapper from '../../components/scroll-wrapper';
import type { FlyoutProps } from '../../components/flyout/Flyout';

import './styles/HeaderFlyout.scss';

type Props = FlyoutProps & {
    /** Components to render in the overlay */
    children: ?React.Node,
    /** Set className to the overlay wrapper */
    className?: string,
    /** Custom button to trigger for opening/closing the flyout */
    flyoutButton: React.Element<any>,
    /** What content to display in the footer */
    footer?: React.Element<any>,
    /** What content to display in the header */
    header?: React.Element<any>,
    /** Optional function to get the scrollRef in parent components */
    scrollRefFn?: any => any,
    /** Are OverlayHeader actions enabled */
    isOverlayHeaderActionEnabled?: boolean,
};

class HeaderFlyout extends React.Component<Props> {
    static panelOffset = '-4px 0px';

    static defaultProps = {
        position: 'bottom-left',
    };

    render() {
        const {
            header,
            footer,
            flyoutButton,
            children,
            scrollRefFn,
            className,
            isOverlayHeaderActionEnabled = false,
            ...rest
        } = this.props;

        return (
            <Flyout
                className={classNames('header-flyout', className)}
                closeOnClick={false}
                constrainToWindow
                offset={HeaderFlyout.panelOffset}
                {...rest}
            >
                {flyoutButton}
                <Overlay className="header-flyout-overlay">
                    <OverlayHeader isOverlayHeaderActionEnabled={isOverlayHeaderActionEnabled}>
                        {header && <h4 className="header-flyout-title">{header}</h4>}
                    </OverlayHeader>
                    <div className="header-flyout-list-container">
                        <div
                            className={classNames('flyout-list-container-body', {
                                'with-header': !!header,
                                'with-footer': !!footer,
                            })}
                        >
                            {children != null && (
                                <ScrollWrapper scrollRefFn={scrollRefFn} shadowSize="contain">
                                    {children}
                                </ScrollWrapper>
                            )}
                        </div>
                        {footer && <div className="flyout-list-container-footer">{footer}</div>}
                    </div>
                </Overlay>
            </Flyout>
        );
    }
}

export default HeaderFlyout;
