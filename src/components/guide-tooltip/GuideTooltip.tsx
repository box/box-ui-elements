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
    icon?: React.ReactNode;
    step?: [number, number];
    primaryButton?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
    secondaryButton?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
};

function GuideTooltip({
    body,
    children,
    className = '',
    icon,
    isShown = true,
    primaryButton,
    step,
    secondaryButton,
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
                        {(secondaryButton || primaryButton || step) && (
                            <div className="bdl-GuideTooltip-bottom">
                                {(secondaryButton || primaryButton) && (
                                    <div className="bdl-GuideTooltip-navigation">
                                        {secondaryButton && (
                                            <Button
                                                {...secondaryButton}
                                                className={classNames(
                                                    'bdl-GuideTooltip-previousButton',
                                                    secondaryButton.className,
                                                )}
                                            />
                                        )}
                                        {primaryButton && (
                                            <Button
                                                {...primaryButton}
                                                className={classNames(
                                                    'bdl-GuideTooltip-nextButton',
                                                    primaryButton.className,
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                                {step && (
                                    <div className="bdl-GuideTooltip-step">
                                        <FormattedMessage
                                            {...messages.navigation}
                                            values={{ currentStepIndex: step[0], totalNumSteps: step[1] }}
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
