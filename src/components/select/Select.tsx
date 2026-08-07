import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import IconInfo from '../../icons/general/IconInfo';
import type { Icon } from '../../icons/iconTypes';

import { ButtonType } from '../button';
import Tooltip, { TooltipPosition, TooltipTheme } from '../tooltip';
import Label from '../label';
import PlainButton from '../plain-button';
import messages from './messages';
import './Select.scss';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Input `<option />`'s */
    children?: React.ReactNode;
    /** Custom class name for the select container */
    className?: string;
    /** Error displayed in a tooltip */
    error?: React.ReactNode;
    /** Props forwarded to the information icon */
    infoIconProps?: Partial<Icon> & Record<string, unknown>;
    /** Content displayed in the information tooltip */
    infoTooltip?: React.ReactNode;
    /** Whether the select is disabled */
    isDisabled?: boolean;
    /** Label displayed for the input */
    label: React.ReactNode;
    /** Tooltip displayed for the label */
    labelTooltip?: string;
    /** Name of the select input */
    name?: string;
    /** Handler for the change event on the select element */
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    /** Whether to show the error outline without error content */
    showErrorOutline?: boolean;
    /** Whether to visibly display the label */
    showLabel?: boolean;
}

const Select = ({
    children,
    className = '',
    error,
    infoTooltip,
    infoIconProps,
    isDisabled,
    label,
    name,
    labelTooltip,
    onChange,
    showErrorOutline = false,
    showLabel = true,
    ...rest
}: SelectProps) => {
    const classes = classNames(className, 'select-input-container', {
        'show-error': !!error || showErrorOutline,
        'is-disabled': isDisabled,
        'bdl-is-disabled': isDisabled,
    });
    const [infoTooltipIsOpen, setInfoTooltipIsOpen] = useState(false);
    return (
        <div className={classes}>
            <Label hideLabel={!showLabel} text={label} tooltip={labelTooltip}>
                <Tooltip
                    isShown={!!error}
                    position={TooltipPosition.MIDDLE_RIGHT}
                    text={error || ''}
                    theme={TooltipTheme.ERROR}
                >
                    <span className="select-container">
                        <span className="select-container-inner">
                            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                            <select disabled={isDisabled} name={name} onChange={onChange} {...rest}>
                                {children}
                            </select>
                            <span className="select-overlay" />
                        </span>
                        {infoTooltip && (
                            <Tooltip
                                targetWrapperClassName="tooltip-icon-container"
                                isShown={infoTooltipIsOpen}
                                position={TooltipPosition.MIDDLE_RIGHT}
                                text={infoTooltip}
                            >
                                <PlainButton
                                    type={ButtonType.BUTTON}
                                    onClick={() => setInfoTooltipIsOpen(!infoTooltipIsOpen)}
                                >
                                    <IconInfo
                                        height={16}
                                        width={16}
                                        title={<FormattedMessage {...messages.moreInfo} />}
                                        {...infoIconProps}
                                    />
                                </PlainButton>
                            </Tooltip>
                        )}
                    </span>
                </Tooltip>
            </Label>
        </div>
    );
};

export default Select;
