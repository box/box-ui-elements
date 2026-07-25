// @flow
import * as React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import Button from '../button';
import type { Option } from '../pill-selector-dropdown/flowTypes';

type Props = {
    buttonProps?: Object,
    onSelect?: Function,
    options: Array<Option>,
    selectedOptions?: Array<Option>,
};

const PillCloud = ({ options, onSelect, selectedOptions = [], buttonProps = {} }: Props) => (
    <div className="bdl-PillCloud pill-cloud-container">
        {options &&
            options.map(option => (
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
