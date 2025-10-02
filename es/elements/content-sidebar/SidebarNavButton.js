/**
 * 
 * @file Preview sidebar nav button component
 * @author Box
 */

import * as React from 'react';
import { Route } from 'react-router-dom';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Button } from '@box/blueprint-web';
import Tooltip from '../../components/tooltip/Tooltip';
import { isLeftClick } from '../../utils/dom';
import './SidebarNavButton.scss';
const SidebarNavButton = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    'data-resin-target': dataResinTarget,
    'data-testid': dataTestId,
    children,
    elementId = '',
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    isDisabled,
    isOpen,
    onClick = noop,
    routerDisabled = false,
    sidebarView,
    tooltip
  } = props;
  const sidebarPath = `/${sidebarView}`;
  const id = `${elementId}${elementId === '' ? '' : '_'}${sidebarView}`;
  if (routerDisabled) {
    // Mimic router behavior using internalSidebarNavigation
    const isMatch = !!internalSidebarNavigation && internalSidebarNavigation.sidebar === sidebarView;
    const isActiveValue = isMatch && !!isOpen;

    // Mimic isExactMatch: true when no extra navigation parameters are present
    const hasExtraParams = internalSidebarNavigation && (internalSidebarNavigation.versionId || internalSidebarNavigation.activeFeedEntryType || internalSidebarNavigation.activeFeedEntryId || internalSidebarNavigation.fileVersionId);
    const isExactMatch = isMatch && !hasExtraParams;
    const handleNavButtonClick = event => {
      onClick(sidebarView);

      // Mimic router navigation behavior
      if (internalSidebarNavigationHandler && !event.defaultPrevented && isLeftClick(event)) {
        const replace = isExactMatch;
        internalSidebarNavigationHandler({
          sidebar: sidebarView,
          open: true
        }, replace);
      }
    };
    return /*#__PURE__*/React.createElement(Tooltip, {
      position: "middle-left",
      text: tooltip,
      isTabbable: false,
      targetWrapperClassName: "bcs-NavButton-target"
    }, /*#__PURE__*/React.createElement(Button, {
      accessibleWhenDisabled: true,
      "aria-controls": `${id}-content`,
      "aria-label": tooltip,
      "aria-selected": isActiveValue,
      className: classNames('bcs-NavButton', {
        'bcs-is-selected': isActiveValue,
        'bdl-is-disabled': isDisabled
      }),
      "data-resin-target": dataResinTarget,
      "data-testid": dataTestId,
      ref: ref,
      id: id,
      disabled: isDisabled,
      onClick: handleNavButtonClick,
      role: "tab",
      tabIndex: isActiveValue ? '0' : '-1',
      type: "button",
      variant: "tertiary"
    }, children));
  }
  return /*#__PURE__*/React.createElement(Route, {
    path: sidebarPath
  }, ({
    match,
    history
  }) => {
    const isMatch = !!match;
    const isActiveValue = isMatch && !!isOpen;
    const isExactMatch = isMatch && match.isExact;
    const handleNavButtonClick = event => {
      onClick(sidebarView);
      if (!event.defaultPrevented && isLeftClick(event)) {
        const method = isExactMatch ? history.replace : history.push;
        method({
          pathname: sidebarPath,
          state: {
            open: true
          }
        });
      }
    };
    return /*#__PURE__*/React.createElement(Tooltip, {
      targetWrapperClassName: "bcs-NavButton-target",
      position: "middle-left",
      text: tooltip,
      isTabbable: false
    }, /*#__PURE__*/React.createElement(Button, {
      accessibleWhenDisabled: true,
      "aria-controls": `${id}-content`,
      "aria-label": tooltip,
      "aria-selected": isActiveValue,
      className: classNames('bcs-NavButton', {
        'bcs-is-selected': isActiveValue,
        'bdl-is-disabled': isDisabled
      }),
      "data-resin-target": dataResinTarget,
      "data-testid": dataTestId,
      ref: ref,
      id: id,
      disabled: isDisabled,
      onClick: handleNavButtonClick,
      role: "tab",
      tabIndex: isActiveValue ? '0' : '-1',
      type: "button",
      variant: "tertiary"
    }, children));
  });
});
export default SidebarNavButton;
//# sourceMappingURL=SidebarNavButton.js.map