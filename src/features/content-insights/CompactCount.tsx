import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';
import { Text } from '@box/blueprint-web';

import { formatCount } from './numberUtils';

interface Props {
    className?: string;
    count: number;
    intl: IntlShape;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    isRedesignEnabled?: boolean;
}

function CompactCount({ className, count, intl, isRedesignEnabled, ...rest }: Props) {
    const formattedCount = formatCount(count, intl);

    if (isRedesignEnabled) {
        return (
            <Text
                as="span"
                variant="bodyDefaultSemibold"
                color="textOnLightSecondary"
                className={classNames('CompactCount', className)}
                {...rest}
            >
                {formattedCount}
            </Text>
        );
    }

    return (
        <span className={classNames('CompactCount', className)} {...rest}>
            {formatCount(count, intl)}
        </span>
    );
}

export default injectIntl(CompactCount);
