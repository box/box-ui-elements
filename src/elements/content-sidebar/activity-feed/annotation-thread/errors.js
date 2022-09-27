import {
    ERROR_CODE_CREATE_REPLY,
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_DELETE_COMMENT,
    ERROR_CODE_EDIT_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
    ERROR_CODE_UPDATE_COMMENT,
} from '../../../../constants';
import messages from './messages';
import commonMessages from '../../../common/messages';

const annotationErrors = {
    [ERROR_CODE_FETCH_ANNOTATION]: messages.errorFetchAnnotation,
    [ERROR_CODE_EDIT_ANNOTATION]: messages.errorEditAnnotation,
    [ERROR_CODE_DELETE_ANNOTATION]: messages.errorDeleteAnnotation,
    default: commonMessages.error,
};

const repliesErrors = {
    [ERROR_CODE_UPDATE_COMMENT]: messages.commentUpdateErrorMessage,
    [ERROR_CODE_CREATE_REPLY]: messages.commentCreateErrorMessage,
    [ERROR_CODE_DELETE_COMMENT]: messages.commentDeleteErrorMessage,
    default: commonMessages.error,
};

export { annotationErrors, repliesErrors };
