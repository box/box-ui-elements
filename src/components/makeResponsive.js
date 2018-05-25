/**
 * @flow
 * @file HOC to make responsive Box UI Elements
 * @author Box
 */

import * as React from 'react';
import Measure from 'react-measure';
import classNames from 'classnames';
import { SIZE_LARGE, SIZE_MEDIUM, SIZE_SMALL, CLASS_IS_SMALL, CLASS_IS_TOUCH, CLASS_IS_MEDIUM } from '../constants';

type Props = {
    isTouch: boolean,
    size?: Size,
    className: string,
    componentRef?: Function
};

type State = {
    size: Size
};

const CROSS_OVER_WIDTH_SMALL = 600;
const CROSS_OVER_WIDTH_MEDIUM = 800;
const HAS_TOUCH = !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

function makeResponsive(Wrapped: React.ComponentType<any>): React.ComponentType<any> {
    return class extends React.PureComponent<Props, State> {
        props: Props;
        state: State;

        static defaultProps = {
            className: '',
            isTouch: HAS_TOUCH
        };

        /**
         * [constructor]
         *
         * @param {*} data
         * @return {void}
         */
        constructor(props: Props) {
            super(props);
            this.state = {
                size: props.size || SIZE_LARGE
            };
        }

        /**
         * Resizing function
         *
         * @private
         * @param {Component} react component
         * @return {void}
         */
        onResize = ({ bounds: { width } }: { bounds: ClientRect }) => {
            let size = SIZE_LARGE;
            if (width <= CROSS_OVER_WIDTH_SMALL) {
                size = SIZE_SMALL;
            } else if (width <= CROSS_OVER_WIDTH_MEDIUM) {
                size = SIZE_MEDIUM;
            }
            this.setState({ size });
        };

        /**
         * Renders the Box UI Element
         *
         * @private
         * @inheritdoc
         * @return {Element}
         */
        render() {
            const { isTouch, size, className, componentRef, ...rest }: Props = this.props;
            let isSmall: boolean = size === SIZE_SMALL;
            let isLarge: boolean = size === SIZE_LARGE;
            let isMedium: boolean = size === SIZE_MEDIUM;
            const isResponsive: boolean = !isSmall && !isLarge && !isMedium;

            if ((isSmall && isLarge) || (isSmall && isMedium) || (isMedium && isLarge)) {
                throw new Error('Box UI Element cannot be small or large or medium at the same time');
            }

            if (!isResponsive) {
                return (
                    <Wrapped
                        ref={componentRef}
                        isTouch={isTouch}
                        isSmall={isSmall}
                        isLarge={isLarge}
                        isMedium={isMedium}
                        className={className}
                        {...rest}
                    />
                );
            }

            const { size: sizeFromState }: State = this.state;
            isSmall = sizeFromState === SIZE_SMALL;
            isMedium = sizeFromState === SIZE_MEDIUM;
            isLarge = sizeFromState === SIZE_LARGE;
            const styleClassName = classNames(
                {
                    [CLASS_IS_SMALL]: isSmall,
                    [CLASS_IS_MEDIUM]: isMedium,
                    [CLASS_IS_TOUCH]: isTouch
                },
                className
            );

            return (
                <Measure bounds onResize={this.onResize}>
                    {({ measureRef }) => (
                        <Wrapped
                            ref={componentRef}
                            isTouch={isTouch}
                            isSmall={isSmall}
                            isLarge={isLarge}
                            isMedium={isMedium}
                            measureRef={measureRef}
                            className={styleClassName}
                            {...rest}
                        />
                    )}
                </Measure>
            );
        }
    };
}

export default makeResponsive;
