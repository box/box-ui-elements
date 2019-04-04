/**
 * @flow
 * @file Versions Item Button component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { KEYS } from '../../../constants';

type Props = {
    children: React.Node,
    className: string,
    isDisabled: boolean,
    isSelected: boolean,
    onClick: (event: SyntheticEvent<any>) => void,
};

const isClickEvent = event => {
    return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
};

const isKeyPressEvent = event => {
    return event.key === KEYS.enter || event.key === KEYS.space;
};

const VersionsItemButton = ({ children, className, isDisabled, isSelected, onClick }: Props) => {
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
                if (isClickEvent(event)) {
                    onClick(event);
                }
            }}
            onKeyPress={event => {
                if (isKeyPressEvent(event)) {
                    if (event.key === KEYS.space) {
                        event.preventDefault(); // Prevent scroll on space key press
                    }

                    onClick(event);
                }
            }}
            role="button"
            tabIndex="0"
        >
            {children}
        </div>
    );
};

export default VersionsItemButton;
