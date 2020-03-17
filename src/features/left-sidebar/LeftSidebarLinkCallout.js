// @flow
import * as React from 'react';
import TetherComponent from 'react-tether';

import PlainButton from '../../components/plain-button';
import IconClose from '../../icons/general/IconClose';

import type { Callout } from './Callout';

import './styles/LeftSidebarLinkCallout.scss';

type Props = {
    attachmentPosition?: string,
    callout: Callout,
    children: React.Node,
    targetAttachmentPosition?: string,
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

    render() {
        const {
            attachmentPosition = 'middle left',
            children,
            callout: { content },
            targetAttachmentPosition = 'middle right',
        } = this.props;

        const { isShown } = this.state;

        return (
            <TetherComponent
                attachment={attachmentPosition}
                classPrefix="nav-link-callout"
                targetAttachment={targetAttachmentPosition}
            >
                {React.Children.only(children)}
                {isShown && (
                    <div className="nav-link-callout">
                        <PlainButton className="nav-link-callout-close-button" onClick={this.hideCallout}>
                            <IconClose color="#fff" height={16} width={16} />
                        </PlainButton>
                        {content}
                    </div>
                )}
            </TetherComponent>
        );
    }
}

export default LeftSidebarLinkCallout;
