import { defineMessages, MessageDescriptor } from 'react-intl';

const messages: { [key: string]: MessageDescriptor } = defineMessages({
    errorFetchAnnotation: {
        id: 'be.annotattionThread.errorFetchAnnotation',
        description: 'Error message when an annotation fetch fails',
        defaultMessage: 'The annotation could not be fetched.',
    },
    errorEditAnnotation: {
        id: 'be.annotationThread.errorEditAnnotation',
        description: 'Error message when an annotation update fails',
        defaultMessage: 'This annotation could not be modified.',
    },
    errorDeleteAnnotation: {
        id: 'be.annotationThread.errorDeleteAnnotation',
        description: 'Error message when an annotation deletion fails',
        defaultMessage: 'There was an error deleting this item.',
    },
});

export default messages;
