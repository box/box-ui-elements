// @flow
import * as React from 'react';
import classNames from 'classnames';
import TetherComponent from 'react-tether';

import PlainButton from '../../components/plain-button';
import IconClose from '../../icons/general/IconClose';
import TETHER_POSITIONS from '../../common/tether-positions';

import type { TetherPosition } from '../../common/tether-positions';
import type { Callout } from './Callout';

import './styles/LeftSidebarLinkCallout.scss';

type Props = {
    attachmentPosition?: TetherPosition,
    callout: Callout,
    children: React.Node,
    isShown?: boolean,
    navLinkClassName?: string,
    targetAttachmentPosition?: TetherPosition,
};

type State = {
    isShown: boolean,
};

class LeftSidebarLinkCallout extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isShown: true };
    }

    hideCallout = () => {
        const { onClose } = this.props.callout;
        if (onClose) {
            onClose();
        }
        this.setState({ isShown: false });
    };

    isControlled = () => {
        const { isShown: isShownProp } = this.props;
        return typeof isShownProp !== 'undefined';
    };

    isShown = () => {
        const { isShown: isShownProp } = this.props;
        const isControlled = this.isControlled();

        const showTooltip = isControlled ? isShownProp : this.state.isShown;

        return showTooltip;
    };

    render() {
        const {
            attachmentPosition = TETHER_POSITIONS.MIDDLE_LEFT,
            children,
            callout: { content },
            navLinkClassName,
            targetAttachmentPosition = TETHER_POSITIONS.MIDDLE_RIGHT,
        } = this.props;

        const showTooltip = this.isShown();

        return (
            <TetherComponent
                attachment={attachmentPosition}
                classPrefix="nav-link-callout"
                enabled={showTooltip}
                targetAttachment={targetAttachmentPosition}
                renderTarget={ref => (
                    <div ref={ref} style={{ display: 'inline-block' }}>
                        {React.Children.only(children)}
                    </div>
                )}
                renderElement={ref => {
                    return showTooltip ? (
                        <div className={classNames('nav-link-callout', navLinkClassName)} ref={ref}>
                            <PlainButton className="nav-link-callout-close-button" onClick={this.hideCallout}>
                                <IconClose color="#fff" height={16} width={16} />
                            </PlainButton>
                            {content}
                        </div>
                    ) : null;
                }}
            />
        );
    }
}

export default LeftSidebarLinkCallout;
