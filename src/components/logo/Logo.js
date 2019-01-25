// @flow
import * as React from 'react';

import { BOX_BLUE } from 'common/variables';
import IconLogo from '../../icons/general/IconLogo';

type Props = {
    color?: string,
    height?: number,
    width?: number,
    title?: string | React.Element<any>,
};

const Logo = ({ color = BOX_BLUE, height = 25, width = 45, title }: Props) => (
    <div className="logo">
        <IconLogo color={color} height={height} width={width} title={title} />
    </div>
);

export default Logo;
