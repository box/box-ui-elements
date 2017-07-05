/**
 * @flow
 * @file Button component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import omit from 'lodash.omit';
import LoadingIndicator from '../LoadingIndicator';
import { CLASS_BUTTON_CONTENT_SPAN } from '../../constants';
import './Button.scss';

type ButtonType = 'button' | 'reset' | 'submit';

type Props = {
    children?: any,
    className?: string,
    isDisabled?: boolean,
    isLoading?: boolean,
    isSelected?: boolean,
    onClick?: Function,
    type: ButtonType
};

type DefaultProps = {|
    type: ButtonType
|};

class Button extends PureComponent<DefaultProps, Props, void> {
    props: Props;

    static defaultProps = {
        type: 'button'
    };

    /**
     * Click handler for the button
     *
     * @private
     * @param {Event} event - click event
     * @return {void}
     */
    handleClick = (event: Event & { currentTarget: HTMLButtonElement }) => {
        const { isDisabled, onClick }: Props = this.props;
        const { currentTarget } = event;
        if (isDisabled || currentTarget.classList.contains('buik-btn-is-disabled')) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (onClick) {
            onClick(event);
        }
    };

    /**
     * Renders the button
     *
     * @private
     * @return {void}
     */
    render() {
        const {
            children,
            className = '',
            isDisabled,
            isLoading = false,
            isSelected,
            type,
            ...rest
        }: Props = this.props;

        const buttonProps = omit(rest, ['onClick']);
        if (isDisabled) {
            buttonProps['aria-disabled'] = true;
        }

        const styleClassName = classNames(
            'buik-btn',
            {
                'buik-btn-is-disabled': isDisabled,
                'buik-btn-is-loading': isLoading,
                'buik-btn-is-selected': isSelected
            },
            className
        );

        return (
            <button className={styleClassName} type={type} onClick={this.handleClick} {...buttonProps}>
                <span className={CLASS_BUTTON_CONTENT_SPAN}>{children}</span>
                {isLoading && <LoadingIndicator className='buik-btn-loading-indicator' />}
            </button>
        );
    }
}

export default Button;
