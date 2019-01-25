// @flow
import * as React from 'react';
import classNames from 'classnames';

import IconInfo from '../../icons/general/IconInfo';

import Tooltip from '../tooltip';
import Label from '../label';

import './Select.scss';

type Props = {
    /** Input `<option />`'s */
    children?: React.Node,
    className?: string,
    error?: React.Node,
    infoTooltip?: React.Node,
    infoIconProps?: Object,
    isDisabled?: boolean,
    /** Label displayed for the input */
    label: React.Node,
    name: string,
    labelTooltip?: string,
    /** Handler for the change event on the select element */
    onChange?: Function,
    showErrorOutline?: boolean,
    showLabel?: boolean,
};

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
}: Props) => {
    const classes = classNames(className, 'select-input-container', {
        'show-error': !!error || showErrorOutline,
        'is-disabled': isDisabled,
    });

    return (
        <div className={classes}>
            <Label hideLabel={!showLabel} text={label} tooltip={labelTooltip}>
                <Tooltip isShown={!!error} text={error || ''} position="middle-right" theme="error">
                    <span className="select-container">
                        <span className="select-container-inner">
                            <select name={name} disabled={isDisabled} onChange={onChange} {...rest}>
                                {children}
                            </select>
                            <span className="select-overlay" />
                        </span>
                        {infoTooltip && (
                            <Tooltip text={infoTooltip} position="middle-right">
                                <span className="tooltip-icon-container">
                                    <IconInfo height={16} width={16} {...infoIconProps} />
                                </span>
                            </Tooltip>
                        )}
                    </span>
                </Tooltip>
            </Label>
        </div>
    );
};

export default Select;
