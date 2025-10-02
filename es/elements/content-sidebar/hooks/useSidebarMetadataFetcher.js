function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import getProp from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { isUserCorrectableError } from '../../../utils/error';
import { ERROR_CODE_EMPTY_METADATA_SUGGESTIONS, ERROR_CODE_FETCH_METADATA_SUGGESTIONS, ERROR_CODE_METADATA_AUTOFILL_TIMEOUT, ERROR_CODE_UNKNOWN, ERROR_CODE_METADATA_PRECONDITION_FAILED, FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS_CAN_UPLOAD, FIELD_PERMISSIONS, SUCCESS_CODE_UPDATE_METADATA_TEMPLATE_INSTANCE, SUCCESS_CODE_DELETE_METADATA_TEMPLATE_INSTANCE, SUCCESS_CODE_CREATE_METADATA_TEMPLATE_INSTANCE } from '../../../constants';
import messages from '../../common/messages';
export let STATUS = /*#__PURE__*/function (STATUS) {
  STATUS["IDLE"] = "idle";
  STATUS["LOADING"] = "loading";
  STATUS["ERROR"] = "error";
  STATUS["SUCCESS"] = "success";
  return STATUS;
}({});
function useSidebarMetadataFetcher(api, fileId, onError, onSuccess, isFeatureEnabled) {
  const [status, setStatus] = React.useState(STATUS.IDLE);
  const [file, setFile] = React.useState(null);
  const [templates, setTemplates] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [templateInstances, setTemplateInstances] = React.useState([]);
  const [extractErrorCode, setExtractErrorCode] = React.useState(null);
  const onApiError = React.useCallback((error, code, message) => {
    const {
      status: errorStatus
    } = error;
    const isValidError = isUserCorrectableError(errorStatus);
    setStatus(STATUS.ERROR);
    setErrorMessage(message);
    onError(error, code, {
      error,
      isErrorDisplayed: isValidError
    });
  }, [onError]);
  const fetchMetadataSuccessCallback = React.useCallback(({
    templates: fetchedTemplates,
    templateInstances: fetchedTemplateInstances
  }) => {
    setErrorMessage(null);
    setStatus(STATUS.SUCCESS);
    setTemplateInstances(fetchedTemplateInstances);
    setTemplates(fetchedTemplates);
  }, []);
  const fetchMetadataErrorCallback = React.useCallback((e, code) => {
    setTemplates(null);
    setTemplateInstances(null);
    onApiError(e, code, messages.sidebarMetadataFetchingErrorContent);
  }, [onApiError]);
  const fetchMetadata = React.useCallback(fetchedFile => {
    api.getMetadataAPI(false).getMetadata(fetchedFile, fetchMetadataSuccessCallback, fetchMetadataErrorCallback, isFeatureEnabled, {
      refreshCache: true
    }, true);
  }, [api, fetchMetadataErrorCallback, fetchMetadataSuccessCallback, isFeatureEnabled]);
  const fetchFileSuccessCallback = React.useCallback(fetchedFile => {
    const {
      currentFile
    } = file ?? {};
    const currentFileCanUpload = getProp(currentFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
    const newFileCanUpload = getProp(fetchedFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
    const shouldFetchMetadata = !currentFile || currentFileCanUpload !== newFileCanUpload;
    setFile(fetchedFile);
    if (shouldFetchMetadata && fetchedFile) {
      fetchMetadata(fetchedFile);
    } else {
      setStatus(STATUS.SUCCESS);
    }
  }, [fetchMetadata, file]);
  const fetchFileErrorCallback = React.useCallback((e, code) => {
    setFile(undefined);
    onApiError(e, code, messages.sidebarMetadataEditingErrorContent);
  }, [onApiError]);
  const handleDeleteMetadataInstance = React.useCallback(async metadataInstance => {
    if (!file || !metadataInstance) {
      return;
    }
    setStatus(STATUS.LOADING);
    await api.getMetadataAPI(false).deleteMetadata(file, metadataInstance, () => {
      setStatus(STATUS.SUCCESS);
      onSuccess(SUCCESS_CODE_DELETE_METADATA_TEMPLATE_INSTANCE, true);
    }, (error, code) => {
      onApiError(error, code, messages.sidebarMetadataEditingErrorContent);
    }, true);
  }, [api, onApiError, onSuccess, file]);
  const handleCreateMetadataInstance = React.useCallback(async (templateInstance, successCallback) => {
    await api.getMetadataAPI(false).createMetadataRedesign(file, templateInstance, () => {
      successCallback();
      onSuccess(SUCCESS_CODE_CREATE_METADATA_TEMPLATE_INSTANCE, true);
    }, (error, code) => onApiError(error, code, messages.sidebarMetadataEditingErrorContent));
  }, [api, file, onApiError, onSuccess]);
  const handleUpdateMetadataInstance = React.useCallback(async (metadataInstance, JSONPatch, successCallback) => {
    await api.getMetadataAPI(false).updateMetadataRedesign(file, metadataInstance, JSONPatch, () => {
      successCallback();
      onSuccess(SUCCESS_CODE_UPDATE_METADATA_TEMPLATE_INSTANCE, true);
    }, (error, code) => {
      onApiError(error, code, messages.sidebarMetadataEditingErrorContent);
    });
  }, [api, file, onApiError, onSuccess]);
  const [, setError] = React.useState();
  const extractSuggestions = React.useCallback(async (templateKey, scope, agentId) => {
    const aiAPI = api.getIntelligenceAPI();
    setExtractErrorCode(null);
    let answer = null;
    const customAiAgent = agentId ? {
      ai_agent: {
        type: 'ai_agent_id',
        id: agentId
      }
    } : {};
    const requestBody = _objectSpread({
      items: [{
        id: file.id,
        type: file.type
      }],
      metadata_template: {
        template_key: templateKey,
        scope,
        type: 'metadata_template'
      }
    }, customAiAgent);
    try {
      answer = await aiAPI.extractStructured(requestBody);
    } catch (error) {
      // Axios makes the status code nested under the response object
      if (error.response?.status === 408) {
        onError(error, ERROR_CODE_METADATA_AUTOFILL_TIMEOUT);
        setExtractErrorCode(ERROR_CODE_METADATA_AUTOFILL_TIMEOUT);
      } else if (error.response?.status === 412) {
        onError(error, ERROR_CODE_METADATA_PRECONDITION_FAILED);
        setExtractErrorCode(ERROR_CODE_METADATA_PRECONDITION_FAILED);
      } else if (error.response?.status === 500) {
        onError(error, ERROR_CODE_UNKNOWN);
        setExtractErrorCode(ERROR_CODE_UNKNOWN);
      } else if (isUserCorrectableError(error.response?.status)) {
        onError(error, ERROR_CODE_FETCH_METADATA_SUGGESTIONS, {
          showNotification: true
        });
      } else {
        onError(error, ERROR_CODE_UNKNOWN, {
          showNotification: true
        });
        // react way of throwing errors from async callbacks - https://github.com/facebook/react/issues/14981#issuecomment-468460187
        setError(() => {
          throw error;
        });
      }
      return [];
    }
    if (isEmpty(answer)) {
      const error = new Error('No suggestions found.');
      onError(error, ERROR_CODE_EMPTY_METADATA_SUGGESTIONS, {
        showNotification: true
      });
      return [];
    }
    const templateInstance = templates.find(template => template.templateKey === templateKey && template.scope);
    const fields = templateInstance?.fields || [];
    return fields.map(field => {
      const value = answer[field.key];
      // TODO: @box/metadadata-editor does not support AI suggestions, enable once supported
      if (!value || field.type === 'taxonomy') {
        return field;
      }
      return _objectSpread(_objectSpread({}, field), {}, {
        aiSuggestion: value
      });
    });
  }, [api, file, onError, templates]);
  React.useEffect(() => {
    if (status === STATUS.IDLE) {
      setStatus(STATUS.LOADING);
      api.getFileAPI().getFile(fileId, fetchFileSuccessCallback, fetchFileErrorCallback, {
        fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
        refreshCache: true
      });
    }
  }, [api, fetchFileErrorCallback, fetchFileSuccessCallback, fileId, status]);
  return {
    clearExtractError: () => setExtractErrorCode(null),
    extractSuggestions,
    handleCreateMetadataInstance,
    handleDeleteMetadataInstance,
    handleUpdateMetadataInstance,
    extractErrorCode,
    errorMessage,
    file,
    status,
    templateInstances,
    templates
  };
}
export default useSidebarMetadataFetcher;
//# sourceMappingURL=useSidebarMetadataFetcher.js.map