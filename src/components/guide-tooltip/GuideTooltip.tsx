import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Tooltip, { TooltipTheme } from '../tooltip';
import Button from '../button';
import messages from './messages';

import './GuideTooltip.scss';

type TooltipProps = Omit<JSX.LibraryManagedAttributes<typeof Tooltip, Tooltip['props']>, 'text' | 'theme'>;

type Props = TooltipProps & {
    body: React.ReactNode;
    title?: React.ReactNode;
    /** 32px x 32px */
    icon?: React.ReactNode;
    /** displays guide progress e.g. 1 of 4 */
    steps?: [number, number];
    primaryButtonProps?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
    secondaryButtonProps?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
};

function GuideTooltip({
    body,
    children,
    className = '',
    icon,
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
