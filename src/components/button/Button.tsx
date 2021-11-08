import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import LoadingIndicator from '../loading-indicator';
import RadarAnimation from '../radar';

export enum ButtonType {
    BUTTON = 'button',
    RESET = 'reset',
    SUBMIT = 'submit',
}
export interface ButtonProps {
    /** Child components for the button, generally localized text */
    children?: React.ReactNode;
    /** Custom class for the button */
    className: string;
    /** whether the button is disabled or not */
    isDisabled?: boolean;
    /** whether the button is loading or not */
    isLoading: boolean;
    /** whether the button is selected or not */
    isSelected?: boolean;
    /** onClick handler for the button */
    onClick?: Function;
    /** to set buttons inner ref */
    setRef?: Function;
    /** whether to show a radar */
    showRadar: boolean;
    /** type for the button */
    type: ButtonType;
}

class Button extends React.Component<ButtonProps> {
    btnElement: HTMLButtonElement | null = null;

    static defaultProps = {
        className: '',
        isLoading: false,
        showRadar: false,
        type: ButtonType.SUBMIT,
    };

    handleClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
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
        const { children, className, isDisabled, isLoading, isSelected, setRef, type, showRadar, ...rest } = this.props;
        const buttonProps: Record<string, boolean> = omit(rest, ['onClick']);
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
