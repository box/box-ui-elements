import API from '../../../../api/APIFactory';
const useAnnotationAPI = ({
  api,
  errorCallback,
  file: {
    id: fileId,
    file_version: {
      id: fileVersionId
    } = {},
    permissions: filePermissions = {}
  }
}) => {
  const handleCreate = ({
    payload,
    successCallback
  }) => {
    api.getAnnotationsAPI(false).createAnnotation(fileId, fileVersionId, payload, filePermissions, successCallback, errorCallback);
  };
  const handleFetch = ({
    id,
    successCallback
  }) => {
    api.getAnnotationsAPI(false).getAnnotation(fileId, id, filePermissions, successCallback, errorCallback, true // to fetch aanotation with its replies
    );
  };
  const handleDelete = ({
    id,
    permissions,
    successCallback
  }) => {
    api.getAnnotationsAPI(false).deleteAnnotation(fileId, id, permissions, successCallback, errorCallback);
  };
  const handleEdit = ({
    id,
    text,
    permissions,
    successCallback
  }) => {
    api.getAnnotationsAPI(false).updateAnnotation(fileId, id, permissions, {
      message: text
    }, successCallback, errorCallback);
  };
  const handleStatusChange = ({
    id,
    status,
    permissions,
    successCallback
  }) => {
    api.getAnnotationsAPI(false).updateAnnotation(fileId, id, permissions, {
      status
    }, successCallback, errorCallback);
  };
  return {
    handleCreate,
    handleFetch,
    handleDelete,
    handleEdit,
    handleStatusChange
  };
};
export default useAnnotationAPI;
//# sourceMappingURL=useAnnotationAPI.js.map