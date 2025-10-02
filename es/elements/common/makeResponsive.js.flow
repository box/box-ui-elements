/**
 * @flow
 * @file HOC to make responsive Box UI Elements
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import Measure from 'react-measure';
import classNames from 'classnames';
import {
    CLASS_IS_MEDIUM,
    CLASS_IS_SMALL,
    CLASS_IS_TOUCH,
    SIZE_LARGE,
    SIZE_MEDIUM,
    SIZE_SMALL,
    SIZE_VERY_LARGE,
} from '../../constants';
import type { Size } from '../../common/types/core';

type PropsShape = {
    className: string,
    componentRef?: Function,
    isTouch: boolean,
    size?: Size,
};

type State = {
    size: Size,
};

const CROSS_OVER_WIDTH_SMALL = 700;
const CROSS_OVER_WIDTH_MEDIUM = 1000;
const CROSS_OVER_WIDTH_LARGE = 1500;
const HAS_TOUCH = !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

function makeResponsive<Props: PropsShape>(Wrapped: React.ComponentType<any>): React.ComponentType<any> {
    return class extends React.PureComponent<Props, State> {
        props: Props;

        state: State;

        innerElement: ?HTMLElement;

        static defaultProps = {
            className: '',
            isTouch: HAS_TOUCH,
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
                size: props.size || this.getSize(window.innerWidth),
            };
        }

        /**
         * Calculates the new size
         *
         * @private
         * @param {Component} react component
         * @return {void}
         */
        getSize(width: number) {
            let size = SIZE_VERY_LARGE;
            if (width <= CROSS_OVER_WIDTH_SMALL) {
                size = SIZE_SMALL;
            } else if (width <= CROSS_OVER_WIDTH_MEDIUM) {
                size = SIZE_MEDIUM;
            } else if (width <= CROSS_OVER_WIDTH_LARGE) {
                size = SIZE_LARGE;
            }

            return size;
        }

        /**
         * Resizing function
         *
         * @private
         * @param {Component} react component
         * @return {void}
         */
        onResize = debounce(({ bounds: { width } }: { bounds: ClientRect }) => {
            this.setState({ size: this.getSize(width) });
        }, 500);

        /**
         * Callback function for setting the ref which measureRef is attached to
         *
         * @return {void}
         */
        innerRef = el => {
            this.innerElement = el;
        };

        /**
         * Gets the ref element which measureRef is attached to
         *
         * @return {?HTMLElement} - the HTML element
         */
        getInnerElement = () => this.innerElement;

        /**
         * Renders the Box UI Element
         *
         * @private
         * @inheritdoc
         * @return {Element}
         */
        render() {
            const { isTouch, size, className, componentRef, ...rest }: Props = this.props;

            let isLarge: boolean = size === SIZE_LARGE;
            let isMedium: boolean = size === SIZE_MEDIUM;
            let isSmall: boolean = size === SIZE_SMALL;
            let isVeryLarge: boolean = size === SIZE_VERY_LARGE;
            const isResponsive: boolean = !isSmall && !isLarge && !isMedium && !isVeryLarge;

            if ([isSmall, isMedium, isLarge, isVeryLarge].filter(item => item).length > 1) {
                throw new Error('Box UI Element cannot be small or medium or large or very large at the same time');
            }

            if (!isResponsive) {
                return (
                    <Wrapped
                        ref={componentRef}
                        className={className}
                        isLarge={isLarge}
                        isMedium={isMedium}
                        isSmall={isSmall}
                        isTouch={isTouch}
                        isVeryLarge={isVeryLarge}
                        {...rest}
                    />
                );
            }

            const { size: sizeFromState }: State = this.state;
            isSmall = sizeFromState === SIZE_SMALL;
            isMedium = sizeFromState === SIZE_MEDIUM;
            isLarge = sizeFromState === SIZE_LARGE;
            isVeryLarge = sizeFromState === SIZE_VERY_LARGE;
            const styleClassName = classNames(
                {
                    [CLASS_IS_SMALL]: isSmall,
                    [CLASS_IS_MEDIUM]: isMedium,
                    [CLASS_IS_TOUCH]: isTouch,
                },
                className,
            );

            return (
                <Measure bounds innerRef={this.innerRef} onResize={this.onResize}>
                    {({ measureRef }) => (
                        <Wrapped
                            ref={componentRef}
                            className={styleClassName}
                            getInnerRef={this.getInnerElement}
                            isLarge={isLarge}
                            isMedium={isMedium}
                            isSmall={isSmall}
                            isTouch={isTouch}
                            isVeryLarge={isVeryLarge}
                            measureRef={measureRef}
                            {...rest}
                        />
                    )}
                </Measure>
            );
        }
    };
}

export default makeResponsive;
