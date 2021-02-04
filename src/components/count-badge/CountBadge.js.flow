// @flow
import * as React from 'react';
import classNames from 'classnames';

import './CountBadge.scss';

type Props = {
    /** Additional class names to attach to the badge */
    className?: string,
    /** Should hide or show the count badge */
    isVisible?: boolean,
    /** Whether the icon should animate in or not */
    shouldAnimate?: boolean,
    /** string value to show within the badge (number or string) */
    value?: number | string,
};

// eslint-disable-next-line react/prefer-stateless-function
class CountBadge extends React.Component<Props> {
    static defaultProps = {
        isVisible: true,
        shouldAnimate: false,
        value: '',
    };

    render() {
        const { className, isVisible, value, shouldAnimate, ...rest } = this.props;

        return (
            <div
                aria-hidden="true"
                className={classNames(
                    'count-badge',
                    {
                        'is-visible': isVisible,
                        animate: shouldAnimate,
                    },
                    className,
                )}
                {...rest}
            >
                {value}
            </div>
        );
    }
}

export default CountBadge;
