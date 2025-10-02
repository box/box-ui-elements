import * as React from 'react';
import { useIntl } from 'react-intl';
import { Breadcrumbs } from '../breadcrumbs';
import { VIEW_SEARCH, VIEW_FOLDER, VIEW_RECENTS, DELIMITER_CARET } from '../../../constants';
import messages from '../messages';
const SubHeaderLeft = ({
  currentCollection,
  isSmall,
  onItemClick,
  portalElement,
  rootId,
  rootName,
  view
}) => {
  let crumbs;
  const {
    formatMessage
  } = useIntl();
  if (view === VIEW_FOLDER || view === VIEW_SEARCH) {
    const {
      id,
      name = '',
      breadcrumbs = []
    } = currentCollection;
    crumbs = breadcrumbs.concat({
      id,
      name
    });

    // Search results are specific to the current folder
    // hence the breadcrumb is added to the end of the list
    if (view === VIEW_SEARCH) {
      crumbs = crumbs.concat({
        id: undefined,
        name: formatMessage(messages.searchBreadcrumb)
      });
    }
  } else {
    crumbs = [{
      id: undefined,
      name: formatMessage(messages[`${view}Breadcrumb`])
    }];
    if (view !== VIEW_RECENTS) {
      crumbs.unshift({
        id: rootId,
        name: rootName || formatMessage(messages.rootBreadcrumb)
      });
    }
  }
  return /*#__PURE__*/React.createElement(Breadcrumbs, {
    crumbs: crumbs,
    delimiter: DELIMITER_CARET,
    isSmall: isSmall,
    onCrumbClick: onItemClick,
    portalElement: portalElement,
    rootId: rootId
  });
};
export default SubHeaderLeft;
//# sourceMappingURL=SubHeaderLeft.js.map