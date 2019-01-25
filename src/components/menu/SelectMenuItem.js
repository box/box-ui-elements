// @flow
import * as React from 'react';

import MenuItem from './MenuItem';

type Props = {
    children: React.Node,
};

const SelectMenuItem = (props: Props) => <MenuItem isSelectItem {...props} />;

export default SelectMenuItem;
