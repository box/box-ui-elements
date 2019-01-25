// @flow
import React from 'react';

import BaseSelectField from './BaseSelectField';

type Props = {
    /** Function will be called with an array of all selected options after user selects a new option */
    onChange: Function,
};

const MultiSelectField = ({ ...rest }: Props) => <BaseSelectField {...rest} multiple />;

export default MultiSelectField;
