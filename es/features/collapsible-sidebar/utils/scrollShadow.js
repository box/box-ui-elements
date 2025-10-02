import classNames from 'classnames';
import './scrollShadow.scss';
const getScrollShadowState = (scrollTop, scrollHeight, clientHeight) => {
  const scrollState = {};
  if (scrollTop > 0) {
    scrollState.isTopOverflowed = true;
  }
  if (scrollHeight - clientHeight > scrollTop) {
    scrollState.isBottomOverflowed = true;
  }
  return scrollState;
};
const getScrollShadowClassName = (scrollTop, scrollHeight, clientHeight) => {
  const scrollState = getScrollShadowState(scrollTop, scrollHeight, clientHeight);
  return classNames('scroll-shadow-container', {
    'is-showing-top-shadow': scrollState.isTopOverflowed,
    'is-showing-bottom-shadow': scrollState.isBottomOverflowed
  });
};
export { getScrollShadowClassName, getScrollShadowState };
//# sourceMappingURL=scrollShadow.js.map