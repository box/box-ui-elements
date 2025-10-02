// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import IconInfo from '../../icons/general/IconInfo';

import Tooltip from '../tooltip';
import Label from '../label';
import PlainButton from '../plain-button';
import messages from './messages';
import './Select.scss';

type Props = {
    /** Input `<option />`'s */
    children?: React.Node,
    className?: string,
    error?: React.Node,
    infoIconProps?: Object,
    infoTooltip?: React.Node,
    isDisabled?: boolean,
    /** Label displayed for the input */
    label: React.Node,
    labelTooltip?: string,
    name: string,
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
        'bdl-is-disabled': isDisabled,
    });
    const [infoTooltipIsOpen, setInfoTooltipIsOpen] = React.useState(false);
    return (
        <div className={classes}>
            <Label hideLabel={!showLabel} text={label} tooltip={labelTooltip}>
                <Tooltip isShown={!!error} position="middle-right" text={error || ''} theme="error">
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
                                position="middle-right"
                                text={infoTooltip}
                            >
                                <PlainButton type="button" onClick={() => setInfoTooltipIsOpen(!infoTooltipIsOpen)}>
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
