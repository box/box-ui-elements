// @flow
import * as React from 'react';

import IconClose from '../../icons/general/IconClose';
import PrimaryButton from '../../components/primary-button';

import { bdlGray62 } from '../../styles/variables';
import Button from '../../components/button/Button';
import './ResponsiveMenuContainer.scss';

export type ResponsiveMenuProps = {
    buttonText?: string,
    children?: React.Node,
    className?: string,
    onButtonClick?: Function,
    onCloseClick?: Function,
    reverseTitle: boolean,
    subtitle?: string,
    title?: string,
};

const ResponsiveMenuContainer = (props: ResponsiveMenuProps) => {
    const { children, title, subtitle, buttonText, reverseTitle, onButtonClick, onCloseClick, ...rest } = props;
    const primaryTitle = title && <div className="rm-header-title">{title}</div>;
    const secondaryTitle = subtitle && <div className="rm-header-subtitle">{subtitle}</div>;

    const titleComponents = [secondaryTitle, primaryTitle];

    return (
        <div className="rm-container" {...rest}>
            <div className="rm-header">
                <div className="rm-header-text">{reverseTitle ? titleComponents.reverse() : titleComponents}</div>
                <div className="rm-header-right">
                    {buttonText && (
                        <PrimaryButton onClick={onButtonClick} className="rm-header-btn">
                            {buttonText}
                        </PrimaryButton>
                    )}
                    <Button onClick={onCloseClick} className="rm-header-close-btn" type="button">
                        <IconClose color={bdlGray62} height={18} width={18} />
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );
};

export default ResponsiveMenuContainer;
