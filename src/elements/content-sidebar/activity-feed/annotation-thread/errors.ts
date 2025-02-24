import { MessageDescriptor } from 'react-intl';
import {
    ERROR_CODE_CREATE_REPLY,
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_DELETE_COMMENT,
    ERROR_CODE_EDIT_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
    ERROR_CODE_UPDATE_COMMENT,
} from '../../../../constants';
import apiMessages from '../../../../api/messages';
import commonMessages from '../../../common/messages';
import messages from './messages';

interface ErrorMap {
    [key: string]: MessageDescriptor;
    default: MessageDescriptor;
}

const annotationErrors: ErrorMap = {
    [ERROR_CODE_FETCH_ANNOTATION]: messages.errorFetchAnnotation,
    [ERROR_CODE_EDIT_ANNOTATION]: messages.errorEditAnnotation,
    [ERROR_CODE_DELETE_ANNOTATION]: messages.errorDeleteAnnotation,
    default: commonMessages.error,
};

const commentsErrors: ErrorMap = {
    [ERROR_CODE_UPDATE_COMMENT]: apiMessages.commentUpdateErrorMessage,
    [ERROR_CODE_CREATE_REPLY]: apiMessages.commentCreateErrorMessage,
    [ERROR_CODE_DELETE_COMMENT]: apiMessages.commentDeleteErrorMessage,
    default: commonMessages.error,
};

export { annotationErrors, commentsErrors };
