const intlMock = {
    formatMessage: message => message.defaultMessage || message.message,
    formatDate: date => date,
};

export default intlMock;
