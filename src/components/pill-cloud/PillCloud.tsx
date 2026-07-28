import * as React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import Button from '../button';
import { ButtonProps } from '../button/Button';

export interface PillCloudOption {
    /** Text shown on the pill */
    displayText: string;
    id?: string;
    /** Value used as the pill key and resin target */
    value: string | number | null;
}

export interface PillCloudProps {
    /** Props forwarded to each pill Button */
    buttonProps?: Partial<ButtonProps> & Record<string, unknown>;
    /** Called with the option when a pill is clicked */
    onSelect?: (option: PillCloudOption) => void;
    /** Options to render as pills */
    options: Array<PillCloudOption>;
    /** Currently selected options */
    selectedOptions?: Array<PillCloudOption>;
}

const PillCloud = ({ options, onSelect, selectedOptions = [], buttonProps = {} }: PillCloudProps) => (
    <div className="bdl-PillCloud pill-cloud-container">
        {options?.map(option => (
            <Button
                key={option.value}
                className={classNames('bdl-Pill', 'bdl-PillCloud-button', 'pill', 'pill-cloud-button', {
                    'is-selected': selectedOptions.find(op => isEqual(op, option)),
                })}
                onClick={onSelect ? () => onSelect(option) : undefined}
                data-resin-target={option.value}
                {...buttonProps}
            >
                {option.displayText}
            </Button>
        ))}
    </div>
);

export default PillCloud;
