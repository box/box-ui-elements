/**
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
import { Size } from '../../common/types/core';

interface PropsShape {
    className: string;
    componentRef?: (ref: unknown) => void;
    isTouch: boolean;
    size?: Size;
}

interface State {
    size: Size;
}

const CROSS_OVER_WIDTH_SMALL = 700;
const CROSS_OVER_WIDTH_MEDIUM = 1000;
const CROSS_OVER_WIDTH_LARGE = 1500;
// DocumentTouch is not in the TypeScript types but exists in some browsers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HAS_TOUCH = !!(
    'ontouchstart' in window ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).DocumentTouch &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document instanceof (window as any).DocumentTouch)
);

function makeResponsive<Props extends PropsShape>(
    Wrapped: React.ComponentType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
): React.ComponentType<Props> {
    // Using type assertion to handle the complex HOC return type
    const ResponsiveComponent = class extends React.PureComponent<Props, State> {
        static defaultProps: Partial<PropsShape> = {
            className: '',
            isTouch: HAS_TOUCH,
        };

        innerElement: HTMLElement | null = null;

        /**
         * [constructor]
         *
         * @param {Props} props
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
         * @param {number} width - width of the component
         * @return {Size} - size category
         */
        getSize(width: number): Size {
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
         * @param {Object} bounds - measurement bounds
         * @return {void}
         */
        onResize = debounce(({ bounds: { width } }: { bounds: ClientRect }): void => {
            this.setState({ size: this.getSize(width) });
        }, 500);

        /**
         * Callback function for setting the ref which measureRef is attached to
         *
         * @param {HTMLElement} el - The HTML element
         * @return {void}
         */
        innerRef = (el: HTMLElement | null): void => {
            this.innerElement = el;
        };

        /**
         * Gets the ref element which measureRef is attached to
         *
         * @return {HTMLElement | null} - the HTML element
         */
        getInnerElement = (): HTMLElement | null => this.innerElement;

        /**
         * Renders the Box UI Element
         *
         * @private
         * @inheritdoc
         * @return {React.ReactElement}
         */
        render(): React.ReactElement {
            const { isTouch, size, className, componentRef, ...rest } = this.props;

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

            const { size: sizeFromState } = this.state;
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

    return ResponsiveComponent as unknown as React.ComponentType<Props>;
}

export default makeResponsive;
