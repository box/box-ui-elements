// @flow
import * as React from 'react';

import IconClose from '../../icons/general/IconClose';
import PrimaryButton from '../../components/primary-button';

import { bdlGray62 } from '../../styles/variables';
import Button from '../../components/button/Button';
import './ResponsiveMenuContainer.scss';

export type ResponsiveMenuProps = {
    buttonText?: string,
    children?: React.node,
    className?: string,
    onButtonClick?: func,
    onCloseClick?: func,
    reverseTitle: boolean,
    subtitle?: string,
    title?: string,
};

const ResponsiveMenuContainer = (props: ResponsiveMenuProps) => {
    const { children, title, subtitle, buttonText, reverseTitle, onButtonClick, onCloseClick, ...rest } = props;
    const primaryTitle = title && <div className="menu-header-title">{title}</div>;
    const secondaryTitle = subtitle && <div className="menu-header-subtitle">{subtitle}</div>;

    const titleComponents = [secondaryTitle, primaryTitle];

    const btnProps = {
        onClick: onButtonClick,
    };

    const closeBtnProps = {
        onClick: onCloseClick,
    };

    return (
        <div className="menu-container" {...rest}>
            <div className="menu-header">
                <div className="menu-header-text">{reverseTitle ? titleComponents.reverse() : titleComponents}</div>
                <div className="menu-header-right">
                    {buttonText && (
                        <PrimaryButton {...btnProps} className="menu-header-btn">
                            {buttonText}
                        </PrimaryButton>
                    )}
                    <Button {...closeBtnProps} className="menu-header-close-btn" type="button">
                        <IconClose color={bdlGray62} height={18} width={18} />
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default ResponsiveMenuContainer;
