// @flow
import * as React from 'react';
import TetherComponent from 'react-tether';

import PlainButton from '../../components/plain-button';
import IconClose from '../../icons/general/IconClose';

import type { Callout } from './Callout';

import './styles/LeftSidebarLinkCallout.scss';

type Props = {
    callout: Callout,
    children: React.Node,
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
            children,
            callout: { content },
        } = this.props;

        const { isShown } = this.state;

        return (
            <TetherComponent attachment="middle left" classPrefix="nav-link-callout" targetAttachment="middle right">
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
