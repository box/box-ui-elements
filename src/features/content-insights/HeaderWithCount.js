// @flow
import * as React from 'react';
import CompactCount from './CompactCount';

import './HeaderWithCount.scss';

type Props = {
    title: string,
    totalCount?: number,
};

function isNumber(count?: number): boolean %checks {
    return typeof count === 'number';
}

export default function HeaderWithCount({ title, totalCount }: Props) {
    return (
        <div className="HeaderWithCount">
            <span className="HeaderWithCount-title">{title}</span>
            {isNumber(totalCount) ? <CompactCount className="HeaderWithCount-titleCount" count={totalCount} /> : null}
        </div>
    );
}
