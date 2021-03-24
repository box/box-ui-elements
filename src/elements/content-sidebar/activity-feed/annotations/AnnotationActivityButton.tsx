import * as React from 'react';
import classNames from 'classnames';
import { decode } from '../../../../utils/keys';

export type Props = {
    children: React.ReactNode;
    className: string;
    isDisabled?: boolean;
    onSelect: () => void;
};

const AnnotationActivityButton = ({
    children,
    className,
    isDisabled = false,
    onSelect,
    ...rest
}: Props): JSX.Element => {
    const ref = React.useRef<HTMLDivElement | null>(null);

    const handleClick = (event: React.SyntheticEvent<HTMLDivElement>) => {
        if (isDisabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS

        onSelect();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (isDisabled) {
            return;
        }

        const key = decode(event);

        if (key === 'Space' || key === 'Enter') {
            onSelect();
        }
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDisabled) {
            return;
        }

        // Prevents document event handlers from executing because box-annotations relies on
        // detecting mouse events on the document outside of annotation targets to determine when to
        // deselect annotations. This link also may represent that annotation target in the sidebar.
        event.nativeEvent.stopImmediatePropagation();
    };

    return (
        <div
            ref={ref}
            aria-disabled={isDisabled}
            className={classNames('bcs-AnnotationActivityButton', className)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            role="button"
            tabIndex={0}
            {...rest}
        >
            {children}
        </div>
    );
};

export default AnnotationActivityButton;
