/**
 * 
 * @file Annotation Thread Container
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import { IntlProvider } from 'react-intl';
import AnnotationThreadContent from './AnnotationThreadContent';
import AnnotationThreadCreate from './AnnotationThreadCreate';
import useAnnotationThread from './useAnnotationThread';
import API from '../../../../api/APIFactory';
import { DEFAULT_COLLAB_DEBOUNCE, DEFAULT_HOSTNAME_API } from '../../../../constants';
import './AnnotationThread.scss';
const AnnotationThread = ({
  annotationId,
  apiHost = DEFAULT_HOSTNAME_API,
  cache,
  className = '',
  clientName,
  currentUser,
  eventEmitter,
  file,
  getUserProfileUrl,
  handleCancel,
  language,
  messages,
  onAnnotationCreate,
  onError,
  target,
  token
}) => {
  const [mentionSelectorContacts, setMentionSelectorContacts] = React.useState([]);
  const api = new API({
    apiHost,
    cache,
    clientName,
    language,
    token
  });
  const {
    annotation,
    replies,
    isLoading,
    error,
    annotationActions: {
      handleAnnotationCreate,
      handleAnnotationDelete,
      handleAnnotationEdit,
      handleAnnotationStatusChange
    },
    repliesActions: {
      handleReplyEdit,
      handleReplyCreate,
      handleReplyDelete
    }
  } = useAnnotationThread({
    api,
    annotationId,
    currentUser,
    errorCallback: onError,
    eventEmitter,
    file,
    onAnnotationCreate,
    target
  });
  const getAvatarUrl = async userId => api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, file.id);
  const getMentionContactsSuccessCallback = ({
    entries
  }) => {
    setMentionSelectorContacts(entries);
  };
  const getMentionWithQuery = debounce(searchStr => {
    api.getFileCollaboratorsAPI(false).getCollaboratorsWithQuery(file.id, getMentionContactsSuccessCallback, onError, searchStr);
  }, DEFAULT_COLLAB_DEBOUNCE);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('AnnotationThread', className),
    "data-testid": "annotation-thread"
  }, /*#__PURE__*/React.createElement(IntlProvider, {
    locale: language,
    messages: messages
  }, !annotationId ? /*#__PURE__*/React.createElement(AnnotationThreadCreate, {
    currentUser: currentUser,
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    isPending: isLoading,
    mentionSelectorContacts: mentionSelectorContacts,
    onFormCancel: handleCancel,
    onFormSubmit: handleAnnotationCreate
  }) : /*#__PURE__*/React.createElement(AnnotationThreadContent, {
    annotation: annotation,
    currentUser: currentUser,
    error: error,
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    getUserProfileUrl: getUserProfileUrl,
    isLoading: isLoading,
    mentionSelectorContacts: mentionSelectorContacts,
    onAnnotationDelete: handleAnnotationDelete,
    onAnnotationEdit: handleAnnotationEdit,
    onAnnotationStatusChange: handleAnnotationStatusChange,
    onReplyCreate: handleReplyCreate,
    onReplyDelete: handleReplyDelete,
    onReplyEdit: handleReplyEdit,
    replies: replies
  })));
};
export default AnnotationThread;
//# sourceMappingURL=AnnotationThread.js.map