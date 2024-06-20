import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Tooltip, { TooltipTheme } from '../tooltip';
import Button from '../button';
// @ts-ignore flow import
import messages from './messages';

import './ProductTourTooltip.scss';

type TooltipProps = Omit<JSX.LibraryManagedAttributes<typeof Tooltip, Tooltip['props']>, 'text' | 'theme'>;

type Props = TooltipProps & {
    body: ReactNode;
    /** A React component representing the image */
    image?: ReactNode;
    /** displays guide progress e.g. 1 of 4 */
    steps?: [number, number];
    primaryButtonProps?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
    secondaryButtonProps?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
};

function ProductTourTooltip({
    body,
    children,
    className = '',
    image,
    isShown = true,
    primaryButtonProps,
    steps,
    secondaryButtonProps,
    showCloseButton = true,
    ...rest
}: Props) {
    return (
        <Tooltip
            {...rest}
            className={`bdl-ProductTourTooltip ${className}`}
            isShown={isShown}
            showCloseButton={showCloseButton}
            text={
                <>
                    {image && <div className="bdl-ProductTourTooltip-image">{image}</div>}
                    <div className="bdl-ProductTourTooltip-content">
                        <div className="bdl-ProductTourTooltip-body">{body}</div>
                        {(secondaryButtonProps || primaryButtonProps || steps) && (
                            <div className="bdl-ProductTourTooltip-bottom">
                                {steps && (
                                    <div className="bdl-TourTooltip-steps">
                                        <FormattedMessage
                                            {...messages.navigation}
                                            values={{ currentStepIndex: steps[0], totalNumSteps: steps[1] }}
                                        />
                                    </div>
                                )}
                                {(secondaryButtonProps || primaryButtonProps) && (
                                    <div className="bdl-ProductTourTooltip-navigation">
                                        {secondaryButtonProps && (
                                            <Button
                                                {...secondaryButtonProps}
                                                className={classNames(
                                                    'bdl-ProductTourTooltip-previousButton',
                                                    secondaryButtonProps.className,
                                                )}
                                            />
                                        )}
                                        {primaryButtonProps && (
                                            <Button
                                                {...primaryButtonProps}
                                                className={classNames(
                                                    'bdl-ProductTourTooltip-nextButton',
                                                    primaryButtonProps.className,
                                                )}
                                            />
                                        )}
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

export default ProductTourTooltip;
