// @flow
import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Scrollbar from 'react-scrollbars-custom';
import styled from 'styled-components';

import type { ScrollState } from 'react-scrollbars-custom';
import { getScrollShadowClassName } from '../../../collapsible-sidebar/utils/scrollShadow';

const StyledScrollThumb = styled.div`
    opacity: 0;
    transition: opacity 0.15s;

    .scroll-shadow-container:hover &,
    &.dragging {
        opacity: 0.5;
    }
`;

// The following values match the derived values from scrollShadow.scss
const StyledScrollContainer = styled.div`
    &::before {
        box-shadow: 0 6px 6px -2px ${props => props.theme.primary.scrollShadowRgba};
    }

    &::after {
        box-shadow: 0 -6px 6px -2px ${props => props.theme.primary.scrollShadowRgba};
    }
`;

type Props = {
    /** Primary content */
    children?: React.Node,
    /** Additional classes */
    className?: string,
    onScroll?: (
        { clientHeight: number, scrollLeft: number, scrollTop: number },
        { clientHeight: number, scrollLeft: number, scrollTop: number },
    ) => void,
    style: { height: number | string, width: number | string },
    thumbYStyles?: Object,
    trackYStyles?: Object,
};

type ScrollbarRef = {
    clientHeight: number,
    scrollHeight: number,
    scrollLeft: number,
    scrollTop: number,
};

type Ref = {
    scrollbarRef: { current: React.Ref<typeof Scrollbar> | null } | null,
};

function CollapsibleScrollbar(
    { children, className, onScroll, style, thumbYStyles, trackYStyles, ...rest }: Props,
    ref,
) {
    const scrollRef = React.useRef<ScrollbarRef | null>(null);
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [scrollShadowClassName, setScrollShadowClassName] = React.useState();

    const turnOffScrollingState = () => {
        setIsScrolling(false);
    };

    // If there hasn't been an update to isScrolling in 100ms, it'll be set to false.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedTurnOffScrollingState = React.useCallback(debounce(turnOffScrollingState, 100), []);

    const onScrollHandler = (scrollValues, prevScrollValues) => {
        if (!scrollRef.current) {
            return;
        }

        const { scrollHeight, clientHeight, scrollTop } = scrollValues;
        const scrollShadowClassNameValue = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);

        setIsScrolling(true);
        setScrollShadowClassName(scrollShadowClassNameValue);

        debouncedTurnOffScrollingState();
        if (onScroll) {
            onScroll(scrollValues, prevScrollValues);
        }
    };

    const setScrollShadowState = React.useCallback(() => {
        if (!scrollRef.current) {
            return;
        }

        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;

        const newScrollShadowClassName = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);

        if (scrollShadowClassName !== newScrollShadowClassName) {
            setScrollShadowClassName(newScrollShadowClassName);
        }
    }, [scrollShadowClassName]);

    const onUpdateHandler = (scrollValues: ScrollState, prevScrollValues: ScrollState) => {
        const { clientHeight, contentScrollHeight } = scrollValues;
        const { clientHeight: prevClientHeight, contentScrollHeight: prevContentScrollHeight } = prevScrollValues;
        if (clientHeight !== prevClientHeight || contentScrollHeight !== prevContentScrollHeight) {
            setScrollShadowState();
        }
    };

    // sets onScrollHandler to true for a maximum of once every 50ms.
    const throttledOnScrollHandler = throttle(onScrollHandler, 50);

    const throttledOnUpdateHandler = throttle(onUpdateHandler, 50);

    const classes = classNames('bdl-CollapsibleScrollbar', className, {
        'is-scrolling': isScrolling,
    });

    React.useEffect(() => {
        setScrollShadowState();
    }, [setScrollShadowState]);

    // $FlowFixMe
    React.useImperativeHandle(ref, () => ({
        scrollbarRef: scrollRef,
    }));

    return (
        <Scrollbar
            ref={scrollRef}
            className={scrollShadowClassName}
            onScroll={throttledOnScrollHandler}
            onUpdate={throttledOnUpdateHandler}
            renderer={(props: Object) => {
                const { elementRef, ...restProps } = props;
                return <StyledScrollContainer {...restProps} ref={elementRef} />;
            }}
            style={style}
            thumbYProps={{
                renderer: renderProps => {
                    const { elementRef, style: renderPropStyle, ...restProps } = renderProps;
                    return (
                        <StyledScrollThumb
                            style={{ ...renderPropStyle, ...thumbYStyles }}
                            {...restProps}
                            ref={elementRef}
                        />
                    );
                },
            }}
            trackYProps={{
                style: {
                    background: 'none',
                    top: '0',
                    height: '100%',
                    width: '8px',
                    marginRight: '1px',
                    ...trackYStyles,
                },
            }}
            {...rest}
        >
            <div className={classes} data-testid="content-wrapper">
                {children}
            </div>
        </Scrollbar>
    );
}

export default React.forwardRef<Props, Ref>(CollapsibleScrollbar);
