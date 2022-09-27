import {
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_EDIT_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
} from '../../../../constants';
import messages from './messages';
import commonMessages from '../../../common/messages';

const annotationErrors = {
    [ERROR_CODE_FETCH_ANNOTATION]: messages.errorFetchAnnotation,
    [ERROR_CODE_EDIT_ANNOTATION]: messages.errorEditAnnotation,
    [ERROR_CODE_DELETE_ANNOTATION]: messages.errorDeleteAnnotation,
    default: commonMessages.error,
};

export default annotationErrors;
