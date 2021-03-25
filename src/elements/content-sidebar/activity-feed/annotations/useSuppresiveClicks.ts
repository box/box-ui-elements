import * as React from 'react';

export type handlers<T> = {
    onClick: (event: React.SyntheticEvent<T>) => void;
    onMouseDown: (event: React.MouseEvent<T>) => void;
};

export type Props = {
    isDisabled: boolean;
    onClick: () => void;
};

export default function useSuppressiveClicks<T extends HTMLElement>({ isDisabled, onClick }: Props): handlers<T> {
    const handleClick = (event: React.SyntheticEvent<T>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS

        onClick();
    };

    const handleMouseDown = (event: React.MouseEvent<T>) => {
        if (isDisabled) {
            return;
        }

        // Prevents document event handlers from executing because box-annotations relies on
        // detecting mouse events on the document outside of annotation targets to determine when to
        // deselect annotations. This link also may represent that annotation target in the sidebar.
        event.nativeEvent.stopImmediatePropagation();
    };

    return {
        onClick: handleClick,
        onMouseDown: handleMouseDown,
    };
}
