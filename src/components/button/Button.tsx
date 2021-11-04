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
    /** icon component, can be paired with children (text) or on its own */
    icon?: React.ReactElement;
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
    /** size of the button */
    size?: 'large' | null;
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
        const {
            children,
            className,
            icon,
            isDisabled,
            isLoading,
            isSelected,
            setRef,
            size,
            type,
            showRadar,
            ...rest
        } = this.props;
        const buttonProps: Record<string, boolean> = omit(rest, ['onClick']);
        if (isDisabled) {
            buttonProps['aria-disabled'] = true;
        }

        const hasIcon = !!icon;
        const hasText = !!children;

        const styleClassName = classNames(
            'btn',
            {
                'is-disabled': isDisabled,
                'is-loading': isLoading,
                'is-selected': isSelected,
                'bdl-is-large': size === 'large',
                'bdl-has-icon': hasIcon,
            },
            className,
        );

        const textContent = children ? <span className="btn-content">{children}</span> : null;
        let iconContent = null;
        if (icon) {
            // Size of text+icon is 16px, just icon is 20px
            const iconSize = hasIcon && hasText ? 16 : 20;
            const fixedSizeIcon = React.cloneElement<{ width: number; height: number }>(icon, {
                width: iconSize,
                height: iconSize,
            });
            iconContent = <span className="bdl-btn-icon">{fixedSizeIcon}</span>;
        }

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
                {textContent}
                {iconContent}
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
