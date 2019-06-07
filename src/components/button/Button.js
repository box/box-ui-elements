// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import LoadingIndicator from '../loading-indicator';
import RadarAnimation from '../radar';

type Props = {
    /** Child components */
    children?: React.Node,
    /** Adds a class to the component */
    className?: string,
    isDisabled?: boolean,
    isLoading?: boolean,
    isSelected?: boolean,
    onClick?: Function,
    setRef?: Function,
    showRadar?: boolean,
    type?: 'button' | 'reset' | 'submit',
};

class Button extends React.Component<Props> {
    btnElement: ?HTMLButtonElement;

    handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
        const { isDisabled, onClick } = this.props;
        if (isDisabled || (this.btnElement && this.btnElement.classList.contains('is-disabled'))) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (onClick) {
            onClick(event);
        }
    };

    render() {
        const {
            children,
            className = '',
            isDisabled,
            isLoading = false,
            isSelected,
            setRef,
            type = 'submit',
            showRadar = false,
            ...rest
        } = this.props;

        const buttonProps = omit(rest, ['onClick']);
        if (isDisabled) {
            buttonProps['aria-disabled'] = true;
        }

        const styleClassName = classNames(
            'btn',
            {
                'is-disabled': isDisabled,
                'is-loading': isLoading,
                'is-selected': isSelected,
            },
            className,
        );

        let button = (
            // eslint-disable-next-line react/button-has-type
            <button
                ref={element => {
                    this.btnElement = element;
                    if (setRef) {
                        setRef(element);
                    }
                }}
                className={styleClassName}
                onClick={this.handleClick}
                type={type}
                {...buttonProps}
            >
                <span className="btn-content">{children}</span>
                {isLoading && <LoadingIndicator className="btn-loading-indicator" />}
            </button>
        );
        if (showRadar) {
            button = <RadarAnimation>{button}</RadarAnimation>;
        }

        return button;
    }
}

export default Button;
