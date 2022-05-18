// @flow
import * as React from 'react';

import DatalistItem from '../datalist-item';
import type { Option } from './flowTypes';

function defaultDropdownRenderer(options: Array<Option>): React.Node {
    return options.map(({ displayText, value }: Option) => <DatalistItem key={value}>{displayText}</DatalistItem>);
}

export default defaultDropdownRenderer;
