import {
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_EDIT_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
} from '../../../../constants';
import messages from './messages';

const AnnotationErrors = {
    [ERROR_CODE_FETCH_ANNOTATION]: messages.errorFetchAnnotation,
    [ERROR_CODE_EDIT_ANNOTATION]: messages.errorEditAnnotation,
    [ERROR_CODE_DELETE_ANNOTATION]: messages.errorDeleteAnnotation,
};

export default AnnotationErrors;
