/**
 * @flow
 * @file Versions Item Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { isActivateKey, isLeftClick, scrollIntoView } from '../../../utils/dom';
import { KEYS } from '../../../constants';

type Props = {
    children: React.Node,
    className: string,
    isDisabled: boolean,
    isSelected: boolean,
    onActivate: (event: SyntheticMouseEvent<HTMLDivElement> | SyntheticKeyboardEvent<HTMLDivElement>) => void,
};

class VersionsItemButton extends React.Component<Props> {
    buttonRef: ?HTMLDivElement;

    componentDidMount() {
        this.setScroll();
    }

    componentDidUpdate({ isSelected: prevIsSelected }: Props) {
        const { isSelected } = this.props;

        if (isSelected !== prevIsSelected) {
            this.setScroll();
        }
    }

    setButtonRef = (buttonRef: ?HTMLDivElement): void => {
        this.buttonRef = buttonRef;
    };

    setScroll = () => {
        const { isSelected } = this.props;

        if (this.buttonRef && isSelected) {
            scrollIntoView(this.buttonRef);
        }
    };

    render() {
        const { children, className, isDisabled, isSelected, onActivate } = this.props;
        const buttonClassName = classNames(className, {
            'bcs-is-disabled': isDisabled,
            'bcs-is-selected': isSelected,
        });

        return (
            <div
                aria-disabled={isDisabled}
                className={buttonClassName}
                data-resin-target="versions-item-button"
                data-testid="versions-item-button"
                onClick={event => {
                    if (isLeftClick(event)) {
                        onActivate(event);
                    }
                }}
                onKeyPress={event => {
                    if (isActivateKey(event)) {
                        if (event.key === KEYS.space) {
                            event.preventDefault(); // Prevent scroll on space key press
                        }

                        onActivate(event);
                    }
                }}
                ref={this.setButtonRef}
                role="button"
                tabIndex="0"
            >
                {children}
            </div>
        );
    }
}

export default VersionsItemButton;
