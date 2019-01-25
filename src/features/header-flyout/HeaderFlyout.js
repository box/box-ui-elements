// @flow
import * as React from 'react';
import { Flyout, Overlay } from 'components/flyout';
import ScrollWrapper from 'components/scroll-wrapper';
import type { FlyoutProps } from 'components/flyout/Flyout';
import './HeaderFlyout.scss';

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
};

class HeaderFlyout extends React.Component<Props> {
    static panelOffset = '-4px -2px';

    static defaultProps = {
        position: 'bottom-left',
    };

    render() {
        const { header, footer, flyoutButton, children, scrollRefFn, ...rest } = this.props;

        return (
            <Flyout closeOnClick={false} offset={HeaderFlyout.panelOffset} {...rest}>
                {flyoutButton}
                <Overlay className="header-flyout-overlay">
                    <div className="header-flyout-list-container">
                        {header && (
                            <div className="flyout-list-container-title">
                                <h4 className="flyout-list-title">{header}</h4>
                            </div>
                        )}
                        <div className="flyout-list-container-body">
                            {children != null && <ScrollWrapper scrollRefFn={scrollRefFn}>{children}</ScrollWrapper>}
                        </div>
                        {footer && <div className="flyout-list-container-footer">{footer}</div>}
                    </div>
                </Overlay>
            </Flyout>
        );
    }
}

export default HeaderFlyout;
