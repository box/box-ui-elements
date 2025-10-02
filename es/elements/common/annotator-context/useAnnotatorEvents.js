import * as React from 'react';
import noop from 'lodash/noop';
import { Status } from './types';
function useAnnotatorEvents({
  eventEmitter,
  onAnnotationDeleteEnd = noop,
  onAnnotationDeleteStart = noop,
  onAnnotationReplyAddEnd = noop,
  onAnnotationReplyAddStart = noop,
  onAnnotationReplyDeleteEnd = noop,
  onAnnotationReplyDeleteStart = noop,
  onAnnotationReplyUpdateEnd = noop,
  onAnnotationReplyUpdateStart = noop,
  onAnnotationUpdateEnd = noop,
  onAnnotationUpdateStart = noop,
  onSidebarAnnotationSelected = noop
}) {
  const emitAnnotationActiveChangeEvent = (annotationId, fileVersionId) => {
    eventEmitter.emit('annotations_active_change', {
      annotationId,
      fileVersionId
    });
  };
  const emitAddAnnotationEvent = (annotation, requestId, status) => {
    const actionEvent = {
      annotation,
      meta: {
        status,
        requestId
      }
    };
    eventEmitter.emit('annotations_create', actionEvent);
  };
  const emitAddAnnotationStartEvent = (annotation, requestId) => {
    emitAddAnnotationEvent(annotation, requestId, Status.PENDING);
  };
  const emitAddAnnotationEndEvent = (annotation, requestId) => {
    emitAddAnnotationEvent(annotation, requestId, Status.SUCCESS);
  };
  const emitDeleteAnnotationEvent = (id, status) => {
    const actionEvent = {
      annotation: {
        id
      },
      meta: {
        status
      }
    };
    eventEmitter.emit('annotations_delete', actionEvent);
  };
  const emitDeleteAnnotationStartEvent = id => {
    emitDeleteAnnotationEvent(id, Status.PENDING);
  };
  const emitDeleteAnnotationEndEvent = id => {
    emitDeleteAnnotationEvent(id, Status.SUCCESS);
    eventEmitter.emit('annotations_remove', id);
  };
  const emitUpdateAnnotationEvent = (annotation, status) => {
    const actionEvent = {
      annotation,
      meta: {
        status
      }
    };
    eventEmitter.emit('annotations_update', actionEvent);
  };
  const emitUpdateAnnotationStartEvent = annotation => {
    emitUpdateAnnotationEvent(annotation, Status.PENDING);
  };
  const emitUpdateAnnotationEndEvent = annotation => {
    emitUpdateAnnotationEvent(annotation, Status.SUCCESS);
  };
  const emitUpdateAnnotationReplyEvent = (reply, annotationId, status) => {
    const actionEvent = {
      annotation: {
        id: annotationId
      },
      annotationReply: reply,
      meta: {
        status
      }
    };
    eventEmitter.emit('annotations_reply_update', actionEvent);
  };
  const emitUpdateAnnotationReplyStartEvent = (reply, annotationId) => {
    emitUpdateAnnotationReplyEvent(reply, annotationId, Status.PENDING);
  };
  const emitUpdateAnnotationReplyEndEvent = (reply, annotationId) => {
    emitUpdateAnnotationReplyEvent(reply, annotationId, Status.SUCCESS);
  };
  const emitDeleteAnnotationReplyEvent = (id, annotationId, status) => {
    const actionEvent = {
      annotation: {
        id: annotationId
      },
      annotationReply: {
        id
      },
      meta: {
        status
      }
    };
    eventEmitter.emit('annotations_reply_delete', actionEvent);
  };
  const emitDeleteAnnotationReplyStartEvent = (id, annotationId) => {
    emitDeleteAnnotationReplyEvent(id, annotationId, Status.PENDING);
  };
  const emitDeleteAnnotationReplyEndEvent = (id, annotationId) => {
    emitDeleteAnnotationReplyEvent(id, annotationId, Status.SUCCESS);
  };
  const emitAddAnnotationReplyEvent = (reply, annotationId, requestId, status) => {
    const actionEvent = {
      annotation: {
        id: annotationId
      },
      annotationReply: reply,
      meta: {
        status,
        requestId
      }
    };
    eventEmitter.emit('annotations_reply_create', actionEvent);
  };
  const emitAddAnnotationReplyStartEvent = (reply, annotationId, requestId) => {
    emitAddAnnotationReplyEvent(reply, annotationId, requestId, Status.PENDING);
  };
  const emitAddAnnotationReplyEndEvent = (reply, annotationId, requestId) => {
    emitAddAnnotationReplyEvent(reply, annotationId, requestId, Status.SUCCESS);
  };
  React.useEffect(() => {
    eventEmitter.addListener('annotations_active_set', onSidebarAnnotationSelected);
    eventEmitter.addListener('annotations_remove', onAnnotationDeleteEnd);
    eventEmitter.addListener('annotations_remove_start', onAnnotationDeleteStart);
    eventEmitter.addListener('sidebar.annotations_update', onAnnotationUpdateEnd);
    eventEmitter.addListener('sidebar.annotations_update_start', onAnnotationUpdateStart);
    eventEmitter.addListener('sidebar.annotations_reply_create', onAnnotationReplyAddEnd);
    eventEmitter.addListener('sidebar.annotations_reply_create_start', onAnnotationReplyAddStart);
    eventEmitter.addListener('sidebar.annotations_reply_delete', onAnnotationReplyDeleteEnd);
    eventEmitter.addListener('sidebar.annotations_reply_delete_start', onAnnotationReplyDeleteStart);
    eventEmitter.addListener('sidebar.annotations_reply_update', onAnnotationReplyUpdateEnd);
    eventEmitter.addListener('sidebar.annotations_reply_update_start', onAnnotationReplyUpdateStart);
    return () => {
      eventEmitter.removeListener('annotations_active_set', onSidebarAnnotationSelected);
      eventEmitter.removeListener('annotations_remove', onAnnotationDeleteEnd);
      eventEmitter.removeListener('annotations_remove_start', onAnnotationDeleteStart);
      eventEmitter.removeListener('sidebar.annotations_update', onAnnotationUpdateEnd);
      eventEmitter.removeListener('sidebar.annotations_update_start', onAnnotationUpdateStart);
      eventEmitter.removeListener('sidebar.annotations_reply_create', onAnnotationReplyAddEnd);
      eventEmitter.removeListener('sidebar.annotations_reply_create_start', onAnnotationReplyAddStart);
      eventEmitter.removeListener('sidebar.annotations_reply_delete', onAnnotationReplyDeleteEnd);
      eventEmitter.removeListener('sidebar.annotations_reply_delete_start', onAnnotationReplyDeleteStart);
      eventEmitter.removeListener('sidebar.annotations_reply_update', onAnnotationReplyUpdateEnd);
      eventEmitter.removeListener('sidebar.annotations_reply_update_start', onAnnotationReplyUpdateStart);
    };
  }, [eventEmitter, onAnnotationDeleteEnd, onAnnotationDeleteStart, onAnnotationReplyAddEnd, onAnnotationReplyAddStart, onAnnotationReplyDeleteEnd, onAnnotationReplyDeleteStart, onAnnotationReplyUpdateEnd, onAnnotationReplyUpdateStart, onAnnotationUpdateEnd, onAnnotationUpdateStart, onSidebarAnnotationSelected]);
  return {
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
  };
}
export default useAnnotatorEvents;
//# sourceMappingURL=useAnnotatorEvents.js.map