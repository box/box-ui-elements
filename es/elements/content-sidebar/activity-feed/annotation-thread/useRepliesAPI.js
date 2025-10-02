import APIFactory from '../../../../api';
const useRepliesAPI = ({
  annotationId,
  api,
  errorCallback,
  fileId,
  filePermissions
}) => {
  const createReply = ({
    message,
    requestId,
    successCallback
  }) => {
    if (!annotationId) {
      return;
    }
    api.getAnnotationsAPI(false).createAnnotationReply(fileId, annotationId, filePermissions, message, successCallback, errorCallback.bind(null, requestId));
  };
  const deleteReply = ({
    id,
    permissions,
    successCallback
  }) => {
    api.getThreadedCommentsAPI(false).deleteComment({
      fileId,
      commentId: id,
      permissions,
      successCallback,
      errorCallback: errorCallback.bind(null, id)
    });
  };
  const editReply = ({
    id,
    message,
    permissions,
    successCallback
  }) => {
    api.getThreadedCommentsAPI(false).updateComment({
      fileId,
      commentId: id,
      message,
      permissions,
      successCallback,
      errorCallback: errorCallback.bind(null, id)
    });
  };
  return {
    createReply,
    deleteReply,
    editReply
  };
};
export default useRepliesAPI;
//# sourceMappingURL=useRepliesAPI.js.map