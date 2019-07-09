// @flow
import * as React from 'react';
import classnames from 'classnames';
import IconEllipsis from '../../icons/general/IconEllipsis';
import { bdlGray62 } from '../../styles/variables';
import './Media.scss';

type Props = {
    /** Child elements */
    children: React.Node,
    /** Additional class names */
    className?: string,
};

function MediaMenu(props: Props) {
    const { className, children, ...rest } = props;
    return (
        <div className={classnames('bdl-Media-menu', className)} {...rest}>
            <IconEllipsis color={bdlGray62} height={16} width={16} />
        </div>
    );
}

export default MediaMenu;
