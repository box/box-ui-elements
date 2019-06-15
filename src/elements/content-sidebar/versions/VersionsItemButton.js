/**
 * @flow
 * @file Versions Item Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
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

    buttonRef: { current: null | ?HTMLButtonElement } = React.createRef();

    componentDidMount() {
        this.setScroll();
    }

    componentDidUpdate({ isSelected: prevIsSelected }: Props) {
        const { isSelected } = this.props;

        if (isSelected !== prevIsSelected) {
            this.setScroll();
        }
    }

    setScroll = () => {
        const { isSelected } = this.props;
        const { current: buttonRef } = this.buttonRef;

        if (buttonRef && isSelected) {
            scrollIntoView(buttonRef);
        }
    };

    render() {
        const { children, fileId, isCurrent, isDisabled, isSelected, onClick } = this.props;
        const buttonClassName = classNames('bcs-VersionsItemButton', {
            'bcs-is-disabled': isDisabled,
            'bcs-is-selected': isSelected,
        });

        return (
            <button
                aria-disabled={isDisabled}
                className={buttonClassName}
                data-resin-iscurrent={isCurrent}
                data-resin-itemid={fileId}
                data-resin-target="select"
                data-testid="versions-item-button"
                onClick={event => {
                    if (isDisabled) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        onClick(event);
                    }
                }}
                ref={this.buttonRef}
                type="button"
            >
                {children}
            </button>
        );
    }
}

export default VersionsItemButton;
