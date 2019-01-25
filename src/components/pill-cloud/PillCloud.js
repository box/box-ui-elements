// @flow
import React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import Button from '../button';

type Option = { text: string, value: number | string };

type Props = {
    options: Array<Option>,
    onSelect?: Function,
    selectedOptions?: Array<Option>,
    buttonProps?: Object,
};

const PillCloud = ({ options, onSelect, selectedOptions = [], buttonProps = {} }: Props) => (
    <div className="pill-cloud-container">
        {options &&
            options.map(option => (
                <Button
                    className={classNames('pill', 'pill-cloud-button', {
                        'is-selected': selectedOptions.find(op => isEqual(op, option)),
                    })}
                    key={option.value}
                    onClick={onSelect ? () => onSelect(option) : undefined}
                    {...buttonProps}
                >
                    {option.text}
                </Button>
            ))}
    </div>
);

export type PillOption = Option;
export default PillCloud;
