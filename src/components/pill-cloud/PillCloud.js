// @flow
import React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
// $FlowFixMe migrated to TS
import Button from '../button'; // eslint-disable-line
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
                    {...buttonProps}
                >
                    {option.displayText}
                </Button>
            ))}
    </div>
);

export default PillCloud;
