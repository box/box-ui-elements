// @flow
import * as React from 'react';
import CompactCount from './CompactCount';

import './HeaderWithCount.scss';

type HeaderWithCountType = {
    title: string,
    totalCount?: number,
};

const isNumber = (count?: number): boolean %checks => typeof count === 'number';

const HeaderWithCount = ({ title, totalCount }: HeaderWithCountType) => (
    <div className="HeaderWithCount">
        <span className="HeaderWithCount-title">{title}</span>
        {isNumber(totalCount) ? <CompactCount className="HeaderWithCount-titleCount" count={totalCount} /> : null}
    </div>
);

export default HeaderWithCount;
