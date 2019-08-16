/**
 * @flow
 * @file Versions Item Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from '../../../components/plain-button';
import { scrollIntoView } from '../../../utils/dom';
import './VersionsItemButton.scss';

type Props = {
    children: React.Node,
    fileId: string,
    isCurrent: boolean,
    isDisabled: boolean,
    isSelected: boolean,
    onClick: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
};

class VersionsItemButton extends React.Component<Props> {
    static defaultProps = {
        isCurrent: false,
        isDisabled: false,
        isSelected: false,
    };

    buttonRef: ?HTMLButtonElement;

    componentDidMount() {
        this.setScroll();
    }

    componentDidUpdate({ isSelected: prevIsSelected }: Props) {
        const { isSelected } = this.props;

        if (isSelected !== prevIsSelected) {
            this.setScroll();
        }
    }

    setButtonRef = (buttonRef: ?HTMLButtonElement): void => {
        this.buttonRef = buttonRef;
    };

    setScroll = () => {
        const { isSelected } = this.props;

        if (this.buttonRef && isSelected) {
            scrollIntoView(this.buttonRef);
        }
    };

    render() {
        const { children, fileId, isCurrent, isDisabled, isSelected, onClick } = this.props;
        const buttonClassName = classNames('bcs-VersionsItemButton', {
            'bcs-is-disabled': isDisabled,
            'bcs-is-selected': isSelected && !isDisabled,
        });

        return (
            <PlainButton
                aria-disabled={isDisabled}
                className={buttonClassName}
                data-resin-iscurrent={isCurrent}
                data-resin-itemid={fileId}
                data-resin-target="select"
                data-testid="versions-item-button"
                getDOMRef={this.setButtonRef}
                isDisabled={isDisabled}
                onClick={onClick}
                type="button"
            >
                {children}
            </PlainButton>
        );
    }
}

export default VersionsItemButton;
