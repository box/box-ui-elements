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

interface PropsShape {
    className: string;
    componentRef?: Function;
    isTouch: boolean;
    size?: Size;
}

interface State {
    size: Size;
}

const CROSS_OVER_WIDTH_SMALL = 700;
const CROSS_OVER_WIDTH_MEDIUM = 1000;
const CROSS_OVER_WIDTH_LARGE = 1500;
declare global {
    interface Window {
        DocumentTouch: {
            prototype: Document;
            new (): Document;
        };
    }
}
const HAS_TOUCH = !!(
    'ontouchstart' in window ||
    (typeof window.DocumentTouch !== 'undefined' && document instanceof window.DocumentTouch)
);

function makeResponsive<Props extends PropsShape>(Wrapped: React.ComponentType<Props>): React.ComponentType<Props> {
    class ResponsiveWrapper extends React.PureComponent<Props, State> {
        static displayName = `makeResponsive(${Wrapped.displayName || Wrapped.name || 'Component'})`;

        static defaultProps = {
            className: '',
            isTouch: HAS_TOUCH,
        };

        private innerElement: HTMLElement | null = null;

        constructor(props: Props) {
            super(props);
            this.state = {
                size: props.size || this.getSize(window.innerWidth),
            };
        }

        getSize(width: number): Size {
            let size: Size = SIZE_VERY_LARGE;
            if (width <= CROSS_OVER_WIDTH_SMALL) {
                size = SIZE_SMALL;
            } else if (width <= CROSS_OVER_WIDTH_MEDIUM) {
                size = SIZE_MEDIUM;
            } else if (width <= CROSS_OVER_WIDTH_LARGE) {
                size = SIZE_LARGE;
            }

            return size;
        }

        onResize = debounce(({ bounds: { width } }: { bounds: ClientRect }) => {
            this.setState({ size: this.getSize(width) });
        }, 500);

        innerRef = (el: HTMLElement | null) => {
            this.innerElement = el;
        };

        getInnerElement = () => this.innerElement;

        render() {
            const { isTouch, size, className, componentRef, ...rest } = this.props;

            let isLarge = size === SIZE_LARGE;
            let isMedium = size === SIZE_MEDIUM;
            let isSmall = size === SIZE_SMALL;
            let isVeryLarge = size === SIZE_VERY_LARGE;
            const isResponsive = !isSmall && !isLarge && !isMedium && !isVeryLarge;

            if ([isSmall, isMedium, isLarge, isVeryLarge].filter(item => item).length > 1) {
                throw new Error('Box UI Element cannot be small or medium or large or very large at the same time');
            }

            if (!isResponsive) {
                const wrappedProps = {
                    ...(rest as Props),
                    ref: componentRef,
                    className,
                    isLarge,
                    isMedium,
                    isSmall,
                    isTouch,
                    isVeryLarge,
                };
                return <Wrapped {...wrappedProps} />;
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
                    {({ measureRef }) => {
                        const wrappedProps = {
                            ...(rest as Props),
                            ref: componentRef,
                            className: styleClassName,
                            getInnerRef: this.getInnerElement,
                            isLarge,
                            isMedium,
                            isSmall,
                            isTouch,
                            isVeryLarge,
                            measureRef,
                        };
                        return <Wrapped {...wrappedProps} />;
                    }}
                </Measure>
            );
        }
    }

    return ResponsiveWrapper as unknown as React.ComponentType<Props>;
}

export default makeResponsive;
