const _excluded = ["replies"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import commonMessages from '../../../common/messages';
import { annotationErrors, commentsErrors } from './errors';
import API from '../../../../api/APIFactory';
import useRepliesAPI from './useRepliesAPI';
import { useAnnotatorEvents } from '../../../common/annotator-context';
import useAnnotationAPI from './useAnnotationAPI';
const normalizeReplies = repliesArray => {
  if (!repliesArray) {
    return {};
  }
  return repliesArray.reduce((prevValues, reply) => {
    return _objectSpread(_objectSpread({}, prevValues), {}, {
      [reply.id]: reply
    });
  }, {});
};
const denormalizeReplies = repliesMap => {
  return Object.keys(repliesMap).map(key => repliesMap[key]);
};
const useAnnotationThread = ({
  annotationId,
  api,
  currentUser,
  errorCallback,
  eventEmitter,
  file,
  onAnnotationCreate,
  target
}) => {
  const [annotation, setAnnotation] = React.useState();
  const [replies, setReplies] = React.useState({});
  const [error, setError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    file_version: {
      id: fileVersionId
    } = {},
    id: fileId,
    permissions: filePermissions = {}
  } = file;
  const updateOrCreateReplyItem = (replyId, updatedReplyValues) => {
    setReplies(prevReplies => _objectSpread(_objectSpread({}, prevReplies), {}, {
      [replyId]: _objectSpread(_objectSpread({}, prevReplies[replyId]), updatedReplyValues)
    }));
  };
  const removeReplyItem = replyId => {
    setReplies(prevReplies => {
      const newReplies = _objectSpread({}, prevReplies);
      delete newReplies[replyId];
      return newReplies;
    });
  };
  const addPendingReply = (baseReply, requestId) => {
    const date = new Date().toISOString();
    const pendingReply = _objectSpread({
      created_at: date,
      created_by: currentUser,
      id: requestId,
      isPending: true,
      modified_at: date
    }, baseReply);
    updateOrCreateReplyItem(requestId, pendingReply);
  };
  const isCurrentAnnotation = id => annotationId === id;
  const handleAnnotationUpdateStartEvent = updatedAnnotation => {
    if (!isCurrentAnnotation(updatedAnnotation.id) || !annotation) {
      return;
    }
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread(_objectSpread({}, prevAnnotation), updatedAnnotation), {}, {
      isPending: true
    }));
  };
  const handleAnnotationUpdateEndEvent = updatedAnnotation => {
    if (!isCurrentAnnotation(updatedAnnotation.id) || !annotation) {
      return;
    }
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread(_objectSpread({}, prevAnnotation), updatedAnnotation), {}, {
      isPending: false
    }));
  };
  const handleAnnotationDeleteStartEvent = originAnnotationId => {
    if (!isCurrentAnnotation(originAnnotationId) || !annotation) {
      return;
    }
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread({}, prevAnnotation), {}, {
      isPending: true
    }));
  };
  const handleAnnotationReplyAddStartEvent = ({
    annotationId: originAnnotationId,
    reply,
    requestId
  }) => {
    if (!isCurrentAnnotation(originAnnotationId)) {
      return;
    }
    addPendingReply(reply, requestId);
  };
  const handleAnnotationReplyAddEndEvent = ({
    annotationId: originAnnotationId,
    reply,
    requestId
  }) => {
    if (!isCurrentAnnotation(originAnnotationId)) {
      return;
    }
    updateOrCreateReplyItem(requestId, _objectSpread(_objectSpread({}, reply), {}, {
      isPending: false
    }));
  };
  const handleAnnotationReplyUpdateStart = ({
    annotationId: originAnnotationId,
    reply
  }) => {
    if (!isCurrentAnnotation(originAnnotationId)) {
      return;
    }
    updateOrCreateReplyItem(reply.id, _objectSpread(_objectSpread({}, reply), {}, {
      isPending: true
    }));
  };
  const handleAnnotationReplyUpdateEnd = ({
    annotationId: originAnnotationId,
    reply
  }) => {
    if (!isCurrentAnnotation(originAnnotationId)) {
      return;
    }
    updateOrCreateReplyItem(reply.id, _objectSpread(_objectSpread({}, reply), {}, {
      isPending: false
    }));
  };
  const handleAnnotationReplyDeleteStart = ({
    annotationId: originAnnotationId,
    id: replyId
  }) => {
    if (!isCurrentAnnotation(originAnnotationId)) {
      return;
    }
    updateOrCreateReplyItem(replyId, {
      isPending: true
    });
  };
  const handleAnnotationReplyDeleteEnd = ({
    annotationId: originAnnotationId,
    id: replyId
  }) => {
    if (!isCurrentAnnotation(originAnnotationId)) {
      return;
    }
    removeReplyItem(replyId);
  };
  const {
    emitAddAnnotationEndEvent,
    emitAddAnnotationReplyEndEvent,
    emitAddAnnotationReplyStartEvent,
    emitAddAnnotationStartEvent,
    emitAnnotationActiveChangeEvent,
    emitDeleteAnnotationEndEvent,
    emitDeleteAnnotationReplyEndEvent,
    emitDeleteAnnotationReplyStartEvent,
    emitDeleteAnnotationStartEvent,
    emitUpdateAnnotationEndEvent,
    emitUpdateAnnotationReplyEndEvent,
    emitUpdateAnnotationReplyStartEvent,
    emitUpdateAnnotationStartEvent
  } = useAnnotatorEvents({
    eventEmitter,
    onAnnotationDeleteStart: handleAnnotationDeleteStartEvent,
    onAnnotationReplyAddEnd: handleAnnotationReplyAddEndEvent,
    onAnnotationReplyAddStart: handleAnnotationReplyAddStartEvent,
    onAnnotationReplyUpdateEnd: handleAnnotationReplyUpdateEnd,
    onAnnotationReplyUpdateStart: handleAnnotationReplyUpdateStart,
    onAnnotationUpdateEnd: handleAnnotationUpdateEndEvent,
    onAnnotationUpdateStart: handleAnnotationUpdateStartEvent,
    onAnnotationReplyDeleteEnd: handleAnnotationReplyDeleteEnd,
    onAnnotationReplyDeleteStart: handleAnnotationReplyDeleteStart
  });
  const handleUpdateAnnotation = updatedValues => {
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread({}, prevAnnotation), updatedValues));
  };
  const annotationErrorCallback = React.useCallback((e, code) => {
    setIsLoading(false);
    setError({
      title: commonMessages.errorOccured,
      message: annotationErrors[code] || annotationErrors.default
    });
    errorCallback(e, code, {
      error: e
    });
  }, [errorCallback]);
  const {
    handleCreate,
    handleDelete,
    handleEdit,
    handleFetch,
    handleStatusChange
  } = useAnnotationAPI({
    api,
    file,
    errorCallback: annotationErrorCallback
  });
  const replyErrorCallback = React.useCallback((replyId, e, code) => {
    updateOrCreateReplyItem(replyId, {
      error: {
        title: commonMessages.errorOccured,
        message: commentsErrors[code] || commentsErrors.default
      }
    });
    errorCallback(e, code, {
      error: e
    });
  }, [errorCallback]);
  const {
    createReply,
    deleteReply,
    editReply
  } = useRepliesAPI({
    annotationId,
    api,
    errorCallback: replyErrorCallback,
    fileId,
    filePermissions
  });
  const handleAnnotationCreate = text => {
    setIsLoading(true);
    const requestId = uniqueId('annotation_');
    const successCallback = newAnnotation => {
      setIsLoading(false);
      emitAddAnnotationEndEvent(newAnnotation, requestId);
      onAnnotationCreate(newAnnotation);
    };
    const payload = {
      description: {
        message: text
      },
      target
    };
    emitAddAnnotationStartEvent(payload, requestId);
    handleCreate({
      payload,
      successCallback
    });
  };
  const handleAnnotationDelete = ({
    id,
    permissions
  }) => {
    const annotationDeleteSuccessCallback = () => {
      emitDeleteAnnotationEndEvent(id);
    };
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread({}, prevAnnotation), {}, {
      isPending: true
    }));
    emitDeleteAnnotationStartEvent(id);
    handleDelete({
      id,
      permissions,
      successCallback: annotationDeleteSuccessCallback
    });
  };
  const onAnnotationEditSuccessCallback = updatedAnnotation => {
    handleUpdateAnnotation(_objectSpread(_objectSpread({}, updatedAnnotation), {}, {
      isPending: false
    }));
    emitUpdateAnnotationEndEvent(updatedAnnotation);
  };
  const handleAnnotationEdit = ({
    id,
    text,
    permissions
  }) => {
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread({}, prevAnnotation), {}, {
      isPending: true
    }));
    emitUpdateAnnotationStartEvent({
      id,
      description: {
        message: text
      }
    });
    handleEdit({
      id,
      text: text ?? '',
      permissions,
      successCallback: onAnnotationEditSuccessCallback
    });
  };
  const handleAnnotationStatusChange = ({
    id,
    permissions,
    status
  }) => {
    setAnnotation(prevAnnotation => _objectSpread(_objectSpread({}, prevAnnotation), {}, {
      isPending: true
    }));
    handleStatusChange({
      id,
      status,
      permissions,
      successCallback: onAnnotationEditSuccessCallback
    });
  };
  const handleReplyCreate = message => {
    const requestId = uniqueId('reply_');
    const replyData = {
      tagged_message: message,
      type: 'comment'
    };
    const successCallback = comment => {
      updateOrCreateReplyItem(requestId, _objectSpread(_objectSpread({}, comment), {}, {
        isPending: false
      }));
      emitAddAnnotationReplyEndEvent(comment, annotationId, requestId);
    };
    addPendingReply(replyData, requestId);
    emitAddAnnotationReplyStartEvent(replyData, annotationId, requestId);
    createReply({
      message,
      requestId,
      successCallback
    });
  };
  const handleReplyEdit = (replyId, message, status, hasMention, permissions) => {
    const updates = {
      id: replyId,
      tagged_message: message
    };
    const successCallback = comment => {
      updateOrCreateReplyItem(comment.id, _objectSpread(_objectSpread({}, comment), {}, {
        isPending: false
      }));
      emitUpdateAnnotationReplyEndEvent(comment, annotationId);
    };
    updateOrCreateReplyItem(replyId, {
      message,
      isPending: true
    });
    emitUpdateAnnotationReplyStartEvent(updates, annotationId);
    editReply({
      id: replyId,
      message,
      permissions,
      successCallback
    });
  };
  const handleReplyDelete = ({
    id,
    permissions
  }) => {
    updateOrCreateReplyItem(id, {
      isPending: true
    });
    emitDeleteAnnotationReplyStartEvent(id, annotationId);
    const successCallback = () => {
      removeReplyItem(id);
      emitDeleteAnnotationReplyEndEvent(id, annotationId);
    };
    deleteReply({
      id,
      permissions,
      successCallback
    });
  };
  React.useEffect(() => {
    if (!annotationId || isLoading || annotation && annotation.id === annotationId) {
      return;
    }
    setIsLoading(true);
    handleFetch({
      id: annotationId,
      successCallback: _ref => {
        let {
            replies: fetchedReplies
          } = _ref,
          normalizedAnnotation = _objectWithoutProperties(_ref, _excluded);
        setAnnotation(_objectSpread({}, normalizedAnnotation));
        setReplies(normalizeReplies(fetchedReplies));
        setError(undefined);
        setIsLoading(false);
        emitAnnotationActiveChangeEvent(normalizedAnnotation.id, fileVersionId);
      }
    });
  }, [annotation, annotationId, emitAnnotationActiveChangeEvent, fileVersionId, handleFetch, isLoading]);
  return {
    annotation,
    error,
    isLoading,
    replies: denormalizeReplies(replies),
    annotationActions: {
      handleAnnotationCreate,
      handleAnnotationDelete,
      handleAnnotationEdit,
      handleAnnotationStatusChange
    },
    repliesActions: {
      handleReplyCreate,
      handleReplyEdit,
      handleReplyDelete
    }
  };
};
export default useAnnotationThread;
//# sourceMappingURL=useAnnotationThread.js.map