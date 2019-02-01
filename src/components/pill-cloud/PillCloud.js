// @flow
import React from 'react';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import Button from '../button';

type Option = { text: string, value: number | string };

type Props = {
    buttonProps?: Object,
    onSelect?: Function,
    options: Array<Option>,
    selectedOptions?: Array<Option>,
};

const PillCloud = ({ options, onSelect, selectedOptions = [], buttonProps = {} }: Props) => (
    <div className="pill-cloud-container">
        {options &&
            options.map(option => (
                <Button
                    key={option.value}
                    className={classNames('pill', 'pill-cloud-button', {
                        'is-selected': selectedOptions.find(op => isEqual(op, option)),
                    })}
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
