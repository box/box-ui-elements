// @flow
import React from 'react';

import './FullscreenFlyout.scss';
import classNames from 'classnames';
import { Flyout, Overlay } from '../flyout';
import OverlayHeader from './OverlayHeader';

export type FullscreenFlyoutProps = {
    /** Components to render in the overlay */
    children: React.Node,
    /** Set className to the overlay wrapper */
    className?: string,
    /** Custom <OverlayHeader> */
    header?: React.Node,
    /** CSS selector that identifies additional clickable elements that closes the overlay */
    onCloseClassSelector?: string,
};

type Props = FullscreenFlyoutProps;

const FullscreenFlyout = (props: Props = { className: '', onCloseClassSelector: '' }) => {
    const { children, className, header, onCloseClassSelector, ...rest } = props;

    const elements = React.Children.toArray(children);

    if (elements.length !== 2) {
        throw new Error('FullscreenFlyout must have exactly two children: A button component and a content element');
    }

    const [button, content] = elements;

    // Close flyout button in header should be clickable by default if using selector override
    const clickableSelector = `.close-btn, ${onCloseClassSelector}`;

    return (
        <Flyout
            disableTether
            onCloseClick
            clickableOverrideSelector={clickableSelector}
            className={classNames('fullscreen-flyout', className)}
            {...rest}
        >
            {button}
            <Overlay>
                {header || <OverlayHeader />}
                {content}
            </Overlay>
        </Flyout>
    );
};

export default FullscreenFlyout;
