import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@box/blueprint-web';
import CompactCount from './CompactCount';

import './HeaderWithCount.scss';

interface Props {
    isRedesignEnabled?: boolean;
    title: string;
    totalCount?: number;
}

function isNumber(count?: number): count is number {
    return typeof count === 'number';
}

function HeaderWithCount({ isRedesignEnabled, title, totalCount }: Props) {
    return (
        <div className={classNames(!isRedesignEnabled && 'HeaderWithCount')}>
            {isRedesignEnabled ? (
                <>
                    <Text as="span" variant="bodyDefaultSemibold" color="textOnLightSecondary">
                        {title}
                    </Text>
                    {isNumber(totalCount) && (
                        <CompactCount className="HeaderWithCount-titleCount" count={totalCount} isRedesignEnabled />
                    )}
                </>
            ) : (
                <>
                    <span className="HeaderWithCount-title">{title}</span>
                    {isNumber(totalCount) && <CompactCount className="HeaderWithCount-titleCount" count={totalCount} />}
                </>
            )}
        </div>
    );
}

export default HeaderWithCount;
