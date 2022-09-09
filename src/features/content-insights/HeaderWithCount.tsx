import * as React from 'react';
import CompactCount from './CompactCount';

import './HeaderWithCount.scss';

interface Props {
    title: string;
    totalCount?: number;
}

function isNumber(count?: number): count is number {
    return typeof count === 'number';
}

function HeaderWithCount({ title, totalCount }: Props) {
    return (
        <div className="HeaderWithCount">
            <span className="HeaderWithCount-title">{title}</span>
            {isNumber(totalCount) ? <CompactCount className="HeaderWithCount-titleCount" count={totalCount} /> : null}
        </div>
    );
}

export default HeaderWithCount;
