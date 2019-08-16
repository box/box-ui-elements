// @flow
import * as React from 'react';

import { bdlBoxBlue } from '../../styles/variables';
import IconLogo from '../../icons/general/IconLogo';

type Props = {
    color?: string,
    height?: number,
    title?: string | React.Element<any>,
    width?: number,
};

const Logo = ({ color = bdlBoxBlue, height = 25, width = 45, title }: Props) => (
    <div className="logo">
        <IconLogo color={color} height={height} title={title} width={width} />
    </div>
);

export default Logo;
