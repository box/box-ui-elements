import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';
import { Text } from '@box/blueprint-web';

import { formatCount } from './numberUtils';

interface Props {
    className?: string;
    color?: 'textOnLightDefault' | 'textOnLightSecondary';
    count: number;
    intl: IntlShape;
    isRedesignEnabled?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    variant?: 'bodyLargeBold' | 'captionBold';
}

function CompactCount({
    className,
    color = 'textOnLightSecondary',
    count,
    intl,
    isRedesignEnabled,
    variant = 'captionBold',
    ...rest
}: Props) {
    const formattedCount = formatCount(count, intl);

    if (isRedesignEnabled) {
        return (
            <Text as="span" className={className} color={color} variant={variant} {...rest}>
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
