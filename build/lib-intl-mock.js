const intlMock = {
    formatMessage: (message) => message.defaultMessage || message.message,
    formatDate: (date) => date
};

export const addLocaleData = () => {};
export default intlMock;
