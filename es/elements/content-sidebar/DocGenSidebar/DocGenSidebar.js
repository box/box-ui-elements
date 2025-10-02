import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
import { useIntl } from 'react-intl';
import { LoadingIndicator } from '@box/blueprint-web';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { ORIGIN_DOCGEN_SIDEBAR, SIDEBAR_VIEW_DOCGEN } from '../../../constants';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withAPIContext } from '../../common/api-context';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withErrorBoundary } from '../../common/error-boundary';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { withLogger } from '../../common/logger';
import Error from './Error';
import EmptyTags from './EmptyTags';
// @ts-ignore: no ts definition
import SidebarContent from '../SidebarContent';
import TagsSection from './TagsSection';
// @ts-ignore: no ts definition
import messages from './messages';
// @ts-ignore: no ts definition

// @ts-ignore: no ts definition

import commonMessages from '../../common/messages';
import './DocGenSidebar.scss';
const DEFAULT_RETRIES = 10;
const DocGenSidebar = ({
  getDocGenTags
}) => {
  const {
    formatMessage
  } = useIntl();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState({
    text: [],
    image: []
  });
  const [jsonPaths, setJsonPaths] = useState({
    textTree: {},
    imageTree: {}
  });
  const createNestedObject = (base, paths) => {
    paths.reduce((obj, path) => {
      if (!obj[path]) obj[path] = {};
      return obj[path];
    }, base);
  };
  const tagsToJsonPaths = useCallback(docGenTags => {
    const jsonPathsMap = {};
    docGenTags.forEach(tag => {
      tag.json_paths.forEach(jsonPath => {
        const paths = jsonPath.split('.');
        createNestedObject(jsonPathsMap, paths);
      });
    });
    return jsonPathsMap;
  }, []);
  const loadTags = useCallback(async (attempts = DEFAULT_RETRIES) => {
    if (attempts <= 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getDocGenTags();
      if (response?.message) {
        loadTags.call(this, attempts - 1);
      } else if (response?.data) {
        const {
          data
        } = response;
        // anything that is not an image tag for this view is treated as a text tag
        const textTags = data?.filter(tag => tag.tag_type !== 'image') || [];
        const imageTags = data?.filter(tag => tag.tag_type === 'image') || [];
        setTags({
          text: textTags,
          image: imageTags
        });
        setJsonPaths({
          textTree: tagsToJsonPaths(textTags),
          imageTree: tagsToJsonPaths(imageTags)
        });
        setHasError(false);
        setIsLoading(false);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setHasError(true);
      setIsLoading(false);
    }
  },
  // disabling eslint because the getDocGenTags prop is changing very frequently
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [tagsToJsonPaths]);
  useEffect(() => {
    loadTags(DEFAULT_RETRIES);
  }, [loadTags]);
  const isEmpty = tags.image.length + tags.text.length === 0;
  return /*#__PURE__*/React.createElement(SidebarContent, {
    sidebarView: SIDEBAR_VIEW_DOCGEN,
    title: formatMessage(messages.docGenTags)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames('bcs-DocGenSidebar', {
      center: isEmpty || hasError || isLoading
    })
  }, hasError && /*#__PURE__*/React.createElement(Error, {
    onClick: () => loadTags(DEFAULT_RETRIES)
  }), isLoading && /*#__PURE__*/React.createElement(LoadingIndicator, {
    "aria-label": formatMessage(commonMessages.loading),
    className: "bcs-DocGenSidebar-loading"
  }), !hasError && !isLoading && isEmpty && /*#__PURE__*/React.createElement(EmptyTags, null), !hasError && !isLoading && !isEmpty && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TagsSection, {
    message: messages.textTags,
    data: jsonPaths.textTree
  }), /*#__PURE__*/React.createElement(TagsSection, {
    message: messages.imageTags,
    data: jsonPaths.imageTree
  }))));
};
export { DocGenSidebar as DocGenSidebarComponent };
export default flow([withLogger(ORIGIN_DOCGEN_SIDEBAR), withErrorBoundary(ORIGIN_DOCGEN_SIDEBAR), withAPIContext])(DocGenSidebar);
//# sourceMappingURL=DocGenSidebar.js.map