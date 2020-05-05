// @flow
import classNames from 'classnames';

import './scrollShadow.scss';

type scrollShadowState = {
    isBottomOverflowed?: boolean,
    isTopOverflowed?: boolean,
};

const getScrollShadowState = (scrollTop: number, scrollHeight: number, clientHeight: number): scrollShadowState => {
    const scrollState: scrollShadowState = {};

    if (scrollTop > 0) {
        scrollState.isTopOverflowed = true;
    }

    if (scrollHeight - clientHeight > scrollTop) {
        scrollState.isBottomOverflowed = true;
    }

    return scrollState;
};

const getScrollShadowClassName = (scrollTop: number, scrollHeight: number, clientHeight: number): string => {
    const scrollState = getScrollShadowState(scrollTop, scrollHeight, clientHeight);

    return classNames('scroll-shadow-container', {
        'is-showing-top-shadow': scrollState.isTopOverflowed,
        'is-showing-bottom-shadow': scrollState.isBottomOverflowed,
    });
};

export { getScrollShadowClassName, getScrollShadowState };
