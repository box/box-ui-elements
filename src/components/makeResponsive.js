/**
 * @flow
 * @file HOC to make responsive Box UI Elements
 * @author Box
 */

import React, { PureComponent } from 'react';
import Measure from 'react-measure';
import classNames from 'classnames';
import { SIZE_LARGE, SIZE_SMALL, CLASS_IS_COMPACT, CLASS_IS_TOUCH } from '../constants';
import type { Size, ClassComponent } from '../flowTypes';

type Props = {
    isTouch: boolean,
    size: Size,
    className: string,
    componentRef: Function
};

type State = {
    size: Size
};

const HAS_TOUCH = 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch);

function makeResponsive(Wrapped: ClassComponent<any, any>, crossoverWidth: number = 600): ClassComponent<any, any> {
    return class extends PureComponent<Props, State> {
        props: Props;
        state: State;

        static defaultProps = {
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
            this.setState({
                size: width <= crossoverWidth ? SIZE_SMALL : SIZE_LARGE
            });
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
            const isResponsive: boolean = !isSmall && !isLarge;

            if (isSmall && isLarge) {
                throw new Error('Box UI Element cannot be both small and large');
            }

            if (!isResponsive) {
                return (
                    <Wrapped
                        ref={componentRef}
                        isTouch={isTouch}
                        isSmall={isSmall}
                        isLarge={isLarge}
                        className={className}
                        {...rest}
                    />
                );
            }

            const { size: sizeFromState }: State = this.state;
            isSmall = sizeFromState === SIZE_SMALL;
            isLarge = sizeFromState === SIZE_LARGE;
            const styleClassName = classNames(
                {
                    [CLASS_IS_COMPACT]: isSmall,
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
