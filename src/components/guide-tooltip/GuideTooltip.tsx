import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Tooltip, { TooltipTheme } from '../tooltip';
import Button from '../button';
// @ts-ignore flow import
import messages from './messages';

import './GuideTooltip.scss';

type TooltipProps = Omit<React.ComponentPropsWithoutRef<typeof Tooltip>, 'text' | 'theme'>;

type Props = TooltipProps & {
    body: React.ReactNode;
    title?: React.ReactNode;
    /** 32px x 32px */
    icon?: React.ReactNode;
    /** A React component representing the image, cannot be used together with icon */
    image?: React.ReactNode;
    /** displays guide progress e.g. 1 of 4 */
    steps?: [number, number];
    primaryButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
    secondaryButtonProps?: React.ComponentPropsWithoutRef<typeof Button>;
};

function GuideTooltip({
    body,
    children,
    className = '',
    icon,
    image,
    isShown = true,
    primaryButtonProps,
    steps,
    secondaryButtonProps,
    showCloseButton = true,
    title,
    ...rest
}: Props) {
    return (
        <Tooltip
            {...rest}
            className={`bdl-GuideTooltip ${className}`}
            isShown={isShown}
            showCloseButton={showCloseButton}
            text={
                <>
                    {icon && <div className="bdl-GuideTooltip-icon">{icon}</div>}
                    <div className="bdl-GuideTooltip-right">
                        {title && <div className="bdl-GuideTooltip-title">{title}</div>}
                        {!icon && image && <div className="bdl-GuideTooltip-image">{image}</div>}
                        <div className="bdl-GuideTooltip-body">{body}</div>
                        {(secondaryButtonProps || primaryButtonProps || steps) && (
                            <div className="bdl-GuideTooltip-bottom">
                                {(secondaryButtonProps || primaryButtonProps) && (
                                    <div className="bdl-GuideTooltip-navigation">
                                        {secondaryButtonProps && (
                                            <Button
                                                {...secondaryButtonProps}
                                                className={classNames(
                                                    'bdl-GuideTooltip-previousButton',
                                                    secondaryButtonProps.className,
                                                )}
                                            />
                                        )}
                                        {primaryButtonProps && (
                                            <Button
                                                {...primaryButtonProps}
                                                className={classNames(
                                                    'bdl-GuideTooltip-nextButton',
                                                    primaryButtonProps.className,
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                                {steps && (
                                    <div className="bdl-GuideTooltip-steps">
                                        <FormattedMessage
                                            {...messages.navigation}
                                            values={{ currentStepIndex: steps[0], totalNumSteps: steps[1] }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            }
            theme={TooltipTheme.CALLOUT}
        >
            {children}
        </Tooltip>
    );
}

export default GuideTooltip;
