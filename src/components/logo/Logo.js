// @flow
import * as React from 'react';

import { BOX_BLUE } from '../../common/variables';
import IconLogo from '../../icons/general/IconLogo';

type Props = {
    color?: string,
    height?: number,
    title?: string | React.Element<any>,
    width?: number,
};

const Logo = ({ color = BOX_BLUE, height = 25, width = 45, title }: Props) => (
    <div className="logo">
        <IconLogo color={color} height={height} title={title} width={width} />
    </div>
);

export default Logo;
